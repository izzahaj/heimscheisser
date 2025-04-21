package review

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup, handler *Handler) {
	router := rg.Group("/toilets/:id/reviews")
	router.POST("", handler.CreateReview)
	router.GET("", handler.GetAllReviewsByToiletID)
	router.GET("/:reviewId", handler.GetReviewByID)
	router.PUT("/:reviewId", handler.UpdateReview)
	router.DELETE("/:reviewId", handler.DeleteReview)
}
