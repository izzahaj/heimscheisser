package handler

import (
	"errors"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/service"
	"github.com/izzahaj/heimscheisser/history-service/internal/response"
	"net/http"
	"strconv"
)

type Handler struct {
	service service.Service
}

func NewHandler(service service.Service) *Handler {
	return &Handler{service}
}

func (h *Handler) GetAllChangesetsByToiletID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "toiletID")
	id, err := uuid.Parse(idStr)

	if err != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid toilet ID"), http.StatusBadRequest)
		return
	}

	query := r.URL.Query()
	limit := 10
	offset := 0

	if l := query.Get("limit"); l != "" {
		var parsedLimit int
		parsedLimit, err = strconv.Atoi(l)
		if err != nil || parsedLimit <= 0 {
			response.JsonErrorResponse(w, fmt.Errorf("invalid limit: must be a positive integer"), http.StatusBadRequest)
			return
		}

		limit = parsedLimit
	}

	if o := query.Get("offset"); o != "" {
		var parsedOffset int
		parsedOffset, err = strconv.Atoi(o)
		if err != nil || parsedOffset < 0 {
			response.JsonErrorResponse(w, fmt.Errorf("invalid offset: must be a non-negative integer"), http.StatusBadRequest)
			return
		}

		offset = parsedOffset
	}

	var changesets []changeset.Changeset

	changesets, err = h.service.GetAllChangesetsByToiletID(r.Context(), id, limit, offset)

	if err != nil {
		response.JsonErrorResponse(w, err, http.StatusInternalServerError)
		return
	}

	response.WriteJson(w, http.StatusOK, changesets)
}

func (h *Handler) GetChangesetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "changesetID")
	id, err := uuid.Parse(idStr)

	if err != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid changeset ID"), http.StatusBadRequest)
		return
	}

	var cs *changeset.Changeset

	cs, err = h.service.GetChangesetByID(r.Context(), id)

	if err != nil {
		if errors.Is(err, changeset.ErrNotFound) {
			response.JsonErrorResponse(w, err, http.StatusNotFound)
			return
		}

		response.JsonErrorResponse(w, fmt.Errorf("internal server error"), http.StatusInternalServerError)
		return
	}

	response.WriteJson(w, http.StatusOK, cs)
}
