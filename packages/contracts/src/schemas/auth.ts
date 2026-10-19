import { z } from 'zod';

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../limits';
import { email } from './email';

export const signinSchema = z.object({
  email,
  password: z.string().max(MAX_PASSWORD_LENGTH),
});

export const signupSchema = z.object({
  email,
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().max(MAX_PASSWORD_LENGTH),
  newPassword: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
}).refine(data => data.newPassword !== data.currentPassword, {
  path: ['newPassword'],
});

export type SigninInput = z.infer<typeof signinSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
