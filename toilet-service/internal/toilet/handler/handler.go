package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/response"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/dto"
	toileterror "github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/error"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/service"
	"net/http"
	"strconv"
)

type Handler struct {
	service service.Service
}

func NewHandler(service service.Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) CreateToilet(w http.ResponseWriter, r *http.Request) {
	var createDTO dto.CreateToiletDTO

	if err := json.NewDecoder(r.Body).Decode(&createDTO); err != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid JSON"), http.StatusBadRequest)
		return
	}

	//userID, err := GetUserIDFromContext(r.Context())
	//
	//if err != nil {
	//	response.JsonErrorResponse(w, err, http.StatusUnauthorized)
	//	return
	//}
	userID := "USER_ID"

	t, err := h.service.CreateToilet(r.Context(), userID, createDTO)

	if err != nil {
		var ve validator.ValidationErrors

		if errors.As(err, &ve) {
			response.JsonErrorResponse(w, ve, http.StatusBadRequest)
		} else {
			response.JsonErrorResponse(w, err, http.StatusInternalServerError)
		}
		return
	}

	response.WriteJson(w, http.StatusCreated, t)
}

func (h *Handler) GetNearbyToilets(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	minLat, errMinLat := strconv.ParseFloat(query.Get("minLat"), 64)
	if errMinLat != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid format for 'minLat': must be a float"), http.StatusBadRequest)
		return
	}

	minLng, errMinLng := strconv.ParseFloat(query.Get("minLng"), 64)
	if errMinLng != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid format for 'minLng': must be a float"), http.StatusBadRequest)
		return
	}

	maxLat, errMaxLat := strconv.ParseFloat(query.Get("maxLat"), 64)
	if errMaxLat != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid format for 'maxLat': must be a float"), http.StatusBadRequest)
		return
	}

	maxLng, errMaxLng := strconv.ParseFloat(query.Get("maxLng"), 64)
	if errMaxLng != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid format for 'maxLng': must be a float"), http.StatusBadRequest)
		return
	}

	queryDTO := dto.NearbyToiletQuery{
		MinLat: minLat,
		MinLng: minLng,
		MaxLat: maxLat,
		MaxLng: maxLng,
	}

	toilets, err := h.service.GetNearbyToilets(r.Context(), queryDTO)

	if err != nil {
		var ve validator.ValidationErrors

		if errors.As(err, &ve) {
			response.JsonErrorResponse(w, ve, http.StatusBadRequest)
		} else {
			response.JsonErrorResponse(w, err, http.StatusInternalServerError)
		}
		return
	}

	response.WriteJson(w, http.StatusCreated, toilets)
}

func (h *Handler) GetToiletByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "ID")
	id, err := uuid.Parse(idStr)

	if err != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid toilet ID"), http.StatusBadRequest)
		return
	}

	toilet, err := h.service.GetToiletByID(r.Context(), id)

	if err != nil {
		if errors.Is(err, toileterror.ErrNotFound) {
			response.JsonErrorResponse(w, err, http.StatusNotFound)
		} else {
			response.JsonErrorResponse(w, err, http.StatusInternalServerError)
		}
		return
	}

	response.WriteJson(w, http.StatusOK, toilet)
}

func (h *Handler) UpdateToiletByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "ID")
	id, err := uuid.Parse(idStr)

	if err != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid toilet ID"), http.StatusBadRequest)
		return
	}

	var updateDTO dto.UpdateToiletDTO

	if err = json.NewDecoder(r.Body).Decode(&updateDTO); err != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid JSON"), http.StatusBadRequest)
		return
	}

	//userID, err := GetUserIDFromContext(r.Context())
	//
	//if err != nil {
	//	response.JsonErrorResponse(w, err, http.StatusUnauthorized)
	//	return
	//}
	userID := "USER_ID"

	toilet, err := h.service.UpdateToiletByID(r.Context(), userID, id, updateDTO)

	if err != nil {
		var ve validator.ValidationErrors

		switch {
		case errors.As(err, &ve):
			response.JsonErrorResponse(w, ve, http.StatusBadRequest)
		case errors.Is(err, toileterror.ErrNotFound):
			response.JsonErrorResponse(w, err, http.StatusNotFound)
		default:
			response.JsonErrorResponse(w, err, http.StatusInternalServerError)
		}
		return
	}

	response.WriteJson(w, http.StatusOK, toilet)
}

func (h *Handler) DeleteToiletByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "ID")
	id, err := uuid.Parse(idStr)

	if err != nil {
		response.JsonErrorResponse(w, fmt.Errorf("invalid toilet ID"), http.StatusBadRequest)
		return
	}

	//_, err := GetUserIDFromContext(r.Context())
	//
	//if err != nil {
	//	response.JsonErrorResponse(w, err, http.StatusUnauthorized)
	//	return
	//}

	if err = h.service.DeleteToiletByID(r.Context(), id); err != nil {
		if errors.Is(err, toileterror.ErrNotFound) {
			response.JsonErrorResponse(w, err, http.StatusNotFound)
		} else {
			response.JsonErrorResponse(w, err, http.StatusInternalServerError)
		}
		return
	}
	response.WriteJson(w, http.StatusNoContent, nil)
}

func GetUserIDFromContext(ctx context.Context) (string, error) {
	uid, ok := ctx.Value("userID").(string)
	if !ok || uid == "" {
		return "", toileterror.ErrUnauthorized
	}
	return uid, nil
}
