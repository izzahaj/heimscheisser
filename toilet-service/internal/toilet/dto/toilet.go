package dto

type CreateToiletDTO struct {
	Name        string   `json:"name" validate:"required,min=1,max=255" db:"name"`
	Latitude    float64  `json:"latitude" validate:"required,latitude"`
	Longitude   float64  `json:"longitude" validate:"required,longitude"`
	Description string   `json:"description" validate:"max=1250" db:"description"`
	Genders     []string `json:"genders" validate:"required,min=1,unique,dive,genders" db:"genders"`
	HasHandicap bool     `json:"hasHandicap" validate:"required" db:"has_handicap"`
	HasBidet    bool     `json:"hasBidet" validate:"required" db:"has_bidet"`
	IsPaid      bool     `json:"isPaid" validate:"required" db:"is_paid"`
	BidetTypes  []string `json:"bidetTypes" validate:"required,unique,dive,bidettypes" db:"bidet_types"`
}

type UpdateToiletDTO struct {
	Name        *string   `json:"name,omitempty" validate:"omitempty,min=1,max=255" db:"name"`
	Latitude    *float64  `json:"latitude,omitempty" validate:"omitempty,latitude" db:"latitude"`
	Longitude   *float64  `json:"longitude,omitempty" validate:"omitempty,longitude" db:"longitude"`
	Description *string   `json:"description,omitempty" validate:"omitempty,max=1250" db:"description"`
	Genders     *[]string `json:"genders,omitempty" validate:"omitempty,min=1,unique,dive,genders" db:"genders"`
	HasHandicap *bool     `json:"hasHandicap,omitempty" db:"has_handicap"`
	HasBidet    *bool     `json:"hasBidet,omitempty" db:"has_bidet"`
	IsPaid      *bool     `json:"isPaid,omitempty" db:"is_paid"`
	BidetTypes  *[]string `json:"bidetTypes,omitempty" validate:"omitempty,unique,dive,bidettypes" db:"bidet_types"`
}

type NearbyToiletQuery struct {
	Latitude  float64 `json:"latitude" validate:"required,latitude"`
	Longitude float64 `json:"longitude" validate:"required,longitude"`
	Radius    float64 `json:"radius" validate:"required,gt=0"`
}
