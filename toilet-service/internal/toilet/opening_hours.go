package toilet

type DailyOpeningHours struct {
	DayOfWeek    string `gorm:"not null" json:"dayOfWeek"`    // e.g. "Monday"
	IsClosed     bool   `gorm:"not null" json:"isClosed"`     // true = closed that day
	IsOpenAllDay bool   `gorm:"not null" json:"isOpenAllDay"` // true = open 24 hours
	Open         string `json:"open,omitempty"`               // "09:00", optional
	Close        string `json:"close,omitempty"`              // "18:00", optional
}
