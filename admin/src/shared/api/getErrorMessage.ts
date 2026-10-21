import type { ApiErrorCode } from '@granat/contracts';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { getErrorCode } from './getErrorCode';

const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Неверный формат. Проверьте введённые данные',
  INVALID_CREDENTIALS: 'Неверная почта или пароль',
  UNAUTHORIZED: 'Необходимо войти в аккаунт',
  FORBIDDEN: 'Нет доступа',
  CSRF: 'Запрос отклонён. Обновите страницу и попробуйте снова',
  EMAIL_TAKEN: 'Эта почта уже зарегистрирована',
  ACCESS_REQUEST_PENDING: 'Запрос уже отправлен и ждёт решения',
  ACCESS_REQUEST_NOT_FOUND: 'Запрос не найден. Обновите страницу',
  ACCESS_REQUEST_ALREADY_DECIDED: 'По этому запросу уже приняли решение',
  INTERNAL_SERVER_ERROR: 'Не удалось выполнить запрос',
  TOO_MANY_REQUESTS: 'Слишком много запросов. Попробуйте позже',
  RESOURCE_NOT_FOUND: 'Ресурс не найден',
} satisfies Record<ApiErrorCode, string>;

const UNKNOWN_ERROR = 'Что-то пошло не так. Попробуйте ещё раз';

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
): string | null => {
  if (!error) return null;
  if (!('status' in error)) return UNKNOWN_ERROR;

  if (
    error.status === 'FETCH_ERROR'
    || (error.status === 'PARSING_ERROR' && error.originalStatus >= 500)
  ) {
    return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }

  const code = getErrorCode(error);
  return code ? ERROR_MESSAGES[code] : UNKNOWN_ERROR;
};
