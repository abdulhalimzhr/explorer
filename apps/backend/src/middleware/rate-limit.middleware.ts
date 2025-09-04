import { Elysia } from 'elysia';
import { AppError } from './error.middleware';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  check(clientId: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(clientId);

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      const resetTime = now + this.windowMs;
      this.requests.set(clientId, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

export const rateLimitMiddleware = new Elysia()
  .derive(({ request, headers }) => {
    // Use IP address as client identifier
    const clientId = headers['x-forwarded-for'] || 
                    headers['x-real-ip'] || 
                    'unknown';
    
    return { clientId: clientId as string };
  })
  .onBeforeHandle(({ clientId, set }) => {
    const result = rateLimiter.check(clientId);

    // Add rate limit headers
    set.headers['X-RateLimit-Limit'] = rateLimiter['maxRequests'].toString();
    set.headers['X-RateLimit-Remaining'] = result.remaining.toString();
    set.headers['X-RateLimit-Reset'] = Math.ceil(result.resetTime / 1000).toString();

    if (!result.allowed) {
      throw new AppError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }
  });