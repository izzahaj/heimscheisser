package review

import (
	"github.com/google/uuid"
	"time"
)

type Review struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ToiletID  uuid.UUID `gorm:"type:uuid;not null" json:"toiletId"`
	Rating    int       `gorm:"not null;check:rating >= 1 AND rating <= 5" json:"rating"`
	Comment   string    `json:"comment"`
	CreatedBy string    `gorm:"not null" json:"createdBy"`
	CreatedAt time.Time `gorm:"not null;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime; not null" json:"updatedAt"`
}
