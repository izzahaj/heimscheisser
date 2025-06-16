package repository

import (
	"context"
	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, toilet *model.Toilet) error
	GetNearby(ctx context.Context, lat, lng, radius float64) ([]model.Toilet, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Toilet, error)
	UpdateByID(ctx context.Context, id uuid.UUID, toilet *model.Toilet) error
	DeleteByID(ctx context.Context, id uuid.UUID) error
	ExistsByID(ctx context.Context, id uuid.UUID) (bool, error)
}

type ToiletRepository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &ToiletRepository{db}
}

func (r *ToiletRepository) Create(ctx context.Context, toilet *model.Toilet) error {
	query := `
		INSERT INTO toilets (
		    name, description, location, genders, has_handicap, has_bidet, is_paid, bidet_types
		)
		VALUES (
		    $1, $2, ST_SetSRID(ST_MakePoint($4, $3), 4326), $5, $6, $7, $8, $9
		)
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRow(
		ctx,
		query,
		toilet.Name,
		toilet.Description,
		toilet.Latitude,
		toilet.Longitude,
		toilet.Genders,
		toilet.HasHandicap,
		toilet.HasBidet,
		toilet.IsPaid,
		toilet.BidetTypes,
	).Scan(
		toilet.ID,
		toilet.CreatedAt,
		toilet.UpdatedAt,
	)
}

func (r *ToiletRepository) GetNearby(ctx context.Context, lat, lng, radius float64) ([]model.Toilet, error) {
	query := `
		SELECT id, name, description, ST_Y(location::geometry) AS latitude, ST_X(location::geometry) AS longitude,
		       genders, has_handicap, has_bidet, is_paid, bidet_types, created_at, updated_at
		FROM toilets
		WHERE ST_DWithin(
			location::geography,
			ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
			$3
		)
	`

	rows, err := r.db.Query(ctx, query, lat, lng, radius)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var toilets []model.Toilet

	for rows.Next() {
		var t model.Toilet
		err = rows.Scan(
			&t.ID,
			&t.Name,
			&t.Description,
			&t.Latitude,
			&t.Longitude,
			&t.Genders,
			&t.HasHandicap,
			&t.HasBidet,
			&t.IsPaid,
			&t.BidetTypes,
			&t.CreatedAt,
			&t.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		toilets = append(toilets, t)
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return toilets, nil
}

func (r *ToiletRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Toilet, error) {
	query := `SELECT * FROM toilets WHERE id = $1`

	var t model.Toilet

	err := r.db.QueryRow(ctx, query, id).Scan(
		&t.ID,
		&t.Name,
		&t.Description,
		&t.Latitude,
		&t.Longitude,
		&t.Genders,
		&t.HasHandicap,
		&t.HasBidet,
		&t.IsPaid,
		&t.BidetTypes,
		&t.CreatedAt,
		&t.UpdatedAt,
	)

	return &t, err
}

func (r *ToiletRepository) UpdateByID(ctx context.Context, id uuid.UUID, toilet *model.Toilet) error {
	query := `
		UPDATE toilets
		SET name = $1,
		    description = $2,
		    location = ST_SetSRID(ST_MakePoint($4, $3), 4326),
		    genders = $5,
		    has_handicap = $6,
		    has_bidet = $7,
		    is_paid = $8,
		    bidet_types = $9,
		WHERE id = $10
		RETURNING updated_at
	`

	return r.db.QueryRow(
		ctx,
		query,
		toilet.Name,
		toilet.Description,
		toilet.Latitude,
		toilet.Longitude,
		toilet.Genders,
		toilet.HasHandicap,
		toilet.HasBidet,
		toilet.IsPaid,
		toilet.BidetTypes,
		id,
	).Scan(
		toilet.UpdatedAt,
	)
}

func (r *ToiletRepository) DeleteByID(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM toilets WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *ToiletRepository) ExistsByID(ctx context.Context, id uuid.UUID) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM toilets WHERE id = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, id).Scan(&exists)
	return exists, err
}
