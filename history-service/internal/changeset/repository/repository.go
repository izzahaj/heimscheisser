package repository

import (
	"context"
	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, changeset *changeset.Changeset) (*changeset.Changeset, error)
	GetAllByToiletID(ctx context.Context, toiletID uuid.UUID, limit int, offset int) ([]changeset.Changeset, error)
	GetByID(ctx context.Context, id uuid.UUID) (changeset.Changeset, error)
}

type RepositoryImpl struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &RepositoryImpl{db}
}

func (r RepositoryImpl) Create(ctx context.Context, cs *changeset.Changeset) (*changeset.Changeset, error) {
	query := `
		INSERT INTO changesets (toilet_id, changed_by, description, new_state)
		VALUES ($1, $2, $3, $4)
		RETURNING id, toilet_id, changed_by, description, new_state, created_at
	`

	var created changeset.Changeset

	err := r.db.QueryRow(
		ctx,
		query,
		cs.ToiletID,
		cs.ChangedBy,
		cs.Description,
		cs.NewState,
		cs.CreatedAt,
	).Scan(
		&created.ID,
		&created.ToiletID,
		&created.ChangedBy,
		&created.Description,
		&created.NewState,
		&created.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &created, nil
}

func (r RepositoryImpl) GetAllByToiletID(ctx context.Context, toiletID uuid.UUID, limit int, offset int) ([]changeset.Changeset, error) {
	query := `
		SELECT id, toilet_id, changed_by, description, new_state, created_at
		FROM changesets
		WHERE toilet_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.Query(ctx, query, toiletID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var changesets []changeset.Changeset
	for rows.Next() {
		var c changeset.Changeset
		err = rows.Scan(
			&c.ID,
			&c.ToiletID,
			&c.ChangedBy,
			&c.Description,
			&c.NewState,
			&c.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		changesets = append(changesets, c)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return changesets, rows.Err()
}

func (r RepositoryImpl) GetByID(ctx context.Context, id uuid.UUID) (changeset.Changeset, error) {
	query := `
		SELECT id, toilet_id, changed_by, description, new_state, created_at
		FROM changesets
		WHERE id = $1
	`

	var c changeset.Changeset
	err := r.db.QueryRow(ctx, query, id).Scan(
		&c.ID,
		&c.ToiletID,
		&c.ChangedBy,
		&c.Description,
		&c.NewState,
		&c.CreatedAt,
	)

	return c, err
}
