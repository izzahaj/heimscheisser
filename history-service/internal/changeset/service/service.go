package service

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/repository"
	"github.com/jackc/pgx/v5"
)

type Service interface {
	CreateChangeset(ctx context.Context, changeSet *changeset.Changeset) (*changeset.Changeset, error)
	GetAllChangesetsByToiletID(ctx context.Context, toiletID uuid.UUID, limit int, offset int) ([]changeset.Changeset, error)
	GetChangesetByID(ctx context.Context, id uuid.UUID) (*changeset.Changeset, error)
}

type ServiceImpl struct {
	repo repository.Repository
}

func NewService(repo repository.Repository) Service {
	return &ServiceImpl{repo}
}

func (s ServiceImpl) CreateChangeset(ctx context.Context, changeSet *changeset.Changeset) (*changeset.Changeset, error) {
	return s.repo.Create(ctx, changeSet)
}

func (s ServiceImpl) GetAllChangesetsByToiletID(ctx context.Context, toiletID uuid.UUID, limit int, offset int) ([]changeset.Changeset, error) {
	return s.repo.GetAllByToiletID(ctx, toiletID, limit, offset)
}

func (s ServiceImpl) GetChangesetByID(ctx context.Context, id uuid.UUID) (*changeset.Changeset, error) {
	cs, err := s.repo.GetByID(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, changeset.ErrNotFound
		}

		return nil, err
	}

	return &cs, nil
}
