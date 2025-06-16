package main

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/izzahaj/heimscheisser/toilet-service/config"
	"github.com/izzahaj/heimscheisser/toilet-service/database"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/handler"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/repository"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/router"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/service"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/validation"
	"github.com/jackc/pgx/v5/pgxpool"
	"log/slog"
	"net/http"
	"os"
)

type App struct {
	DBClient *pgxpool.Pool
}

func main() {
	rootCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	dbConfig, err := config.LoadDBConfig()

	if err != nil {
		slog.Error("Error loading config", slog.String("response=", err.Error()))
	}

	slog.Info("config", slog.Any("c=", dbConfig))

	var db *pgxpool.Pool

	db, err = database.NewPGXPool(rootCtx, dbConfig)

	if err != nil {
		slog.Error("Error connecting to database", slog.String("response", err.Error()))
		panic(err)
	}

	defer db.Close()

	_ = &App{
		DBClient: db,
	}

	if err = validation.InitValidator(); err != nil {
		slog.Error("Error initializing validator", slog.String("response", err.Error()))
	}

	toiletRepo := repository.NewRepository(db)
	toiletService := service.NewService(toiletRepo)
	toiletHandler := handler.NewHandler(toiletService)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	r.Route("/api/v1/toilet-service", func(r chi.Router) {
		router.RegisterRoutes(r, toiletHandler)
	})

	port := os.Getenv("PORT")

	if port == "" {
		port = "5000" // default if PORT is not set
	}

	slog.Info("Starting server", slog.String("port", port))

	if err = http.ListenAndServe(fmt.Sprintf(":%s", port), r); err != nil {
		slog.Error("failed to start server", slog.Any("error", err))
		return
	}
}
