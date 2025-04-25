import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Grid from '@mui/material/Grid';

import { toiletSchema } from '../../schema/ToiletSchema';
import Stack from '@mui/material/Stack';
import FormProvider, { RHFCheckbox, RHFMultiSelect, RHFTextField } from '../../../../common/components/hook-form';
import { BidetType, GenderType } from '../../constants/ToiletValues';
import Button from '@mui/material/Button';

const genderTypeOptions = Object.values(GenderType).map((value: string) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value
}));

const bidetTypeOptions = Object.values(BidetType).map((value: string) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value
}));

const AddToiletForm = ({ handleExit, addToiletPosition }) => {
  const defaultValues = useMemo(
    () => ({
      name: '',
      latitude: null,
      longitude: null,
      description: '',
      genderTypes: [],
      hasHandicap: false,
      bidetTypes: [],
      isPaid: false,
      updatedBy: ''
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(toiletSchema),
    defaultValues
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, isLoading }
  } = methods;

  const bidetTypes = watch('bidetTypes');
  const [filteredBidetOptions, setFilteredBidetOptions] = useState(bidetTypeOptions);

  const onSubmit = handleSubmit(async (data) => {
    setValue('updatedBy', "testuser"); // TODO: replace with current user

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(data);
      reset({});
      handleExit();
    } catch (err) {
      console.error(err)
    }
  });

  useEffect(() => {
    if (addToiletPosition) {
      setValue('latitude', addToiletPosition.lat);
      setValue('longitude', addToiletPosition.lng);
    }
  }, [addToiletPosition, setValue]);

  useEffect(() => {
    const hasNone = bidetTypes.includes(BidetType.None);

    if (hasNone) {
      setFilteredBidetOptions(bidetTypeOptions.filter((opt) => opt.value === BidetType.None));

      if (bidetTypes.length > 1) {
        setValue('bidetTypes', [BidetType.None]);
      }
    } else {
      setFilteredBidetOptions(bidetTypeOptions)
    }

  }, [bidetTypes, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Stack width="100%" mt={1} spacing={2}>
          <RHFTextField
            name="name"
            size="small"
            label="Name"
            required
          />
          <RHFTextField
            name="description"
            size="small"
            label="Description"
            multiline
            minRows={5}
            helperText="Provide more specifics e.g. floor number, next to a landmark, etc."
          />
          <RHFMultiSelect
            name="genderTypes"
            label="Genders"
            options={genderTypeOptions}
            size="small"
            chip
            checkbox
            required
          />
          <RHFMultiSelect
            name="bidetTypes"
            label="Bidets available"
            options={filteredBidetOptions} // if none option is selected, other options should disappear
            size="small"
            chip
            checkbox
            required
          />
          <RHFCheckbox
            name="hasHandicap"
            label="Has accessible toilets"
          />
          <RHFCheckbox
            name="isPaid"
            label="Requires payment"
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button color="primary" variant="outlined" loading={isSubmitting} disabled={isLoading} onClick={handleExit}>
              Cancel
            </Button>
            <Button color="primary" type="submit" variant="contained" loading={isSubmitting} disabled={isLoading}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </FormProvider>
  );
}

export default AddToiletForm;
