package handlers

import "govi/internal/app"

type Handlers struct {
	Health   *healthHandler
	Category *categoryHandler
	Me       *meHandler
}

func New(app *app.Application) *Handlers {
	return &Handlers{
		Health:   &healthHandler{app: app},
		Category: &categoryHandler{app: app},
		Me:       &meHandler{app: app},
	}
}
