import type { ApiError } from '@/constants';

export class AppError extends Error {
  readonly code: ApiError['message'];
  readonly status: ApiError['status'];

  constructor(error: ApiError, readonly details?: unknown) {
    super(error.message);
    this.code = error.message;
    this.status = error.status;
  }
}
