package changeset

import (
	"github.com/google/uuid"
	"time"
)

type Changeset struct {
	ID          uuid.UUID `json:"id"`
	ToiletID    uuid.UUID `json:"toilet_id"`
	ChangedBy   string    `json:"changed_by"`
	Description string    `json:"description"`
	NewState    []byte    `json:"new_state"` // JSON
	CreatedAt   time.Time `json:"created_at"`
}
