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

export const INTERNAL_SERVER_ERROR = {
  status: 500,
  message: 'INTERNAL_SERVER_ERROR',
} as const;

export const API_STATUSES = {
  VALIDATION_ERROR,
  INVALID_CREDENTIALS,
  UNAUTHORIZED,
  FORBIDDEN,
  CSRF,
  EMAIL_TAKEN,
  INTERNAL_SERVER_ERROR,
} as const;

export type ApiErrorCode = keyof typeof API_STATUSES;
export type ApiError = (typeof API_STATUSES)[ApiErrorCode];
export type ApiErrorMessage = (typeof API_STATUSES)[keyof typeof API_STATUSES]['message'];
export type ApiErrorStatus = (typeof API_STATUSES)[keyof typeof API_STATUSES]['status'];
