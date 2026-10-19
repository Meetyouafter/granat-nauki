import {
  type ChangePasswordInput,
  changePasswordSchema,
  MIN_PASSWORD_LENGTH,
} from '@granat/contracts';

import { FORM_TEXTS } from '@shared/config';

import { TEXTS } from './texts';

export interface FormValues extends ChangePasswordInput {
  passwordConfirm: string;
}

export const FIELDS = ['currentPassword', 'newPassword', 'passwordConfirm'] as const;
export type FieldName = (typeof FIELDS)[number];
export type FormErrors = Record<FieldName, string | null>;

export const NO_ERRORS: FormErrors = {
  currentPassword: null,
  newPassword: null,
  passwordConfirm: null,
};

export const isFieldName = (name: string): name is FieldName =>
  (FIELDS as readonly string[]).includes(name);

export const validate = ({ passwordConfirm, ...input }: FormValues) => {
  const result = changePasswordSchema.safeParse(input);
  const errors: FormErrors = { ...NO_ERRORS };

  if (!result.success) {
    for (const { path, code } of result.error.issues) {
      if (path[0] === 'currentPassword') errors.currentPassword = FORM_TEXTS.password.maxLengthError;
      if (path[0] === 'newPassword') {
        if (code === 'custom') errors.newPassword = TEXTS.samePassword;
        else {
          errors.newPassword = input.newPassword.length < MIN_PASSWORD_LENGTH
            ? FORM_TEXTS.password.lengthError
            : FORM_TEXTS.password.maxLengthError;
        }
      }
    }
  }
  if (!input.currentPassword) errors.currentPassword = TEXTS.currentPasswordEmpty;
  if (!input.newPassword) errors.newPassword = TEXTS.newPasswordEmpty;

  if (!passwordConfirm) {
    errors.passwordConfirm = FORM_TEXTS.passwordConfirm.emptyError;
  } else if (passwordConfirm !== input.newPassword) {
    errors.passwordConfirm = FORM_TEXTS.passwordConfirm.matchError;
  }

  const isValid = result.success && Object.values(errors).every(error => error === null);

  return { errors, data: isValid ? result.data : null };
};
