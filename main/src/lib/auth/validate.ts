import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/constants';

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmailValid = (email: string) =>
  email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEXP.test(email);

export const isPasswordValid = (password: string) =>
  password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
