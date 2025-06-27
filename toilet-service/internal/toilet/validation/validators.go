package validation

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/izzahaj/heimscheisser/toilet-service/internal/toilet/dto"
)

var (
	Validate *validator.Validate
)

func InitValidator() error {
	Validate = validator.New()
	Validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := fld.Tag.Get("json")
		if name == "-" {
			return ""
		}
		return strings.Split(name, ",")[0] // remove "omitempty", etc.
	})

	if err := Validate.RegisterValidation("genders", gendersValidator); err != nil {
		return err
	}
	if err := Validate.RegisterValidation("bidettypes", bidetTypeValidator); err != nil {
		return err
	}
	if err := Validate.RegisterValidation("unique", uniqueStrings); err != nil {
		return err
	}

	Validate.RegisterStructValidation(BidetTypesValidator, dto.UpdateToiletDTO{})
	Validate.RegisterStructValidation(BidetTypesValidator, dto.CreateToiletDTO{})

	return nil
}

func gendersValidator(fl validator.FieldLevel) bool {
	val := fl.Field().String()
	switch val {
	case "Male", "Female", "Gender-neutral":
		return true
	default:
		return false
	}
}

func bidetTypeValidator(fl validator.FieldLevel) bool {
	val := fl.Field().String()
	switch val {
	case "Hand-held", "Attachment", "Standalone":
		return true
	default:
		return false
	}
}

func uniqueStrings(fl validator.FieldLevel) bool {
	slice, ok := fl.Field().Interface().([]string)
	if !ok {
		return false
	}

	seen := map[string]struct{}{}
	for _, val := range slice {
		if _, exists := seen[val]; exists {
			return false
		}
		seen[val] = struct{}{}
	}
	return true
}

func BidetTypesValidator(sl validator.StructLevel) {
	switch toiletDTO := sl.Current().Interface().(type) {

	case dto.CreateToiletDTO:
		if !toiletDTO.HasBidet && len(toiletDTO.BidetTypes) > 0 {
			sl.ReportError(toiletDTO.BidetTypes, "bidetTypes", "BidetTypes", "bidettypesempty", "")
		}

	case dto.UpdateToiletDTO:
		if toiletDTO.HasBidet != nil && toiletDTO.BidetTypes != nil {
			if !*toiletDTO.HasBidet && len(*toiletDTO.BidetTypes) > 0 {
				sl.ReportError(toiletDTO.BidetTypes, "bidetTypes", "BidetTypes", "bidettypesempty", "")
			}
		}
	}
}

func ParseValidationErrors(ve validator.ValidationErrors) map[string]string {
	errorsMap := make(map[string]string)
	for _, fe := range ve {
		field := fe.Field()
		if field == "" {
			field = fe.StructField()
		}

		// Remove [index] from slice field names like genders[0], bidetTypes[1]
		field = strings.Split(field, "[")[0]
		tag := fe.Tag()

		switch tag {
		case "required":
			errorsMap[field] = fmt.Sprintf("%s is required", field)
		case "min":
			kind := fe.Kind()
			if kind == reflect.Slice || kind == reflect.Array {
				errorsMap[field] = fmt.Sprintf("%s must contain at least %s item(s)", field, fe.Param())
			} else {
				errorsMap[field] = fmt.Sprintf("%s must be at least %s characters", field, fe.Param())
			}
		case "max":
			errorsMap[field] = fmt.Sprintf("%s must be at most %s characters", field, fe.Param())
		case "latitude":
			errorsMap[field] = fmt.Sprintf("%s must be a float between -90 and 90 (inclusive)", field)
		case "longitude":
			errorsMap[field] = fmt.Sprintf("%s must be a float between -180 and 180 (inclusive)", field)
		case "bidettypesempty":
			errorsMap[field] = "bidetTypes must be empty if hasBidet is false"
		case "unique":
			errorsMap[field] = fmt.Sprintf("%s must not contain duplicate values", field)
		case "genders":
			errorsMap[field] = fmt.Sprintf("%s must be one or more of [Male, Female, Gender-neutral]", field)
		case "bidettypes":
			errorsMap[field] = fmt.Sprintf("%s can contaone none or more of [Hand-held, Attachment, Standalone]", field)
		default:
			errorsMap[field] = fmt.Sprintf("%s is invalid", field)
		}
	}

	return errorsMap
}
