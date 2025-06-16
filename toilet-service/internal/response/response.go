package response

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/validation"
	"log/slog"
	"net/http"
)

type ErrorResponse struct {
	Code    int               `json:"code"`
	Message string            `json:"message"`
	Errors  map[string]string `json:"errors,omitempty"`
}

func WriteJson(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	if status == http.StatusNoContent {
		return
	}

	b, err := json.MarshalIndent(v, "", "    ")
	if err != nil {
		slog.Error("error marshalling JSON: %v", err)
		fallback := fmt.Sprintf(`{"code":%d,"message":"%s"}`, http.StatusInternalServerError, "Internal Server Error")
		http.Error(w, fallback, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(status)

	_, err = w.Write(b)
	if err != nil {
		slog.Error("error writing JSON: %v", err)
	}
}

func JsonErrorResponse(w http.ResponseWriter, err error, code int) {
	errorResponse := ErrorResponse{
		Code:    code,
		Message: err.Error(),
	}

	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		errorsMap := validation.ParseValidationErrors(ve)
		errorResponse.Errors = errorsMap
		errorResponse.Message = "validation failed"
	}

	WriteJson(w, code, errorResponse)
}
