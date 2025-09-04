import { db } from '../database/connection';

export class DatabaseUtils {
  static async healthCheck(): Promise<boolean> {
    try {
      await db.execute('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  static async getConnectionInfo() {
    try {
      const result = await db.execute(`
        SELECT 
          current_database() as database_name,
          current_user as user_name,
          version() as version
      `);
      return result[0];
    } catch (error) {
      console.error('Failed to get connection info:', error);
      return null;
    }
  }
}

export const withTransaction = async <T>(
  callback: (tx: typeof db) => Promise<T>
): Promise<T> => {
  return await db.transaction(callback);
};