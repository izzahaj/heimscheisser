package changeset

import "github.com/google/uuid"

type ToiletUpdatedEvent struct {
	EventID     uuid.UUID `json:"event_id"`
	ToiletID    uuid.UUID `json:"toilet_id"`
	ChangedBy   string    `json:"changed_by"`
	Description string    `json:"description"`
	NewState    []byte    `json:"new_state"`
}

type ToiletCreatedEvent ToiletUpdatedEvent
