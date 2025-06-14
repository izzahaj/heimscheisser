import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type RHFCheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  name: string;
  label?: string;
  helperText?: string;
};

const RHFCheckbox: React.FC<RHFCheckboxProps> = (props) => {
  const { name, label, helperText, ...others } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex flex-row gap-2 items-center">
            <FormControl>
              <Checkbox
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
                {...others}
              />
            </FormControl>
            {label && <FormLabel>{label}</FormLabel>}
          </div>
          <div className="flex flex-col gap-1 ml-6">
            {helperText && <FormDescription>{helperText}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default RHFCheckbox;
