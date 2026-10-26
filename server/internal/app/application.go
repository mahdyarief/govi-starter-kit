package app

import (
	"database/sql"
	"log/slog"

	authula "github.com/Authula/authula"

	"govi/internal/config"
	"govi/internal/repositories"
)

type Application struct {
	Config       config.Config
	Logger       *slog.Logger
	DB           *sql.DB
	Repositories repositories.Repositories
	Auth         *authula.Auth
}
