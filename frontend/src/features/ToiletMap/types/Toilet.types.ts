import { BidetType, Gender } from "../constants/toiletValues";

export type Toilet = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  genders: Gender[];
  hasHandicap: boolean;
  hasBidet: boolean;
  bidetTypes: BidetType[];
  isPaid: boolean;
};
