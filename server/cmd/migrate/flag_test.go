package main

import "testing"

func TestIsLocalDSN(t *testing.T) {
	cases := map[string]bool{
		"postgres://u:p@localhost:5432/govi?sslmode=disable": true,
		"postgres://u:p@127.0.0.1/govi":                      true,
		"postgres://u:p@[::1]:5432/govi":                     true,
		"postgres://u:p@db.example.com:5432/govi":            false,
		"postgres://u:p@localhost.evil.com/govi":             false,
		"host=localhost dbname=govi":                         false,
		"":                                                   false,
	}
	for dsn, want := range cases {
		if got := isLocalDSN(dsn); got != want {
			t.Errorf("isLocalDSN(%q) = %v, want %v", dsn, got, want)
		}
	}
}
