package review

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(review *Review) error
	GetAllByToiletID(toiletID uuid.UUID, limit int, offset int) ([]Review, error)
	GetByID(id uuid.UUID) (*Review, error)
	Update(review *Review) error
	Delete(id uuid.UUID) error
	GetAverageRating(toiletID uuid.UUID) (float64, error)
}

type RepositoryImpl struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &RepositoryImpl{db}
}

func (r *RepositoryImpl) Create(review *Review) error {
	return r.db.Create(review).Error
}

func (r *RepositoryImpl) GetAllByToiletID(toiletID uuid.UUID, limit int, offset int) ([]Review, error) {
	var reviews []Review
	err := r.db.
		Where("toilet_id = ?", toiletID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error
	return reviews, err
}

func (r *RepositoryImpl) GetByID(id uuid.UUID) (*Review, error) {
	var review Review
	err := r.db.First(&review, "id = ?", id).Error
	return &review, err
}

func (r *RepositoryImpl) Update(review *Review) error {
	return r.db.Save(review).Error
}

func (r *RepositoryImpl) Delete(id uuid.UUID) error {
	return r.db.Delete(&Review{}, "id = ?", id).Error
}

func (r *RepositoryImpl) GetAverageRating(toiletID uuid.UUID) (float64, error) {
	var avg float64
	err := r.db.Model(&Review{}).
		Where("toilet_id = ?", toiletID).
		Select("AVG(rating)").
		Scan(&avg).Error

	return avg, err
}
