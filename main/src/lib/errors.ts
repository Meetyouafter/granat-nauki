import type { ApiError } from '@/constants';

export class AppError extends Error {
  readonly code: ApiError['message'];
  readonly status: ApiError['status'];
  readonly details: unknown;

  constructor(error: ApiError, details?: unknown) {
    super(error.message);
    this.code = error.message;
    this.status = error.status;
    this.details = details;
  }
}
