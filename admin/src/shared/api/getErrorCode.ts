import { API_STATUSES, type ApiErrorCode } from '@granat/contracts';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const isApiErrorCode = (value: unknown): value is ApiErrorCode =>
  typeof value === 'string' && value in API_STATUSES;

export const getErrorCode = (
  error: FetchBaseQueryError | SerializedError | undefined,
): ApiErrorCode | null => {
  if (!error || !('status' in error)) return null;
  const { data } = error;
  if (typeof data === 'object' && data !== null && 'error' in data && isApiErrorCode(data.error)) {
    return data.error;
  }
  return null;
};
