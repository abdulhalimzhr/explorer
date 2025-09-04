export const API_ENDPOINTS = {
  FOLDERS: '/folders',
  FOLDER_CONTENTS: (id: number) => `/folders/${id}/contents`,
  FOLDER_BY_ID: (id: number) => `/folders/${id}`,
  SEARCH_FOLDERS: '/folders/search',
  FILES_BY_FOLDER: (folderId: number) => `/files/folder/${folderId}`,
  FILE_BY_ID: (id: number) => `/files/${id}`
} as const;

export const CACHE_KEYS = {
  FOLDER_TREE: 'folder-tree',
  FOLDER_CONTENTS: (id: number) => `folder-contents-${id}`,
  SEARCH_RESULTS: (query: string) => `search-${query}`
} as const;

export const FILE_ICONS = {
  IMAGE: 'text-green-500',
  VIDEO: 'text-purple-500',
  AUDIO: 'text-blue-500',
  PDF: 'text-red-500',
  DOCUMENT: 'text-blue-600',
  DEFAULT: 'text-gray-500'
} as const;

export const MIME_TYPE_CATEGORIES = {
  IMAGE: ['image/'],
  VIDEO: ['video/'],
  AUDIO: ['audio/'],
  PDF: ['application/pdf'],
  DOCUMENT: ['application/vnd.openxmlformats', 'application/msword', 'text/']
} as const;

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SEARCH_RESULTS: 50,
  GRID_BREAKPOINTS: {
    SM: 'sm:grid-cols-2',
    MD: 'md:grid-cols-3',
    LG: 'lg:grid-cols-4',
    XL: 'xl:grid-cols-6'
  }
} as const;