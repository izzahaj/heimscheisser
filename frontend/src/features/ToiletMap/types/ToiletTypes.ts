import { BidetType, GenderType } from "../constants/ToiletValues";

export type Toilet = {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  genderTypes: GenderType[];
  hasHandicap: boolean;
  bidetTypes: BidetType[];
  isPaid: boolean;
  updatedBy: string;
}
