package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/url"
	"net/http"
	"os"
	"strings"
	"time"
)

type HealthResponse struct {
	Service string   `json:"service"`
	Status  string   `json:"status"`
	Jobs    []string `json:"jobs"`
}

type FirestoreValue struct {
	StringValue *string                  `json:"stringValue,omitempty"`
	MapValue    *FirestoreMapValue       `json:"mapValue,omitempty"`
}

type FirestoreDocument struct {
	Name   string                    `json:"name"`
	Fields map[string]FirestoreValue `json:"fields"`
}

type FirestoreMapValue struct {
	Fields map[string]FirestoreValue `json:"fields"`
}

type RunQueryResult struct {
	Document *FirestoreDocument `json:"document,omitempty"`
}

type WorkerCommand struct {
	Name                string
	DocumentID          string
	StationID           string
	CommandType         string
	Status              string
	TenantID            string
	TenantName          string
	StationName         string
	StationSlug         string
	Plan                string
	Timezone            string
	RelayID             string
	RecordingJobID      string
	ReportJobID         string
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	payload := HealthResponse{
		Service: "automation-worker",
		Status:  "ok",
		Jobs: []string{
			"autodj_queue_execution",
			"relay_failover",
			"recording_split_retention",
			"report_dispatch",
		},
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func getEnv(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	return value
}

func projectID() string {
	return getEnv("FIREBASE_PROJECT_ID", "the-urban-radio")
}

func firestoreBaseURL() string {
	host := getEnv("FIRESTORE_EMULATOR_HOST", "127.0.0.1:8080")
	return fmt.Sprintf("http://%s/v1/projects/%s/databases/(default)/documents", host, projectID())
}

func stringField(value string) map[string]string {
	return map[string]string{"stringValue": value}
}

func getStringField(document *FirestoreDocument, key string) string {
	if document == nil {
		return ""
	}

	field, ok := document.Fields[key]
	if !ok || field.StringValue == nil {
		return ""
	}

	return *field.StringValue
}

func getNestedStringField(document *FirestoreDocument, parent string, key string) string {
	if document == nil {
		return ""
	}

	field, ok := document.Fields[parent]
	if !ok || field.MapValue == nil {
		return ""
	}

	nestedField, ok := field.MapValue.Fields[key]
	if !ok || nestedField.StringValue == nil {
		return ""
	}

	return *nestedField.StringValue
}

func parseCommand(document *FirestoreDocument) WorkerCommand {
	parts := strings.Split(document.Name, "/")
	documentID := parts[len(parts)-1]

	return WorkerCommand{
		Name:        document.Name,
		DocumentID:  documentID,
		StationID:   getStringField(document, "stationId"),
		CommandType: getStringField(document, "type"),
		Status:      getStringField(document, "status"),
		TenantID:    getNestedStringField(document, "payload", "tenantId"),
		TenantName:  getNestedStringField(document, "payload", "tenantName"),
		StationName: getNestedStringField(document, "payload", "stationName"),
		StationSlug: getNestedStringField(document, "payload", "stationSlug"),
		Plan:        getNestedStringField(document, "payload", "plan"),
		Timezone:    getNestedStringField(document, "payload", "timezone"),
		RelayID:     getNestedStringField(document, "payload", "relayId"),
		RecordingJobID: getNestedStringField(document, "payload", "recordingJobId"),
		ReportJobID: getNestedStringField(document, "payload", "reportJobId"),
	}
}

func runQuery(body any) ([]RunQueryResult, error) {
	payload, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	response, err := http.Post(firestoreBaseURL()+":runQuery", "application/json", bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	if response.StatusCode >= http.StatusBadRequest {
		return nil, fmt.Errorf("runQuery failed: %s", string(data))
	}

	var results []RunQueryResult
	if err := json.Unmarshal(data, &results); err != nil {
		return nil, err
	}

	return results, nil
}

func patchDocument(documentName string, fields map[string]any, fieldPaths []string) error {
	query := url.Values{}
	for _, fieldPath := range fieldPaths {
		query.Add("updateMask.fieldPaths", fieldPath)
	}

	payload, err := json.Marshal(map[string]any{
		"fields": fields,
	})
	if err != nil {
		return err
	}

	request, err := http.NewRequest(http.MethodPatch, fmt.Sprintf("http://%s/v1/%s?%s", getEnv("FIRESTORE_EMULATOR_HOST", "127.0.0.1:8080"), documentName, query.Encode()), bytes.NewReader(payload))
	if err != nil {
		return err
	}
	request.Header.Set("Content-Type", "application/json")

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode >= http.StatusBadRequest {
		data, _ := io.ReadAll(response.Body)
		return fmt.Errorf("patch failed: %s", string(data))
	}

	return nil
}

func fetchPendingCommand() (*WorkerCommand, error) {
	results, err := runQuery(map[string]any{
		"structuredQuery": map[string]any{
			"from": []map[string]string{
				{"collectionId": "workerCommands"},
			},
			"where": map[string]any{
				"compositeFilter": map[string]any{
					"op": "AND",
					"filters": []map[string]any{
						{
							"fieldFilter": map[string]any{
								"field": map[string]string{"fieldPath": "status"},
								"op":    "EQUAL",
								"value": stringField("pending"),
							},
						},
					},
				},
			},
			"orderBy": []map[string]any{
				{
					"field": map[string]string{"fieldPath": "createdAt"},
					"direction": "ASCENDING",
				},
			},
			"limit": 1,
		},
	})
	if err != nil {
		return nil, err
	}

	for _, result := range results {
		if result.Document != nil {
			command := parseCommand(result.Document)
			return &command, nil
		}
	}

	return nil, nil
}

func updateWorkerCommandStatus(command WorkerCommand, status string) error {
	fields := map[string]any{
		"status": stringField(status),
	}
	fieldPaths := []string{"status"}

	now := time.Now().UTC().Format(time.RFC3339)
	if status == "processing" {
		fields["processingStartedAt"] = stringField(now)
		fieldPaths = append(fieldPaths, "processingStartedAt")
	}
	if status == "completed" {
		fields["completedAt"] = stringField(now)
		fieldPaths = append(fieldPaths, "completedAt")
	}

	return patchDocument(command.Name, fields, fieldPaths)
}

func updateStationStatus(command WorkerCommand, status string) error {
	return patchDocument(
		fmt.Sprintf("projects/%s/databases/(default)/documents/stations/%s", projectID(), command.StationID),
		map[string]any{
			"status": stringField(status),
		},
		[]string{"status"},
	)
}

func writeWorkerStatus(command WorkerCommand, health string) error {
	documentName := fmt.Sprintf("projects/%s/databases/(default)/documents/workerStatuses/automation_%s", projectID(), command.StationID)
	return patchDocument(documentName, map[string]any{
		"id":            stringField(fmt.Sprintf("automation_%s", command.StationID)),
		"workerName":    stringField("automation"),
		"stationId":     stringField(command.StationID),
		"health":        stringField(health),
		"lastSeenAt":    stringField(time.Now().UTC().Format(time.RFC3339)),
		"lastCommandId": stringField(command.DocumentID),
	}, []string{"id", "workerName", "stationId", "health", "lastSeenAt", "lastCommandId"})
}

func updateRelayStatus(command WorkerCommand, status string) error {
	if strings.TrimSpace(command.RelayID) == "" {
		return nil
	}

	return patchDocument(
		fmt.Sprintf("projects/%s/databases/(default)/documents/relays/%s", projectID(), command.RelayID),
		map[string]any{
			"status": stringField(status),
		},
		[]string{"status"},
	)
}

func updateRecordingJob(command WorkerCommand, status string) error {
	if strings.TrimSpace(command.RecordingJobID) == "" {
		return nil
	}

	fields := map[string]any{
		"status": stringField(status),
	}
	fieldPaths := []string{"status"}

	if status == "running" {
		fields["startedAt"] = stringField(time.Now().UTC().Format(time.RFC3339))
		fieldPaths = append(fieldPaths, "startedAt")
	}

	return patchDocument(
		fmt.Sprintf("projects/%s/databases/(default)/documents/recordingJobs/%s", projectID(), command.RecordingJobID),
		fields,
		fieldPaths,
	)
}

func updateReportJob(command WorkerCommand, status string) error {
	if strings.TrimSpace(command.ReportJobID) == "" {
		return nil
	}

	return patchDocument(
		fmt.Sprintf("projects/%s/databases/(default)/documents/reportJobs/%s", projectID(), command.ReportJobID),
		map[string]any{
			"status": stringField(status),
		},
		[]string{"status"},
	)
}

func applyCommandEffect(command WorkerCommand) error {
	switch command.CommandType {
	case "station.provision", "queue.refresh":
		return updateStationStatus(command, "ready")
	case "relay.start":
		return updateRelayStatus(command, "active")
	case "relay.stop":
		return updateRelayStatus(command, "idle")
	case "recording.start":
		if err := updateRecordingJob(command, "running"); err != nil {
			return err
		}
		return updateStationStatus(command, "ready")
	case "recording.stop":
		return updateRecordingJob(command, "completed")
	case "report.generate":
		return updateReportJob(command, "completed")
	case "index.sync":
		return nil
	default:
		return nil
	}
}

func pollAndProcess() {
	command, err := fetchPendingCommand()
	if err != nil {
		log.Println("poll error:", err)
		return
	}

	if command == nil {
		return
	}

	log.Printf("processing command %s for station %s\n", command.DocumentID, command.StationID)
	if err := updateWorkerCommandStatus(*command, "processing"); err != nil {
		log.Println("status update error:", err)
		return
	}
	_ = writeWorkerStatus(*command, "busy")
	if err := applyCommandEffect(*command); err != nil {
		log.Println("command effect error:", err)
		_ = updateWorkerCommandStatus(*command, "failed")
		_ = writeWorkerStatus(*command, "error")
		return
	}
	if err := updateWorkerCommandStatus(*command, "completed"); err != nil {
		log.Println("complete update error:", err)
		return
	}
	_ = writeWorkerStatus(*command, "healthy")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", healthHandler)

	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		for range ticker.C {
			pollAndProcess()
		}
	}()

	port := getEnv("AUTOMATION_WORKER_PORT", "8086")
	log.Printf("automation worker listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
