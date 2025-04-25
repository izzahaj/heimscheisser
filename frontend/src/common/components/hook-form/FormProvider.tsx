import { UseFormReturn, FormProvider as Form } from 'react-hook-form';

// -------------------------------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

const FormProvider = ({ children, onSubmit, methods }: Props) => {
  return (
    <Form {...methods}>
      <form noValidate onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}

export default FormProvider;

