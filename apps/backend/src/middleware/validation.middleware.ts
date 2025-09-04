import { Elysia } from 'elysia';
import { AppError } from './error.middleware';

export const validationMiddleware = new Elysia().onBeforeHandle(
  ({ request, params, query }) => {
    // Basic request validation
    const url = new URL(request.url);

    // Validate ID parameters are numeric
    if (params && typeof params === 'object' && 'id' in params) {
      const id = parseInt((params as any).id as string);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid ID parameter', 400, 'INVALID_ID');
      }
    }

    // Validate search query length
    if (query && typeof query === 'object' && 'q' in query) {
      const searchQuery = (query as any).q as string;
      if (searchQuery.length > 100) {
        throw new AppError(
          'Search query too long',
          400,
          'QUERY_TOO_LONG'
        );
      }
    }

    // Basic SQL injection protection for search queries
    if (query && typeof query === 'object' && 'q' in query) {
      const searchQuery = (query as any).q as string;
      const suspiciousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i,
        /(--|\/\*|\*\/)/,
        /(\bUNION\b|\bOR\b\s+\d+\s*=\s*\d+)/i
      ];

      if (
        suspiciousPatterns.some((pattern) =>
          pattern.test(searchQuery)
        )
      ) {
        throw new AppError(
          'Invalid search query',
          400,
          'INVALID_QUERY'
        );
      }
    }
  }
);
