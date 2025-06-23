import { FieldValues } from "react-hook-form";

export const filterChangedFormFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: Partial<Record<keyof T, boolean | boolean[]>>,
): Partial<T> => {
  const changedFieldValues = Object.keys(dirtyFields).reduce(
    (acc, currentField) => {
      const isDirty = Array.isArray(dirtyFields[currentField])
        ? (dirtyFields[currentField] as boolean[]).some(
            (value) => value === true,
          )
        : dirtyFields[currentField] === true;
      if (isDirty) {
        return {
          ...acc,
          [currentField]: allFields[currentField],
        };
      }
      return acc;
    },
    {} as Partial<T>,
  );

  return changedFieldValues;
};
