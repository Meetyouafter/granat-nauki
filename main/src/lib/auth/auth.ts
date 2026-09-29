import 'server-only';

import { API_STATUSES } from '@/constants';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { AppError } from '@/lib/errors';

import { hashPassword, verifyPassword } from './password';
import type { SigninInput, SignupInput } from './schemas';
import { createSession, invalidateSession } from './session';

/*
Сервис аутентификации. Про HTTP не знает: не читает Request, не ставит cookie, не собирает Response.
Возвращает сессию, при ошибке бросает AppError.
**/

let dummyHash: Promise<string> | undefined;

/*
  Фиктивный хеш. Без него ответ на несуществующий email приходит примерно на 100 мс быстрее,
  и по времени видно, какие адреса зарегистрированы.
  Поэтому argon2 считается всегда, даже когда пользователя нет.
**/
const getDummyHash = () => (dummyHash ??= hashPassword('timing-equalizer-password'));

export const signin = async (input: SigninInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true }
  });

  const isPasswordOk =
    await verifyPassword(user?.passwordHash ?? await getDummyHash(), password);

  if (!user || !isPasswordOk) throw new AppError(API_STATUSES.INVALID_CREDENTIALS);

  return createSession(user.id);
};

export const signup = async (input: SignupInput) => {
  const { email, password } = input;

  let user;
  try {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password)
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError(API_STATUSES.EMAIL_TAKEN);
    }
    throw error;
  }

  return createSession(user.id);
};

export const signout = (sessionId: string) => invalidateSession(sessionId);
