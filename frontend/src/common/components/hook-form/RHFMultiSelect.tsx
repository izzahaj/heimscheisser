import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { BaseFormLabel } from "../form";
import { MultiSelect, MultiSelectProps } from "../multi-select";

type RHFMultiSelectProps = MultiSelectProps & {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
};

const RHFMultiSelect: React.FC<RHFMultiSelectProps> = (props) => {
  const { name, label, helperText, required = false, ...others } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <BaseFormLabel required={required}>{label}</BaseFormLabel>}
          <FormControl>
            <MultiSelect
              {...field}
              {...others}
              value={field.value}
              onValueChange={field.onChange}
            />
          </FormControl>
          {helperText && <FormDescription>{helperText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFMultiSelect;
