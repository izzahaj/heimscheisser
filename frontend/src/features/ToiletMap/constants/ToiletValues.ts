export const TOILET_NAME_MAX_LEN = 255;
export const TOILET_DESC_MAX_LEN = 1250;

export enum BidetType {
  HandHeld = "hand-held",
  Attachment = "attachment",
  Standalone = "standalone",
}

export enum Gender {
  Male = "male",
  Female = "female",
  GenderNeutral = "gender-neutral",
}

type StringEnum = Record<string, string>;

const capitalizeFirstChar = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const createOptionsFromEnum = <T extends StringEnum>(enumObj: T) => {
  return Object.values(enumObj).map((value) => ({
    label: capitalizeFirstChar(value),
    value,
  }));
};

export const genderOptions = createOptionsFromEnum(Gender);
export const bidetTypeOptions = createOptionsFromEnum(BidetType);
