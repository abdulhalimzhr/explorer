import { Elysia } from 'elysia';

export const loggingMiddleware = new Elysia()
  .derive(({ request }) => ({
    startTime: Date.now()
  }))
  .onRequest(({ request, startTime }) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${new URL(request.url).pathname}`);
  })
  .onResponse(({ request, startTime }) => {
    const duration = Date.now() - startTime;
    const url = new URL(request.url);
    console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname} - ${duration}ms`);
  });