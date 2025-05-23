package toilet

import (
	"time"

	"github.com/google/uuid"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/review"
	"github.com/lib/pq"
)

type Toilet struct {
	ID            uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Name          string          `gorm:"not null" json:"name"`
	Latitude      float64         `gorm:"not null" json:"latitude"`  // add range check
	Longitude     float64         `gorm:"not null" json:"longitude"` // add range check
	Description   string          `json:"description"`
	GenderTypes   pq.StringArray  `gorm:"type:text[];not null" json:"genderTypes"` // ["male", "female", "gender-neutral"]
	HasHandicap   bool            `gorm:"not null" json:"hasHandicap"`
	BidetTypes    pq.StringArray  `gorm:"type:text[];not null" json:"bidetTypes"` // ['none', 'hand-held', 'attachment', 'standalone']
	IsPaid        bool            `gorm:"not null" json:"isPaid"`
	Reviews       []review.Review `gorm:"foreignKey:ToiletID;constraint:OnDelete:CASCADE;" json:"reviews"`
	AverageRating float64         `gorm:"-" json:"averageRating"`
	CreatedAt     time.Time       `gorm:"autoCreateTime; not null" json:"createdAt"`
	UpdatedAt     time.Time       `gorm:"autoUpdateTime; not null" json:"updatedAt"`
	UpdatedBy     string          `gorm:"not null" json:"updatedBy"`
}
