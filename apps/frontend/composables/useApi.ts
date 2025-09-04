import type { Folder, File } from '~/types';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp?: string;
}

interface SearchResponse {
  query: string;
  results: Folder[];
  count: number;
}

type FolderWithChildren = Folder;

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  // Generic API call function
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${baseURL}/api/v1${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  };

  // Folder API methods
  const getFolderTree = () => {
    return apiCall<FolderWithChildren[]>('/folders');
  };

  const getFolderById = (id: number) => {
    return apiCall<Folder>(`/folders/${id}`);
  };

  const getFolderContents = (id: number) => {
    return apiCall<{ folder: Folder; folders: Folder[]; files: File[] }>(`/folders/${id}/contents`);
  };

  const searchFolders = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    return apiCall<SearchResponse>(`/folders/search?q=${encodedQuery}`);
  };

  // File API methods
  const getFilesByFolder = (folderId: number) => {
    return apiCall<File[]>(`/files/folder/${folderId}`);
  };

  const getFileById = (id: number) => {
    return apiCall<File>(`/files/${id}`);
  };

  return {
    getFolderTree,
    getFolderById,
    getFolderContents,
    searchFolders,
    getFilesByFolder,
    getFileById,
  };
};