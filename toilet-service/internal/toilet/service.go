package toilet

import (
	"github.com/google/uuid"
)

type Service interface {
	CreateToilet(toilet *Toilet) error
	GetAllToilets() ([]Toilet, error)
	GetToiletByID(id uuid.UUID) (*Toilet, error)
	UpdateToilet(toilet *Toilet) error
	DeleteToilet(id uuid.UUID) error
}

type ServiceImpl struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &ServiceImpl{repo}
}

func (s *ServiceImpl) CreateToilet(toilet *Toilet) error {
	// TODO: validation/business logic
	return s.repo.Create(toilet)
}

func (s *ServiceImpl) GetAllToilets() ([]Toilet, error) {
	return s.repo.GetAll()
}

func (s *ServiceImpl) GetToiletByID(id uuid.UUID) (*Toilet, error) {
	return s.repo.GetByID(id)
}

func (s *ServiceImpl) UpdateToilet(toilet *Toilet) error {
	// TODO: validation/business logic
	return s.repo.Update(toilet)
}

func (s *ServiceImpl) DeleteToilet(id uuid.UUID) error {
	return s.repo.Delete(id)
}
