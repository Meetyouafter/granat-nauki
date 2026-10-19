import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import { MIN_PASSWORD_LENGTH, type SignupInput, signupSchema } from '@granat/contracts';

import { getErrorMessage, useSignupMutation } from '@shared/api';
import { FORM_TEXTS } from '@shared/config';

interface FormValues extends SignupInput {
  passwordConfirm: string;
}

type FormErrors = Record<keyof FormValues, string | null>;

const validate = ({ passwordConfirm, ...form }: FormValues) => {
  const result = signupSchema.safeParse(form);
  const errors: FormErrors = { email: null, password: null, passwordConfirm: null };

  if (!result.success) {
    for (const { path } of result.error.issues) {
      if (path[0] === 'email') errors.email = FORM_TEXTS.email.matchError;
      if (path[0] === 'password') {
        errors.password = form.password.length < MIN_PASSWORD_LENGTH
          ? FORM_TEXTS.password.lengthError
          : FORM_TEXTS.password.maxLengthError;
      }
    }
  }
  if (!form.email.trim()) errors.email = FORM_TEXTS.email.emptyError;
  if (!form.password) errors.password = FORM_TEXTS.password.emptyError;

  if (!passwordConfirm) {
    errors.passwordConfirm = FORM_TEXTS.passwordConfirm.emptyError;
  } else if (passwordConfirm !== form.password) {
    errors.passwordConfirm = FORM_TEXTS.passwordConfirm.matchError;
  }

  const isValid = result.success && Object.values(errors).every(error => error === null);

  return { errors, data: isValid ? result.data : null };
};

const useForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<FormErrors>({
    email: null,
    password: null,
    passwordConfirm: null,
  });

  const [signup, { isLoading, error, reset }] = useSignupMutation();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, email: null }));
    reset();
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, password: null, passwordConfirm: null }));
    reset();
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, passwordConfirm: null }));
    reset();
    setPasswordConfirm(event.target.value);
  };

  const submit = async (credentials: SignupInput) => {
    try {
      await signup(credentials).unwrap();
    } catch {
      // ошибку показывает commonError из состояния мутации
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { errors: validationErrors, data } = validate({ email, password, passwordConfirm });

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
    passwordConfirm,
    errors,
    commonError: getErrorMessage(error),
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSubmit,
  };
};

export default useForm;
