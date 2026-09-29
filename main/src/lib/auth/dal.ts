import 'server-only';

import { API_STATUSES } from '@/constants';
import { AppError } from '@/lib/errors';

import { deleteSessionCookie, getSessionCookie, setSessionCookie } from './cookies';
import { validateSessionToken } from './session';

/*
Три уровня функций:
getCurrentSession() - когда аноним допустим
requireUser()	- любой залогиненный: USER запрашивает доступ
requireAdmin() - всё, что касается контента

401: «не знаю, кто ты». Фронт отправит на страницу входа.
403: «знаю, кто ты, но нельзя». Фронт покажет пользователю USER страницу «Запросить доступ».

Невалидная cookie удаляется сразу.
  Если токен протух или подделан, мы стираем cookie,
  чтобы браузер не присылал мусор на каждый запрос.
Cookie переставляется на каждый успешный запрос.
  Так срок cookie идёт вместе со скользящим сроком сессии в БД.
Роль берём из БД, а не из cookie.
  validateSessionToken читает пользователя свежим на каждый запрос.
Если роль отозвали, следующий же requireAdmin() ответит 403.
  SessionUser — это DTO. Тип выводится из select в validateSessionToken.
  Поля passwordHash в нём нет и появиться не может.
**/

export const getCurrentSession = async () => {
  const token = await getSessionCookie();
  if (!token) return null;

  const current = await validateSessionToken(token);
  if (!current) {
    await deleteSessionCookie();
    return null;
  }

  await setSessionCookie(token, current.session.expiresAt);
  return current;
};

export const requireUser = async () => {
  const current = await getCurrentSession();
  if (!current) throw new AppError(API_STATUSES.UNAUTHORIZED);
  return current;
};

export const requireAdmin = async () => {
  const current = await requireUser();
  if (current.user.role !== 'ADMIN') throw new AppError(API_STATUSES.FORBIDDEN);
  return current;
};

export type SessionUser = Awaited<ReturnType<typeof requireUser>>['user'];