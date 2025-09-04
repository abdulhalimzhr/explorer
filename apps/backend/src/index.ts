import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { staticPlugin } from '@elysiajs/static';
import { folderRoutes } from './routes/folders';
import { fileRoutes } from './routes/files';
import { errorHandler } from './middleware/error.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware';
import { validationMiddleware } from './middleware/validation.middleware';

const PORT = parseInt(process.env.PORT || '3001');
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Simple startup validation
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const app = new Elysia()
  .use(loggingMiddleware)
  .use(rateLimitMiddleware)
  .use(validationMiddleware)
  .use(errorHandler)
  .use(cors({
    origin: NODE_ENV === 'development' ? true : CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  }))
  .use(swagger({
    documentation: {
      info: {
        title: 'File Explorer API',
        version: '1.0.0',
        description: 'RESTful API for Explorer-like file management',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        }
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: NODE_ENV === 'development' ? 'Development server' : 'Production server'
        }
      ],
      tags: [
        { name: 'health', description: 'Health check endpoints' },
        { name: 'folders', description: 'Folder management operations' },
        { name: 'files', description: 'File management operations' }
      ]
    },
    path: '/swagger'
  }))
  .use(staticPlugin({
    assets: 'public',
    prefix: '/static'
  }))
  .get('/health', () => ({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: NODE_ENV,
    uptime: Math.floor(process.uptime())
  }), {
    detail: {
      tags: ['health'],
      summary: 'Health check',
      description: 'Returns the current status of the API server'
    }
  })
  .group('/api/v1', (app) =>
    app
      .use(folderRoutes)
      .use(fileRoutes)
  )
  .listen(PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

console.log(`Server running at http://localhost:${PORT}`);
console.log(`API Documentation: http://localhost:${PORT}/swagger`);
console.log(`Health Check: http://localhost:${PORT}/health`);
console.log(`Environment: ${NODE_ENV}`);

export type App = typeof app;