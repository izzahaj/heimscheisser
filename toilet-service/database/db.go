package database

import (
	"context"
	"fmt"
	"github.com/izzahaj/heimscheisser/toilet-service/config"
	"github.com/jackc/pgx/v5/pgxpool"
	"log/slog"
	"sync"
)

var (
	pgOnce sync.Once
)

func NewPGXPool(ctx context.Context, dbConfig *config.DBConfig) (*pgxpool.Pool, error) {
	var db *pgxpool.Pool

	connString := fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%d",
		dbConfig.User, dbConfig.Password, dbConfig.DBName, dbConfig.Host, dbConfig.Port,
	)

	cfg, err := pgxpool.ParseConfig(connString)

	if err != nil {
		slog.Error("Error parsing connection cfg", slog.String("response", err.Error()))
		panic(err)
	}

	cfg.MaxConns = dbConfig.MaxConns
	cfg.MinConns = dbConfig.MinConns
	cfg.MaxConnLifetime = dbConfig.MaxConnLifeTime
	cfg.MaxConnIdleTime = dbConfig.MaxConnIdleTime
	cfg.HealthCheckPeriod = dbConfig.HealthCheckPeriod

	pgOnce.Do(func() {
		db, err = pgxpool.NewWithConfig(ctx, cfg)
	})

	if err = db.Ping(ctx); err != nil {
		slog.Error("Unable to ping database", slog.String("response", err.Error()))
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	slog.Info("Successfully connected to database")
	return db, nil
}
