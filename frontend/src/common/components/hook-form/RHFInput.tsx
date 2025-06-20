import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { BaseFormLabel } from "../form";

type RHFInputProps = React.ComponentProps<"input"> & {
  name: string;
  label?: string;
  helperText?: string;
};

const RHFInput: React.FC<RHFInputProps> = (props) => {
  const { name, label, helperText, required, ...others } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <BaseFormLabel required={required}>{label}</BaseFormLabel>}
          <FormControl>
            <Input {...field} {...others} />
          </FormControl>
          {helperText && <FormDescription>{helperText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFInput;
