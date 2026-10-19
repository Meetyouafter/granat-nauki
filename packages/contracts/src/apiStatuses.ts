export const VALIDATION_ERROR = {
  status: 400,
  message: 'VALIDATION_ERROR',
} as const;

export const INVALID_CREDENTIALS = {
  status: 401,
  message: 'INVALID_CREDENTIALS',
} as const;

export const UNAUTHORIZED = {
  status: 401,
  message: 'UNAUTHORIZED',
} as const;

export const FORBIDDEN = {
  status: 403,
  message: 'FORBIDDEN',
} as const;

// запрос пришёл не со страницы админки (Sec-Fetch-Site !== 'same-origin')
export const CSRF = {
  status: 403,
  message: 'CSRF',
} as const;

export const EMAIL_TAKEN = {
  status: 409,
  message: 'EMAIL_TAKEN',
} as const;

// у пользователя уже есть запрос доступа на рассмотрении
export const ACCESS_REQUEST_PENDING = {
  status: 409,
  message: 'ACCESS_REQUEST_PENDING',
} as const;

export const ACCESS_REQUEST_NOT_FOUND = {
  status: 404,
  message: 'ACCESS_REQUEST_NOT_FOUND',
} as const;

export const ACCESS_REQUEST_ALREADY_DECIDED = {
  status: 409,
  message: 'ACCESS_REQUEST_ALREADY_DECIDED',
} as const;

export const INTERNAL_SERVER_ERROR = {
  status: 500,
  message: 'INTERNAL_SERVER_ERROR',
} as const;

export const TOO_MANY_REQUESTS = {
  status: 429,
  message: 'TOO_MANY_REQUESTS',
} as const;

export const API_STATUSES = {
  VALIDATION_ERROR,
  INVALID_CREDENTIALS,
  UNAUTHORIZED,
  FORBIDDEN,
  CSRF,
  EMAIL_TAKEN,
  ACCESS_REQUEST_PENDING,
  ACCESS_REQUEST_NOT_FOUND,
  ACCESS_REQUEST_ALREADY_DECIDED,
  INTERNAL_SERVER_ERROR,
  TOO_MANY_REQUESTS,
} as const;

export type ApiErrorCode = keyof typeof API_STATUSES;
export type ApiError = (typeof API_STATUSES)[ApiErrorCode];
export type ApiErrorMessage = (typeof API_STATUSES)[keyof typeof API_STATUSES]['message'];
export type ApiErrorStatus = (typeof API_STATUSES)[keyof typeof API_STATUSES]['status'];
