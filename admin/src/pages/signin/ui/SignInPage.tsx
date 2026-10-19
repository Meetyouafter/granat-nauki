import { FORM_TEXTS } from '@shared/config/texts';
import { Button } from '@shared/ui/Button';
import { Field, Input } from '@shared/ui/Field';
import { PasswordInput } from '@shared/ui/PasswordInput';

import useForm from '../model/useForm';

import styles from './SignInPage.module.scss';

const SignInPage = () => {
  const {
    isLoading,
    email,
    password,
    errors,
    commonError,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useForm();

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h1 className={styles.title}>{FORM_TEXTS.signin.title}</h1>
      <Field id="signin-email" label={FORM_TEXTS.email.label} error={errors.email}>
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
          placeholder={FORM_TEXTS.email.placeholder}
          isInvalid={Boolean(errors.email)}
        />
      </Field>
      <Field id="signin-password" label={FORM_TEXTS.password.label} error={errors.password}>
        <PasswordInput
          id="signin-password"
          value={password}
          onChange={handlePasswordChange}
          placeholder={FORM_TEXTS.password.placeholder}
          autoComplete="current-password"
          isInvalid={Boolean(errors.password)}
        />
      </Field>
      <Button type="submit" className={styles.submit} isLoading={isLoading}>
        {FORM_TEXTS.signin.button}
      </Button>
      <p className={styles.error} aria-live="polite">{commonError}</p>
    </form>
  );
};

export default SignInPage;
