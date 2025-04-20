package toilet

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/review"
	"gorm.io/gorm"
	"net/http"
)

type Handler struct {
	service       Service
	reviewService review.Service
}

func NewHandler(service Service, reviewService review.Service) *Handler {
	return &Handler{service, reviewService}
}

func (h *Handler) CreateToilet(context *gin.Context) {
	var toilet Toilet

	if err := context.ShouldBindJSON(&toilet); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateToilet(&toilet); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, toilet)
}

func (h *Handler) GetAllToilets(context *gin.Context) {
	toilets, err := h.service.GetAllToilets()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, toilets)
}

func (h *Handler) GetToiletByID(context *gin.Context) {
	id, err := uuid.Parse(context.Param("id"))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	toilet, err := h.service.GetToiletByID(id)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		context.JSON(http.StatusNotFound, gin.H{"error": "Toilet not found"})
		return
	}

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	avgRating, err := h.reviewService.GetAverageRating(id)

	if err != nil {
		// Log the error but still return the toilet
		fmt.Printf("failed to get average rating: %v\n", err)
		toilet.AverageRating = 0.0
	} else {
		toilet.AverageRating = avgRating
	}

	context.JSON(http.StatusOK, toilet)
}

func (h *Handler) UpdateToilet(context *gin.Context) {
	id, err := uuid.Parse(context.Param("id"))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	_, err = h.service.GetToiletByID(id)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		context.JSON(http.StatusNotFound, gin.H{"error": "Toilet not found"})
		return
	}

	var toilet Toilet

	if err = context.ShouldBindJSON(&toilet); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	toilet.ID = id

	if err = h.service.UpdateToilet(&toilet); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, toilet)
}

func (h *Handler) DeleteToilet(context *gin.Context) {
	id, err := uuid.Parse(context.Param("id"))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	_, err = h.service.GetToiletByID(id)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		context.JSON(http.StatusNotFound, gin.H{"error": "Toilet not found"})
		return
	}

	if err = h.service.DeleteToilet(id); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusNoContent, nil)
}
