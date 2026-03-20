package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type IndexRequest struct {
	StationID string `json:"stationId"`
	Title     string `json:"title"`
}

type IndexResponse struct {
	StationID string   `json:"stationId"`
	Tokens    []string `json:"tokens"`
}

func tokenizeThaiAware(input string) []string {
	cleaned := strings.TrimSpace(input)
	if cleaned == "" {
		return []string{}
	}

	return strings.FieldsFunc(cleaned, func(r rune) bool {
		return r == '|' || r == '/' || r == '-'
	})
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	var req IndexRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_ = json.NewEncoder(w).Encode(IndexResponse{
		StationID: req.StationID,
		Tokens:    tokenizeThaiAware(req.Title),
	})
}

func main() {
	http.HandleFunc("/index", indexHandler)
	_ = http.ListenAndServe(":8087", nil)
}
