import { z } from 'zod';

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from './limits';

const email = z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).pipe(z.email());

export const signinSchema = z.object({
  email,
  password: z.string().max(MAX_PASSWORD_LENGTH),
});

export const signupSchema = z.object({
  email,
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export type SigninInput = z.infer<typeof signinSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
