import * as LabelPrimitive from "@radix-ui/react-label";

import { FormLabel } from "@/components/ui/form";

type BaseFormLabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
};

const BaseFormLabel: React.FC<BaseFormLabelProps> = (props) => {
  const { required = false, children, ...others } = props;

  return (
    <FormLabel {...others}>
      {typeof children === "string" && required ? `${children} *` : children}
    </FormLabel>
  );
};

export default BaseFormLabel;
