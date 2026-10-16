import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import { type SigninInput, signinSchema } from '@granat/contracts';

import { getErrorMessage, useSigninMutation } from '@shared/api';
import { FORM_TEXTS } from '@shared/config';

type FormErrors = Record<keyof SigninInput, string | null>;

const validate = (form: SigninInput) => {
  const result = signinSchema.safeParse(form);
  const errors: FormErrors = { email: null, password: null };

  if (!result.success) {
    for (const { path } of result.error.issues) {
      if (path[0] === 'email') errors.email = FORM_TEXTS.email.matchError;
      if (path[0] === 'password')
        errors.password = FORM_TEXTS.password.maxLengthError;
    }
  }
  if (!form.email.trim()) errors.email = FORM_TEXTS.email.emptyError;
  if (!form.password) errors.password = FORM_TEXTS.password.emptyError;

  const isValid = result.success && Object.values(errors).every(error => error === null);

  return { errors, data: isValid ? result.data : null };
};

const useForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({
    email: null,
    password: null,
  });

  const [signin, { isLoading, error, reset }] = useSigninMutation();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, email: null }));
    reset();
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, password: null }));
    reset();
    setPassword(event.target.value);
  };

  const submit = async (credentials: SigninInput) => {
    try {
      await signin(credentials).unwrap();
    } catch {
      // ошибку показывает commonError из состояния мутации
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { errors: validationErrors, data } = validate({ email, password });

    if (!data) {
      setErrors(validationErrors);
      return;
    }

    void submit(data);
  };

  return {
    isLoading,
    email,
    password,
    errors,
    commonError: getErrorMessage(error),
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};

export default useForm;
