import { API_STATUSES } from './apiStatuses';

export type ApiErrorCode = keyof typeof API_STATUSES;

export type ApiErrorBody = {
  error: ApiErrorCode;
  details?: Record<string, string[] | undefined>;
};
