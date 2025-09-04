import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client with reasonable defaults
const client = postgres(connectionString, {
  max: 10,                    // Maximum number of connections
  idle_timeout: 20,           // Close idle connections after 20 seconds
  connect_timeout: 10,        // Connection timeout in seconds
  prepare: false,             // Disable prepared statements for better compatibility
  onnotice: () => {},         // Suppress notices in production
});

// Test connection on startup
client`SELECT 1`.catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

export const db = drizzle(client, { schema });

export type Database = typeof db;

// Graceful shutdown
process.on('beforeExit', async () => {
  await client.end();
});