import { FormProvider as Form, UseFormReturn } from "react-hook-form";

// -------------------------------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

const FormProvider = ({ children, onSubmit, methods }: Props) => {
  return (
    <Form {...methods}>
      <form noValidate onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
};

export default FormProvider;
