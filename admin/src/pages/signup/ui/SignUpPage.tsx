import { FORM_TEXTS } from '@shared/config/texts';
import { Button } from '@shared/ui/Button';
import { Field, Input } from '@shared/ui/Field';
import { PasswordInput } from '@shared/ui/PasswordInput';

import useForm from '../model/useForm';

import styles from './SignUpPage.module.scss';

const SignUpPage = () => {
  const {
    isLoading,
    email,
    password,
    passwordConfirm,
    errors,
    commonError,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSubmit,
  } = useForm();

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h1 className={styles.title}>{FORM_TEXTS.signup.title}</h1>
      <Field id="signup-email" label={FORM_TEXTS.email.label} error={errors.email}>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
          placeholder={FORM_TEXTS.email.placeholder}
          isInvalid={Boolean(errors.email)}
        />
      </Field>
      <Field id="signup-password" label={FORM_TEXTS.password.label} error={errors.password}>
        <PasswordInput
          id="signup-password"
          value={password}
          onChange={handlePasswordChange}
          placeholder={FORM_TEXTS.password.placeholder}
          autoComplete="new-password"
          isInvalid={Boolean(errors.password)}
        />
      </Field>
      <Field
        id="signup-password-confirm"
        label={FORM_TEXTS.passwordConfirm.label}
        error={errors.passwordConfirm}
      >
        <PasswordInput
          id="signup-password-confirm"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          placeholder={FORM_TEXTS.password.placeholder}
          autoComplete="new-password"
          isInvalid={Boolean(errors.passwordConfirm)}
        />
      </Field>
      <Button type="submit" className={styles.submit} isLoading={isLoading}>
        {FORM_TEXTS.signup.button}
      </Button>
      <p className={styles.error} aria-live="polite">{commonError}</p>
    </form>
  );
};

export default SignUpPage;
