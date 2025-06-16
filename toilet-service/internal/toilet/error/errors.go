package error

import "errors"

var (
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
	ErrNotFound     = errors.New("not found")
	ErrInternal     = errors.New("internal server error")
	ErrConflict     = errors.New("conflict")
)
