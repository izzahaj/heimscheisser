package model

import (
	"time"

	"github.com/google/uuid"
)

type Toilet struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" validate:"required,min=1,max=255" db:"name"`
	Latitude    float64   `json:"latitude" validate:"required,latitude"`
	Longitude   float64   `json:"longitude" validate:"required,longitude"`
	Description string    `json:"description" validate:"max=1250" db:"description"`
	Genders     []string  `json:"genders" validate:"required,min=1,unique,dive,genders" db:"genders"`
	HasHandicap bool      `json:"hasHandicap" db:"has_handicap"`
	HasBidet    bool      `json:"hasBidet" db:"has_bidet"`
	IsPaid      bool      `json:"isPaid" db:"is_paid"`
	BidetTypes  []string  `json:"bidetTypes" validate:"required,unique,dive,bidettypes" db:"bidet_types"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updated_at"`
}
