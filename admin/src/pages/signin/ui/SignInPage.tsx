import { FORM_TEXTS } from '@shared/config/texts'

import useForm from '../model/useForm'

import styles from './SignInPage.module.scss'

const SignInPage = () => {
  const {
    email,
    password,
    errors,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit
  } = useForm()

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
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{FORM_TEXTS.password.label}</span>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={handlePasswordChange}
            placeholder={FORM_TEXTS.password.placeholder}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </label>
        <button type="submit" className={styles.submit}>
          {FORM_TEXTS.signin.button}
        </button>
      </form>
    </div>
  )
}

export default SignInPage
