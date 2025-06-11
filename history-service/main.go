package main

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/izzahaj/heimscheisser/history-service/config"
	"github.com/izzahaj/heimscheisser/history-service/database"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/consumer"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/handler"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/repository"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/router"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/service"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nats-io/nats.go"
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
		slog.Info("Error loading config", slog.String("response=", err.Error()))
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

	changesetRepo := repository.NewRepository(db)
	changesetService := service.NewService(changesetRepo)
	changesetHandler := handler.NewHandler(changesetService)
	changesetConsumer := consumer.NewConsumer(changesetService)

	var nc *nats.Conn

	nc, err = nats.Connect(nats.DefaultURL)

	if err != nil {
		slog.Error("error connecting to nats", slog.Any("error", err))
		return
	}

	defer nc.Drain()

	if err = changesetConsumer.Subscribe(nc); err != nil {
		slog.Error("error subscribing to NATS", slog.Any("error", err))
		return
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*"},
		AllowedMethods: []string{"GET"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	r.Route("/api/v1/history-service", func(r chi.Router) {
		router.RegisterRoutes(r, changesetHandler)
	})

	port := os.Getenv("PORT")

	if port == "" {
		port = "8000" // default if PORT is not set
	}

	slog.Info("Starting server", slog.String("port", port))

	if err = http.ListenAndServe(fmt.Sprintf(":%s", port), r); err != nil {
		slog.Error("failed to start server", slog.Any("error", err))
		return
	}
}
