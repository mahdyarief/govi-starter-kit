package handlers

import (
	"github.com/gofiber/fiber/v3"

	"govi/internal/app"
	"govi/internal/dtos"
	"govi/internal/lib"
	"govi/internal/lib/apperr"
	"govi/internal/repositories"
)

type meHandler struct {
	app *app.Application
}

func (h *meHandler) repo() *repositories.UserRepository {
	return &h.app.Repositories.User
}

// Get returns the signed-in user's profile, including the application role
// Authula itself does not know about.
func (h *meHandler) Get(c fiber.Ctx) error {
	uid, err := lib.ContextGetUID(c)
	if err != nil {
		return apperr.ErrUnauthorized
	}

	user, err := h.repo().GetByID(c.Context(), uid)
	if err != nil {
		return err
	}
	return dtos.Get(c, user)
}
