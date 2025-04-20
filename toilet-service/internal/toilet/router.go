package toilet

import (
	"github.com/gin-gonic/gin"
)

func NewRouter(rg *gin.RouterGroup) *gin.RouterGroup {
	router := rg.Group("/toilets")
	return router
}

func RegisterRoutes(rg *gin.RouterGroup, handler *Handler) {
	rg.POST("", handler.CreateToilet)
	rg.GET("", handler.GetAllToilets)
	rg.GET("/:id", handler.GetToiletByID)
	rg.PUT("/:id", handler.UpdateToilet)
	rg.DELETE("/:id", handler.DeleteToilet)
}
