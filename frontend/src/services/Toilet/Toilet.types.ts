// TODO: REFACTOR THIS FOR COMMON USE
export enum BidetType {
  HandHeld = "Hand-held",
  Attachment = "Attachment",
  Standalone = "Standalone",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  GenderNeutral = "Gender-neutral",
}

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

export type GetNearbvToiletsRequest = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

export type CreateToiletRequest = Omit<Toilet, "id">;
export type UpdateToiletByIdRequest = Partial<CreateToiletRequest> &
  Pick<Toilet, "id">;
