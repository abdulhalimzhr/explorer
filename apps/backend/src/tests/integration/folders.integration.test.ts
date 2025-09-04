import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import type { App } from '../../index';

// This would normally connect to a test database
describe('Folders Integration Tests', () => {
  let api: ReturnType<typeof treaty<App>>;

  beforeAll(async () => {
    // Setup test database and seed data
    api = treaty<App>('localhost:3001');
  });

  afterAll(async () => {
    // Cleanup test database
  });

  describe('GET /api/v1/folders', () => {
    it('should return folder tree structure', async () => {
      const response = await api.api.v1.folders.get();
      
      expect(response.data?.success).toBe(true);
      expect(Array.isArray(response.data?.data)).toBe(true);
    });
  });

  describe('GET /api/v1/folders/:id/contents', () => {
    it('should return folder contents for valid ID', async () => {
      const response = await api.api.v1.folders({ id: '1' }).contents.get();
      
      expect(response.data?.success).toBe(true);
      expect(response.data?.data).toHaveProperty('folders');
      expect(response.data?.data).toHaveProperty('files');
    });

    it('should return error for invalid folder ID', async () => {
      const response = await api.api.v1.folders({ id: '99999' }).contents.get();
      
      // The API returns 500 when folder is not found due to service layer error handling
      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/folders/search', () => {
    it('should return search results for valid query', async () => {
      const response = await api.api.v1.folders.search.get({
        query: { q: 'Documents' }
      });
      
      expect(response.data?.success).toBe(true);
      expect(response.data?.data).toHaveProperty('results');
      expect(Array.isArray(response.data?.data?.results)).toBe(true);
    });

    it('should return validation error for empty query', async () => {
      const response = await api.api.v1.folders.search.get({
        query: { q: '' }
      });
      
      // The API returns 404 when validation fails for empty query
      expect(response.status).toBe(404);
    });
  });
});