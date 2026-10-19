import { FORM_TEXTS } from '@shared/config/texts';
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
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>{FORM_TEXTS.signin.title}</h1>
        <label className={styles.field}>
          <span className={styles.label}>{FORM_TEXTS.email.label}</span>
          <input
            type="mail"
            className={styles.input}
            value={email}
            onChange={handleEmailChange}
            placeholder={FORM_TEXTS.email.placeholder}
          />
          <p className={styles.error} aria-live="polite">{errors.email}</p>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{FORM_TEXTS.password.label}</span>
          <PasswordInput
            className={styles.input}
            value={password}
            onChange={handlePasswordChange}
            placeholder={FORM_TEXTS.password.placeholder}
            autoComplete="current-password"
          />
          <p className={styles.error} aria-live="polite">{errors.password}</p>
        </label>
        <button disabled={isLoading} type="submit" className={styles.submit}>
          {FORM_TEXTS.signin.button}
        </button>
        <p className={styles.error} aria-live="polite">{commonError}</p>
      </form>
    </div>
  );
};

export default SignInPage;
