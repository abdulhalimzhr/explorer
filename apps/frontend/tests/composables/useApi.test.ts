import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useApi } from '../../composables/useApi';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useRuntimeConfig
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3001'
    }
  })
}));

// Mock Nuxt's useRuntimeConfig
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    apiBase: 'http://localhost:3001'
  }
}));

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFolderTree', () => {
    it('should fetch folder tree successfully', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, name: 'Documents' }]
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const { getFolderTree } = useApi();
      const result = await getFolderTree();
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/folders', expect.any(Object));
      expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      
      const { getFolderTree } = useApi();
      
      await expect(getFolderTree()).rejects.toThrow('Network error');
    });
  });

  describe('getFolderContents', () => {
    it('should fetch folder contents successfully', async () => {
      const mockResponse = {
        success: true,
        data: { folders: [], files: [] }
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const { getFolderContents } = useApi();
      const result = await getFolderContents(1);
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/folders/1/contents', expect.any(Object));
      expect(result).toEqual(mockResponse);
    });
  });

  describe('searchFolders', () => {
    it('should search folders successfully', async () => {
      const mockResponse = {
        success: true,
        data: { results: [{ id: 1, name: 'Documents' }] }
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const { searchFolders } = useApi();
      const result = await searchFolders('Documents');
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/folders/search?q=Documents', expect.any(Object));
      expect(result).toEqual(mockResponse);
    });

    it('should encode search query properly', async () => {
      const mockResponse = { success: true, data: { results: [] } };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const { searchFolders } = useApi();
      await searchFolders('test query with spaces');
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/folders/search?q=test%20query%20with%20spaces', expect.any(Object));
    });
  });
});