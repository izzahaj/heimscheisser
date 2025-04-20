package review

import (
	"errors"
	"github.com/google/uuid"
	"math"
)

type Service interface {
	CreateReview(review *Review) error
	GetAllReviewsByToiletID(toiletID uuid.UUID, limit int, offset int) ([]Review, error)
	GetReviewByID(id uuid.UUID) (*Review, error)
	UpdateReview(review *Review) error
	DeleteReview(id uuid.UUID) error
	GetAverageRating(toiletID uuid.UUID) (float64, error)
}

type ServiceImpl struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &ServiceImpl{repo}
}

func (s *ServiceImpl) CreateReview(review *Review) error {
	// TODO: how to make this throw an error 400 to be handled in handler?
	if review.Rating < 1 || review.Rating > 5 {
		return errors.New("Rating must be between 1 and 5")
	}

	return s.repo.Create(review)
}

func (s *ServiceImpl) GetAllReviewsByToiletID(toiletID uuid.UUID, limit int, offset int) ([]Review, error) {
	return s.repo.GetAllByToiletID(toiletID, limit, offset)
}

func (s *ServiceImpl) GetReviewByID(id uuid.UUID) (*Review, error) {
	return s.repo.GetByID(id)
}

func (s *ServiceImpl) UpdateReview(review *Review) error {
	// TODO: how to make this throw an error 400 to be handled in handler?
	if review.Rating < 1 || review.Rating > 5 {
		return errors.New("Rating must be between 1 and 5")
	}

	return s.repo.Update(review)
}

func (s *ServiceImpl) DeleteReview(id uuid.UUID) error {
	return s.repo.Delete(id)
}

func (s *ServiceImpl) GetAverageRating(toiletID uuid.UUID) (float64, error) {
	avg, err := s.repo.GetAverageRating(toiletID)

	if err != nil {
		return 0, err
	}

	// round to one d.p.
	return math.Round(avg*10) / 10, nil
}
