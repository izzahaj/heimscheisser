import * as Yup from "yup";

import {
  BidetType,
  Gender,
  TOILET_DESC_MAX_LEN,
  TOILET_NAME_MAX_LEN,
} from "../constants/ToiletValues";

export const toiletSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(
      TOILET_NAME_MAX_LEN,
      `Name must not be more than ${TOILET_NAME_MAX_LEN} characters`,
    )
    .test("non-blank", "Name cannot be blank", (val) => !!val?.trim()),
  latitude: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .nullable(),
  longitude: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .nullable(),
  description: Yup.string().max(
    TOILET_DESC_MAX_LEN,
    `Description must not be more than ${TOILET_DESC_MAX_LEN} characters`,
  ),
  genders: Yup.array()
    .of(Yup.mixed<Gender>().oneOf(Object.values(Gender)))
    .required("Gender type is required")
    .min(1, "At least one gender type must be selected"),
  hasHandicap: Yup.boolean().required(),
  hasBidet: Yup.boolean().required(),
  bidetTypes: Yup.array().of(
    Yup.mixed<BidetType>().oneOf(Object.values(BidetType)),
  ),
  isPaid: Yup.boolean().required(),
});
