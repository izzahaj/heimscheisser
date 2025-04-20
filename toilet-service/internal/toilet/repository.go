package toilet

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(toilet *Toilet) error
	GetAll() ([]Toilet, error)
	GetByID(id uuid.UUID) (*Toilet, error)
	Update(toilet *Toilet) error
	Delete(id uuid.UUID) error
}

type RepositoryImpl struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &RepositoryImpl{db}
}

func (r *RepositoryImpl) Create(toilet *Toilet) error {
	return r.db.Create(toilet).Error
}

func (r *RepositoryImpl) GetAll() ([]Toilet, error) {
	var toilets []Toilet
	err := r.db.Find(&toilets).Error
	return toilets, err
}

func (r *RepositoryImpl) GetByID(id uuid.UUID) (*Toilet, error) {
	var toilet Toilet
	err := r.db.First(&toilet, "id = ?", id).Error
	return &toilet, err
}

func (r *RepositoryImpl) Update(toilet *Toilet) error {
	return r.db.Save(toilet).Error
}

func (r *RepositoryImpl) Delete(id uuid.UUID) error {
	return r.db.Delete(&Toilet{}, "id = ?", id).Error
}
