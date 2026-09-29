import 'server-only';
import { z } from 'zod';

import { API_STATUSES } from '@/constants';
import { AppError } from '@/lib/errors';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/*
Эта проверка защищает от CSRF.
Браузер сам прикладывает cookie к любому запросу на admin.site.ru,
даже если запрос запустила чужая страница.
Злой сайт может отправить форму POST admin.site.ru/api/..., и запрос уйдёт с сессией админа.
Заголовок Sec-Fetch-Site ставит браузер: он показывает, откуда пришёл запрос.
 */
export const assertSameOrigin = (request: Request) => {
  if (request.headers.get('sec-fetch-site') !== 'same-origin')
    throw new AppError(API_STATUSES.CSRF);
};

export const parseBody = async <T extends z.ZodType>(request: Request, schema: T) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AppError(API_STATUSES.VALIDATION_ERROR);
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw new AppError(API_STATUSES.VALIDATION_ERROR, z.flattenError(result.error).fieldErrors);
  }
  return result.data as z.infer<T>;
};

type Handler = (request: Request) => Promise<Response>;

export const withErrorHandling = (handler: Handler): Handler => async (request) => {
  try {
    if (!SAFE_METHODS.includes(request.method)) assertSameOrigin(request);
    return await handler(request);
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        { error: error.code, details: error.details },
        { status: error.status });
    }
    console.error(error);
    return Response.json(
      { error: API_STATUSES.INTERNAL_SERVER_ERROR.message },
      { status: API_STATUSES.INTERNAL_SERVER_ERROR.status },
    );
  }
};
