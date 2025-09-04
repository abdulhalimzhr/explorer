export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  path: string;
  createdAt: string;
  updatedAt: string;
  children?: Folder[];
}

export interface File {
  id: number;
  name: string;
  folderId: number;
  size: number;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FolderContents {
  folders: Folder[];
  files: File[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}