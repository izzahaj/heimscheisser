import { Loader } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  RHFCheckbox,
  RHFInput,
  RHFMultiSelect,
  RHFTextarea,
} from "@/common/components/hook-form";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import {
  bidetTypeOptions,
  genderOptions,
  TOILET_DESC_MAX_LEN,
  TOILET_NAME_MAX_LEN,
} from "../../constants/toiletValues";

type AddToiletFormProps = {
  handleSelectLocation: VoidFunction;
  handleClose: VoidFunction;
};

const AddToiletForm: React.FC<AddToiletFormProps> = (props) => {
  const { handleSelectLocation, handleClose } = props;

  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <div className="flex flex-col px-4 py-2 overflow-auto gap-5">
        <RHFInput
          type="text"
          name="name"
          label="Name"
          placeholder="Name"
          maxLength={TOILET_NAME_MAX_LEN}
          required
        />
        <RHFTextarea
          name="description"
          label="Description"
          placeholder="Description"
          className="field-sizing-fixed"
          maxLength={TOILET_DESC_MAX_LEN}
          rows={4}
          helperText="Provide more specifics e.g. floor number, next to a landmark, etc."
        />
        <DialogClose asChild>
          <Button onClick={handleSelectLocation}>Edit Map Location</Button>
        </DialogClose>
        <RHFMultiSelect
          name="genders"
          label="Genders"
          options={genderOptions}
          placeholder="Select genders"
          variant="inverted"
          required
        />
        <RHFCheckbox
          name="hasHandicap"
          label="Has accessible toilet"
          required
        />
        <RHFCheckbox name="isPaid" label="Requires payment" required />
        <RHFCheckbox name="hasBidet" label="Has bidet" required />
        {watch("hasBidet") && (
          <RHFMultiSelect
            name="bidetTypes"
            label="Bidet Types"
            options={bidetTypeOptions}
            placeholder="Select bidet types"
            variant="inverted"
          />
        )}
      </div>
      <div className="flex flex-row justify-around md:justify-end gap-2 p-1">
        <Button
          variant="outline"
          className="flex-1 md:flex-0"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 md:flex-0 flex flex-row gap-2 items-center"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader className="h-5 w-5 animate-spin" />}
          Submit
        </Button>
      </div>
    </>
  );
};

export default AddToiletForm;
