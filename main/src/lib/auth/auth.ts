import 'server-only';

import {
  API_STATUSES,
  type ChangePasswordInput,
  type SigninInput,
  type SignupInput,
} from '@granat/contracts';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { AppError } from '@/lib/errors';

import { hashPassword, verifyPassword } from './password';
import {
  createSession,
  invalidateSession,
  invalidateUserSessions,
  type SessionMeta,
} from './session';

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

export const signin = async (input: SigninInput, meta: SessionMeta) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  const isPasswordOk
    = await verifyPassword(user?.passwordHash ?? await getDummyHash(), password);

  if (!user || !isPasswordOk) throw new AppError(API_STATUSES.INVALID_CREDENTIALS);

  return createSession(user.id, meta);
};

export const signup = async (input: SignupInput, meta: SessionMeta) => {
  const { email, password } = input;

  let user;
  try {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError(API_STATUSES.EMAIL_TAKEN);
    }
    throw error;
  }

  return createSession(user.id, meta);
};

/*
  Смена пароля залогиненным пользователем, userId берётся из сессии в хендлере.
  Текущий пароль проверяем всегда: с одной украденной cookie пароль не сменить.
  Пароль и сброс всех сессий в одной транзакции: иначе при сбое пароль уже новый,
  а старые сессии (в том числе вора) живы. Хеш считаем до транзакции, чтобы не держать её ~50 мс.
  Текущему устройству выдаём новую сессию, остальные выходят.
**/
export const changePassword = async (
  userId: number,
  input: ChangePasswordInput,
  meta: SessionMeta,
) => {
  const { currentPassword, newPassword } = input;

  const stored = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!stored || !await verifyPassword(stored.passwordHash, currentPassword)) {
    throw new AppError(API_STATUSES.INVALID_CREDENTIALS);
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { passwordHash } });
    await invalidateUserSessions(userId, tx);
  });

  return createSession(userId, meta);
};

export const signout = (sessionId: string) => invalidateSession(sessionId);
