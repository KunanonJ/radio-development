package main

import "testing"

func TestTokenizeThaiAware(t *testing.T) {
	tokens := tokenizeThaiAware("ข่าวเช้า|The Urban Radio")
	if len(tokens) != 2 {
		t.Fatalf("expected 2 tokens, got %d", len(tokens))
	}
}
