package main

import (
	"github.com/gin-gonic/gin"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/database"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/review"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet"
	"log"
	"net/http"
)

func main() {
	if err := database.ConnectDatabase(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "hello world"})
	})

	// TODO: refactor this

	reviewRepo := review.NewRepository(database.DB)
	reviewService := review.NewService(reviewRepo)
	reviewHandler := review.NewHandler(reviewService)

	toiletRepo := toilet.NewRepository(database.DB)
	toiletService := toilet.NewService(toiletRepo)
	toiletHandler := toilet.NewHandler(toiletService, reviewService)

	api := r.Group("/api/v1/toilet-service")
	toiletRouter := toilet.NewRouter(api)
	reviewRouter := review.NewRouter(toiletRouter)

	toilet.RegisterRoutes(toiletRouter, toiletHandler)
	review.RegisterRoutes(reviewRouter, reviewHandler)

	if err := r.Run(":5000"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
