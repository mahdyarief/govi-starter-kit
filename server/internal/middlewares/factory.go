package middlewares

import "govi/internal/app"

type Middlewares struct {
	app *app.Application
}

func New(app *app.Application) *Middlewares {
	return &Middlewares{app: app}
}
