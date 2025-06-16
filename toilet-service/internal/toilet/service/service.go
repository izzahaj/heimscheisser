package service

import (
	"context"
	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/dto"
	toileterror "github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/error"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/model"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/repository"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/validation"
)

type Service interface {
	CreateToilet(ctx context.Context, userID string, dto dto.CreateToiletDTO) (*model.Toilet, error)
	GetNearbyToilets(ctx context.Context, dto dto.NearbyToiletQuery) ([]model.Toilet, error)
	GetToiletByID(ctx context.Context, id uuid.UUID) (*model.Toilet, error)
	UpdateToiletByID(ctx context.Context, userID string, id uuid.UUID, dto dto.UpdateToiletDTO) (*model.Toilet, error)
	DeleteToiletByID(ctx context.Context, id uuid.UUID) error
}

type ToiletService struct {
	repo repository.Repository
}

func NewService(repo repository.Repository) Service {
	return &ToiletService{repo}
}

func (s *ToiletService) CreateToilet(ctx context.Context, userID string, dto dto.CreateToiletDTO) (*model.Toilet, error) {
	if err := validation.Validate.Struct(dto); err != nil {
		return nil, err
	}

	toilet := &model.Toilet{
		Name:        dto.Name,
		Latitude:    dto.Latitude,
		Longitude:   dto.Longitude,
		Description: dto.Description,
		Genders:     dto.Genders,
		HasHandicap: dto.HasHandicap,
		HasBidet:    dto.HasBidet,
		BidetTypes:  dto.BidetTypes,
		IsPaid:      dto.IsPaid,
	}

	if err := s.repo.Create(ctx, toilet); err != nil {
		return nil, err
	}

	//TODO send CreateToiletEvent to history service

	return toilet, nil
}

func (s *ToiletService) GetNearbyToilets(ctx context.Context, dto dto.NearbyToiletQuery) ([]model.Toilet, error) {
	if err := validation.Validate.Struct(dto); err != nil {
		return nil, err
	}

	toilets, err := s.repo.GetNearby(ctx, dto.Latitude, dto.Longitude, dto.Radius)
	if err != nil {
		return nil, err
	}

	return toilets, nil
}

func (s *ToiletService) GetToiletByID(ctx context.Context, id uuid.UUID) (*model.Toilet, error) {
	toilet, err := s.repo.GetByID(ctx, id)

	if err != nil {
		return nil, err
	}

	if toilet == nil {
		return nil, toileterror.ErrNotFound
	}

	return toilet, nil
}

//TODO send UpdateToiletEvent to history service

func (s *ToiletService) UpdateToiletByID(ctx context.Context, userID string, id uuid.UUID, dto dto.UpdateToiletDTO) (*model.Toilet, error) {
	if err := validation.Validate.Struct(dto); err != nil {
		return nil, err
	}

	toilet, err := s.repo.GetByID(ctx, id)

	if err != nil {
		return nil, err
	}

	if toilet == nil {
		return nil, toileterror.ErrNotFound
	}

	if dto.Name != nil {
		toilet.Name = *dto.Name
	}
	if dto.Latitude != nil {
		toilet.Latitude = *dto.Latitude
	}
	if dto.Longitude != nil {
		toilet.Longitude = *dto.Longitude
	}
	if dto.Description != nil {
		toilet.Description = *dto.Description
	}
	if dto.Genders != nil {
		toilet.Genders = *dto.Genders
	}
	if dto.HasHandicap != nil {
		toilet.HasHandicap = *dto.HasHandicap
	}
	if dto.HasBidet != nil {
		toilet.HasBidet = *dto.HasBidet
	}
	if dto.IsPaid != nil {
		toilet.IsPaid = *dto.IsPaid
	}
	if dto.BidetTypes != nil {
		toilet.BidetTypes = *dto.BidetTypes
	}

	err = s.repo.UpdateByID(ctx, id, toilet)

	if err != nil {
		return nil, err
	}

	return toilet, nil
}

//TODO send DeleteToiletEvent to history service

func (s *ToiletService) DeleteToiletByID(ctx context.Context, id uuid.UUID) error {
	exists, err := s.repo.ExistsByID(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return toileterror.ErrNotFound
	}

	return s.repo.DeleteByID(ctx, id)
}
