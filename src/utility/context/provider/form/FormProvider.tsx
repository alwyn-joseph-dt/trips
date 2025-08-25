import { createContext, useContext } from 'react';

const FormContext = createContext({});

export const FormProvider = ({ children, value }) => {
  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const UseFormContext = () => {
  return useContext(FormContext);
};
