import * as Yup from 'yup';
import { BidetType, GenderType } from '../constants/ToiletValues';

export const toiletSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .trim(),
  latitude: Yup.number()
    .required('Latitude is required')
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .nullable(),
  longitude: Yup.number()
    .required('Longitude is required')
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .nullable(),
  description: Yup.string(),
  genderTypes: Yup.array()
    .of(Yup.mixed<GenderType>().oneOf(Object.values(GenderType)))
    .required('Gender type is required')
    .min(1, 'At least one gender type must be selected'),
  hasHandicap: Yup.boolean()
    .required(),
  bidetTypes: Yup.array()
    .of(Yup.mixed<BidetType>().oneOf(Object.values(BidetType)))
    .required('Bidet type is required')
    .min(1, 'At least one bidet type must be selected'),
  isPaid: Yup.boolean()
    .required(),
  updatedBy: Yup.string()
});
