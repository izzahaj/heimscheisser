package toilet

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup, handler *Handler) {
	router := rg.Group("/toilets")
	router.POST("", handler.CreateToilet)
	router.GET("", handler.GetAllToilets)
	router.GET("/:id", handler.GetToiletByID)
	router.PUT("/:id", handler.UpdateToilet)
	router.DELETE("/:id", handler.DeleteToilet)
}
