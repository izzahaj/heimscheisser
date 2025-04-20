package review

import (
	"github.com/gin-gonic/gin"
)

func NewRouter(rg *gin.RouterGroup) *gin.RouterGroup {
	router := rg.Group("/:toiletId/reviews")
	return router
}

func RegisterRoutes(rg *gin.RouterGroup, handler *Handler) {
	rg.POST("", handler.CreateReview)
	rg.GET("", handler.GetAllReviewsByToiletID)
	rg.GET("/:id", handler.GetReviewByID)
	rg.PUT("/:id", handler.UpdateReview)
	rg.DELETE("/:id", handler.DeleteReview)
}
