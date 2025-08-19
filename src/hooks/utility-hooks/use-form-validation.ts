import { useState, useEffect } from 'react';
import { FormInstance } from 'antd';

interface FormValues {
  [key: string]: unknown;
}

export const useFormValidation = (form: FormInstance, formValues: FormValues) => {
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => setIsFormValid(true)
    ).catch(
      () => {
        setIsFormValid(false);
      }
    );
  }, [form, formValues]);
  
  return isFormValid;
};

export const useFormValidationMessage = (form: FormInstance, formValues: FormValues) => {
  const [errorMessages, setErrorMessages] = useState([]);
  
  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => setErrorMessages([])
    ).catch(
      (error) => {
        setErrorMessages(error.errorFields.map((field: any) => field.errors[0]));
      }
    );
  }, [form, formValues]);
  
  return errorMessages;
};