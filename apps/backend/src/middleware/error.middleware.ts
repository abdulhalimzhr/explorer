import { Elysia } from 'elysia';
import type { ApiResponse } from '../types/api.types';

export class AppError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError);
  }
}

export const errorHandler = new Elysia()
  .error({
    APP_ERROR: AppError,
    VALIDATION_ERROR: Error,
    NOT_FOUND: Error
  })
  .onError(({ code, error, set, request }) => {
    const timestamp = new Date().toISOString();
    const url = new URL(request.url);

    // Log error details for debugging
    console.error(
      `[${timestamp}] Error on ${request.method} ${url.pathname}:`,
      {
        code,
        message: error.message,
        stack: error.stack
      }
    );

    switch (code) {
      case 'APP_ERROR':
        const appError = error as AppError;
        set.status = appError.statusCode;
        return {
          success: false,
          error: appError.message,
          code: appError.code,
          timestamp
        } as ApiResponse;

      case 'VALIDATION_ERROR':
        set.status = 400;
        return {
          success: false,
          error: `Validation failed: ${error.message}`,
          code: 'VALIDATION_ERROR',
          timestamp
        } as ApiResponse;

      case 'NOT_FOUND':
        set.status = 404;
        return {
          success: false,
          error: 'Resource not found',
          code: 'NOT_FOUND',
          timestamp
        } as ApiResponse;

      default:
        // Don't expose internal errors in production
        const isDev = process.env.NODE_ENV === 'development';
        set.status = 500;
        return {
          success: false,
          error: isDev ? error.message : 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp
        } as ApiResponse;
    }
  });
