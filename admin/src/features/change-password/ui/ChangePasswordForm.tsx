import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import { getErrorCode, getErrorMessage, useChangePasswordMutation } from '@shared/api';
import { FORM_TEXTS } from '@shared/config';
import { Button } from '@shared/ui/Button';
import { Field } from '@shared/ui/Field';
import { PasswordInput } from '@shared/ui/PasswordInput';
import { useToast } from '@shared/ui/Toast';

import { TEXTS } from '../model/texts';
import { type FormErrors, isFieldName, NO_ERRORS, validate } from '../model/validate';

import styles from './ChangePasswordForm.module.scss';

const getValue = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
};

const ChangePasswordForm = () => {
  const [changePassword, { isLoading, error, reset }] = useChangePasswordMutation();
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const { notify } = useToast();

  const isWrongCurrentPassword = getErrorCode(error) === 'INVALID_CREDENTIALS';
  const currentPasswordError = errors.currentPassword
    ?? (isWrongCurrentPassword ? TEXTS.wrongCurrentPassword : null);
  const commonError = isWrongCurrentPassword ? null : getErrorMessage(error);

  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    if (!(event.target instanceof HTMLInputElement)) return;

    const { name } = event.target;
    if (isFieldName(name)) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
        ...(name === 'newPassword' && { passwordConfirm: null }),
      }));
    }
    reset();
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const { errors: validationErrors, data } = validate({
      currentPassword: getValue(formData, 'currentPassword'),
      newPassword: getValue(formData, 'newPassword'),
      passwordConfirm: getValue(formData, 'passwordConfirm'),
    });

    setErrors(validationErrors);
    if (!data) return;

    void changePassword(data).then((result) => {
      if (result.error) return;
      form.reset();
      notify('success', TEXTS.success);
    });
  };

  return (
    <section className={styles.block} aria-labelledby="change-password-title">
      <div className={styles.heading}>
        <h2 className={styles.title} id="change-password-title">{TEXTS.title}</h2>
        <p className={styles.description}>{TEXTS.description}</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit} onChange={handleChange} noValidate>
        <Field
          id="change-password-current"
          label={TEXTS.currentPassword}
          error={currentPasswordError}
        >
          <PasswordInput
            id="change-password-current"
            name="currentPassword"
            placeholder={FORM_TEXTS.password.placeholder}
            autoComplete="current-password"
            isInvalid={Boolean(currentPasswordError)}
          />
        </Field>
        <Field id="change-password-new" label={TEXTS.newPassword} error={errors.newPassword}>
          <PasswordInput
            id="change-password-new"
            name="newPassword"
            placeholder={FORM_TEXTS.password.placeholder}
            autoComplete="new-password"
            isInvalid={Boolean(errors.newPassword)}
          />
        </Field>
        <Field
          id="change-password-confirm"
          label={FORM_TEXTS.passwordConfirm.label}
          error={errors.passwordConfirm}
        >
          <PasswordInput
            id="change-password-confirm"
            name="passwordConfirm"
            placeholder={FORM_TEXTS.password.placeholder}
            autoComplete="new-password"
            isInvalid={Boolean(errors.passwordConfirm)}
          />
        </Field>
        <div className={styles.footer}>
          <Button type="submit" isLoading={isLoading}>{TEXTS.submit}</Button>
          <p className={styles.error} aria-live="polite">{commonError}</p>
        </div>
      </form>
    </section>
  );
};

export default ChangePasswordForm;
