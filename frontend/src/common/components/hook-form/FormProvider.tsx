import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";

// -------------------------------------------------------------------------------------------------

type FormProviderProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

const FormProvider = ({ children, onSubmit, methods }: FormProviderProps) => {
  return (
    <Form {...methods}>
      <form noValidate onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
};

export default FormProvider;
