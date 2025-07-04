import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { BaseFormLabel } from "../form";

type RHFTextareaProps = React.ComponentProps<"textarea"> & {
  name: string;
  label?: string;
  helperText?: string;
};

const RHFTextarea: React.FC<RHFTextareaProps> = (props) => {
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
            <Textarea {...field} {...others} />
          </FormControl>
          {helperText && <FormDescription>{helperText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFTextarea;
