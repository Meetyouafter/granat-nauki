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
  - если пользователь неделю не заходил, сессия истекает
  - сессия истекает через 30 дней после входа, и нужно войти заново
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
**/

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const INACTIVITY_TIMEOUT = 7 * DAY;
const ABSOLUTE_TIMEOUT = 30 * DAY;
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

const getSessionExpiresAt = (session: { lastVerifiedAt: Date; createdAt: Date }) => {
  return new Date(Math.min(
    session.lastVerifiedAt.getTime() + INACTIVITY_TIMEOUT,
    session.createdAt.getTime() + ABSOLUTE_TIMEOUT,
  ));
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

export const createSession = async (userId: number) => {
  const { id, secretHash, token } = generateToken();

  const session = await prisma.session.create({
    data: { id, secretHash, userId },
  });

  return { token, expiresAt: getSessionExpiresAt(session) };
};

export const invalidateSession = async (sessionId: string, db: DbClient = prisma) => {
  await db.session.deleteMany({ where: { id: sessionId } });
};

export const invalidateUserSessions = async (userId: number, db: DbClient = prisma) => {
  await db.session.deleteMany({ where: { userId } });
};
