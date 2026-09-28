import 'server-only';
import { cookies } from 'next/headers';

/*
httpOnly - JS в браузере не видит cookie (document.cookie её не покажет)
  XSS не сможет украсть токен
secure - Cookie уходит только по HTTPS
  Перехват в открытой Wi-Fi-сети
sameSite: 'lax' - С чужих сайтов cookie уходит только на GET-переходы по ссылке.
  Основная часть CSRF. Остальное закрывает проверка Sec-Fetch-Site
path: '/' -	Cookie действует на весь хост.
  Обязательно для префикса __Host-expires
  Браузер сам забудет cookie в момент истечения сессии
  Cookie не живёт дольше сессии в БД
префикс __Host-
  Браузер примет cookie только с Secure, Path=/ и без Domain
  Cookie нельзя подсунуть или перезаписать с site.ru или другого поддомена.
  Именно на этом держится изоляция админки
**/

const isProduction = process.env.NODE_ENV === 'production';

const SESSION_COOKIE = isProduction ? '__Host-session' : 'session';

const baseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/'
} as const;

export const setSessionCookie = async (token: string, expiredAt: Date) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { ...baseOptions, expires: expiredAt });
};

export const getSessionCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
};

export const deleteSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', { ...baseOptions, maxAge: 0 });
};

