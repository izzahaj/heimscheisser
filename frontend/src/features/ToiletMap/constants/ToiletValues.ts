export const TOILET_NAME_MAX_LEN = 255;
export const TOILET_DESC_MAX_LEN = 1250;

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

type StringEnum = Record<string, string>;

const createOptionsFromEnum = <T extends StringEnum>(enumObj: T) => {
  return Object.values(enumObj).map((value) => ({
    label: value,
    value,
  }));
};

export const genderOptions = createOptionsFromEnum(Gender);
export const bidetTypeOptions = createOptionsFromEnum(BidetType);
