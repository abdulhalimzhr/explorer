// Simple configuration object - no need to over-engineer this
export const config = {
  // Server settings
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  
  // File uploads
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // Rate limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Cache
  cacheDefaultTTL: 5 * 60 * 1000, // 5 minutes
  cacheCleanupInterval: 10 * 60 * 1000, // 10 minutes
  
  // Helper methods
  isDev: () => process.env.NODE_ENV === 'development',
  isProd: () => process.env.NODE_ENV === 'production',
} as const;