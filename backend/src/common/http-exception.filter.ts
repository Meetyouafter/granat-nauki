import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpException) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorResponse = {
      statusCode,
      message: isHttpException
        ? this.getMessage(exception)
        : 'Внутренняя ошибка сервера',
      error: isHttpException
        ? this.getError(exception)
        : 'Internal Server Error',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }

  private getMessage(exception: HttpException): string | string[] {
    const payload = exception.getResponse();

    if (typeof payload === 'string') return payload;

    const { message } = payload as { message?: string | string[] };

    return message ?? exception.message;
  }

  private getError(exception: HttpException): string {
    const payload = exception.getResponse();

    if (typeof payload === 'object') {
      const { error } = payload as { error?: string };

      if (error) return error;
    }

    return exception.name;
  }
}
