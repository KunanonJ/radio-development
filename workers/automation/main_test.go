package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rr := httptest.NewRecorder()

	healthHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}
}

func TestParseCommand(t *testing.T) {
	value := "station_1"
	command := parseCommand(&FirestoreDocument{
		Name: "projects/the-urban-radio/databases/(default)/documents/workerCommands/command_1",
		Fields: map[string]FirestoreValue{
			"stationId": {StringValue: &value},
			"type":      {StringValue: stringPointer("station.provision")},
			"status":    {StringValue: stringPointer("pending")},
		},
	})

	if command.DocumentID != "command_1" {
		t.Fatalf("expected command_1, got %s", command.DocumentID)
	}
	if command.Status != "pending" {
		t.Fatalf("expected pending, got %s", command.Status)
	}
}

func stringPointer(value string) *string {
	return &value
}
