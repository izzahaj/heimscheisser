package router

import (
	"github.com/go-chi/chi/v5"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/handler"
)

func RegisterRoutes(r chi.Router, handler *handler.Handler) {
	r.Group(func(r chi.Router) {
		r.Get("/changesets/{changesetID}", handler.GetChangesetByID)
		r.Get("/toilets/{toiletID}/changesets", handler.GetAllChangesetsByToiletID)
	})
}
