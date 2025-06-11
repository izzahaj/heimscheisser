package config

import (
	"os"
	"strconv"
	"time"
)

type DBConfig struct {
	Host              string
	Port              int
	UserName          string
	Password          string
	DBName            string
	MaxConns          int32
	MinConns          int32
	MaxConnLifeTime   time.Duration
	MaxConnIdleTime   time.Duration
	HealthCheckPeriod time.Duration
}

func LoadDBConfig() (*DBConfig, error) {
	var cfg DBConfig

	cfg.Host = os.Getenv("DB_HOST")
	cfg.Port, _ = strconv.Atoi(os.Getenv("DB_PORT"))
	cfg.UserName = os.Getenv("DB_USERNAME")
	cfg.Password = os.Getenv("DB_PASSWORD")
	cfg.DBName = os.Getenv("DB_NAME")
	cfg.MaxConns = 10
	cfg.MinConns = 2
	cfg.MaxConnLifeTime = 30 * time.Minute
	cfg.MaxConnIdleTime = 10 * time.Minute
	cfg.HealthCheckPeriod = 2 * time.Minute

	return &cfg, nil
}
