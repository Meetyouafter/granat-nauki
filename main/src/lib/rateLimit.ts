import 'server-only';

import { API_STATUSES } from '@granat/contracts';

import { AppError } from './errors';

type Entry = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as { rateLimitStore?: Map<string, Entry> };
const store = (globalForRateLimit.rateLimitStore ??= new Map<string, Entry>());

const MAX_ENTRIES = 10_000;
const MINUTE = 60 * 1000;

const removeExpired = (now: number) => {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
};

const createLimiter = (
  name: string,
  { limit, windowMs }: { limit: number; windowMs: number },
) => {
  const keyOf = (id: string) => `${name}:${id}`;

  return {
    check: (id: string) => {
      const entry = store.get(keyOf(id));
      if (entry && entry.resetAt > Date.now() && entry.count >= limit) {
        throw new AppError(API_STATUSES.TOO_MANY_REQUESTS);
      }
    },
    hit: (id: string) => {
      const now = Date.now();
      const key = keyOf(id);
      const entry = store.get(key);

      if (entry && entry.resetAt > now) {
        entry.count++;
        return;
      }

      if (store.size >= MAX_ENTRIES) {
        removeExpired(now);
      }
      store.set(key, { count: 1, resetAt: now + windowMs });
    },
    reset: (id: string) => {
      const key = keyOf(id);
      store.delete(key);
    },
  };
};

export const signinLimiter = {
  byIp: createLimiter('signin:ip', { limit: 20, windowMs: 15 * MINUTE }),
  byEmail: createLimiter('signin:email', { limit: 10, windowMs: 15 * MINUTE }),
};

export const signupLimiter = createLimiter('signup:ip', { limit: 5, windowMs: 15 * MINUTE });
