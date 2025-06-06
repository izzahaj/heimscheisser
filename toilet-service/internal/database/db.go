package database

import (
	"fmt"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func ConnectDatabase() error {
	dsn := os.Getenv("DB_URL")

	if dsn == "" {
		return fmt.Errorf("Environment variable DB_URL is not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return fmt.Errorf("Failed to connect to database: %w", err)
	}

	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

	if err := db.AutoMigrate(&toilet.Toilet{}); err != nil {
		return fmt.Errorf("Failed to auto migrate: %w", err)
	}

	DB = db

	log.Println("Database connection established and migrated successfully")

	return nil
}
