import 'server-only';

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';

/*
  Работа с сессией пользователя

  Порядок проверок:
    cookie ─► parseToken === null - 401 (без запроса к базе)
    findUnique(id) - не найдена - 401
    isSecretValid === false - 401
    now >= getSessionExpiresAt - удалить сессию - 401
    прошёл час с lastVerifiedAt - lastVerifiedAt = now
    { session, user }

  Два срока, берём ближайший.
  - если пользователь не заходил 3 дня, сессия истекает
  - сессия истекает через 3 дня после входа, и нужно войти заново
    Украденная cookie не живёт вечно, даже если её активно используют.
  - cекрет проверяем до удаления.
    Просроченную сессию удаляем только после того, как убедились, что секрет верный.
    Иначе любой, кто знает id (а id не секрет), мог бы стирать чужие сессии.
  - gродлеваем не чаще раза в час. Иначе каждый запрос превращался бы в UPDATE.
  - deleteMany и updateMany вместо delete и update.
    Если сессию удалят параллельно (выход в соседней вкладке),
    delete и update бросят ошибку «запись не найдена» (P2025), и запрос упадёт с 500.
  - secretHash наружу не отдаём. В результате только id сессии, expiresAt и пользователь.
  - Роль читается из базы при каждой проверке.
    Если админ отзовёт права, это сработает на следующем же запросе.

  Просроченные сессии удаляются в validateSessionToken, но только если их cookie ещё приходит.
  Брошенные (вкладку закрыли, cookie стёрли) остались бы навсегда, поэтому чистим при каждом входе.
  Условие то же, что в getSessionExpiresAt: любой из двух сроков истёк.
**/

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const INACTIVITY_TIMEOUT = DAY;
const ABSOLUTE_TIMEOUT = 3 * DAY;
const REFRESH_INTERVAL = HOUR;

const ID_BYTES = 15; // 120 bits
const SECRET_BYTES = 32; // 256 bits

type DbClient = Prisma.TransactionClient;

const randomString = (bytes: number) => randomBytes(bytes).toString('base64url');

const hashSecret = (secret: Buffer) =>
  new Uint8Array(createHash('sha256').update(secret).digest());

const generateToken = () => {
  const id = randomString(ID_BYTES);
  const secret = randomBytes(SECRET_BYTES);

  return {
    id,
    secretHash: hashSecret(secret),
    token: `${id}.${secret.toString('base64url')}`,
  };
};

const isSecretValid = (secret: Buffer, storedHash: Uint8Array) => {
  const hash = hashSecret(secret);
  return hash.length === storedHash.length && timingSafeEqual(hash, storedHash);
};

const parseToken = (token: string) => {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [id, encodedSecret] = parts;
  if (!id || !encodedSecret) return null;

  const secret = Buffer.from(encodedSecret, 'base64url');
  if (secret.length !== SECRET_BYTES) return null;

  return { id, secret };
};

const getSessionExpiresAt = (
  session: { lastVerifiedAt: Date; createdAt: Date },
) => new Date(Math.min(
  session.lastVerifiedAt.getTime() + INACTIVITY_TIMEOUT,
  session.createdAt.getTime() + ABSOLUTE_TIMEOUT,
));

const deleteExpiredSessions = async (now: number) => {
  await prisma.session.deleteMany({
    where: {
      OR: [
        { lastVerifiedAt: { lte: new Date(now - INACTIVITY_TIMEOUT) } },
        { createdAt: { lte: new Date(now - ABSOLUTE_TIMEOUT) } },
      ],
    },
  });
};

export const validateSessionToken = async (token: string) => {
  const parsed = parseToken(token);
  if (!parsed) return null;

  const session = await prisma.session.findUnique({
    where: { id: parsed.id },
    select: {
      id: true,
      secretHash: true,
      createdAt: true,
      lastVerifiedAt: true,
      user: { select: { id: true, email: true, role: true } },
    },
  });

  if (!session || !isSecretValid(parsed.secret, session.secretHash)) return null;

  const now = Date.now();

  if (now >= getSessionExpiresAt(session).getTime()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  if (now - session.lastVerifiedAt.getTime() >= REFRESH_INTERVAL) {
    session.lastVerifiedAt = new Date(now);
    await prisma.session.updateMany({
      where: { id: session.id },
      data: { lastVerifiedAt: session.lastVerifiedAt },
    });
  }

  return {
    session: { id: session.id, expiresAt: getSessionExpiresAt(session) },
    user: session.user,
  };
};


export type SessionMeta = { userAgent: string | null; ip: string | null };

export const createSession = async (userId: number, meta: SessionMeta) => {
  await deleteExpiredSessions(Date.now());

  const { id, secretHash, token } = generateToken();

  const session = await prisma.session.create({
    data: { id, secretHash, userId, ...meta },
  });

  return { token, expiresAt: getSessionExpiresAt(session) };
};

export const invalidateSession = async (sessionId: string, db: DbClient = prisma) => {
  await db.session.deleteMany({ where: { id: sessionId } });
};

export const invalidateUserSessions = async (userId: number, db: DbClient = prisma) => {
  await db.session.deleteMany({ where: { userId } });
};

export const invalidateOtherUserSessions = async (userId: number, currentSessionId: string) => {
  await prisma.session.deleteMany({ where: { userId, id: { not: currentSessionId } } });
};

export const invalidateUserSession = async (userId: number, sessionId: string) => {
  await prisma.session.deleteMany({ where: { id: sessionId, userId } });
};

export const listUserSessions = (userId: number) => {
  const now = Date.now();

  return prisma.session.findMany({
    where: {
      userId,
      lastVerifiedAt: { gt: new Date(now - INACTIVITY_TIMEOUT) },
      createdAt: { gt: new Date(now - ABSOLUTE_TIMEOUT) },
    },
    orderBy: { lastVerifiedAt: 'desc' },
    select: { id: true, userAgent: true, ip: true, createdAt: true, lastVerifiedAt: true },
  });
};
