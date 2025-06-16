package router

import (
	"github.com/go-chi/chi/v5"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/handler"
)

func RegisterRoutes(r chi.Router, handler *handler.Handler) {
	r.Route("/toilets", func(r chi.Router) {
		r.Post("/", handler.CreateToilet)           // POST /toilets
		r.Get("/nearby", handler.GetNearbyToilets)  // GET /toilets/nearby
		r.Get("/{ID}", handler.GetToiletByID)       // GET /toilets/{ID}
		r.Patch("/{ID}", handler.UpdateToiletByID)  // PATCH /toilets/{ID}
		r.Delete("/{ID}", handler.DeleteToiletByID) // DELETE /toilets/{ID}
	})
}
