import { defineStore } from 'pinia';
import { usePerformanceMonitor } from '~/utils/performance';
import type { Folder, FolderContents } from '~/types';

export const useExplorerStore = defineStore('explorer', () => {
  const folderTree = ref<Folder[]>([]);
  const selectedFolder = ref<Folder | null>(null);
  const folderContents = ref<FolderContents>({ folders: [], files: [] });
  const expandedFolders = ref<Set<number>>(new Set());
  const loading = ref(false);
  const error = ref<string | null>(null);

  const { getFolderTree, getFolderContents } = useApi();
  const { measureAsync } = usePerformanceMonitor();

  const loadFolderTree = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await measureAsync('load-folder-tree', () => getFolderTree());
      if (response.success && response.data) {
        folderTree.value = response.data;
      } else {
        error.value = response.error || 'Failed to load folder tree';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  const selectFolder = async (folder: Folder) => {
    selectedFolder.value = folder;
    loading.value = true;
    error.value = null;

    try {
      const response = await measureAsync('load-folder-contents', () => getFolderContents(folder.id));
      if (response.success && response.data) {
        folderContents.value = {
          folders: response.data.folders,
          files: response.data.files
        };
      } else {
        error.value = response.error || 'Failed to load folder contents';
        folderContents.value = { folders: [], files: [] };
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      folderContents.value = { folders: [], files: [] };
    } finally {
      loading.value = false;
    }
  };

  const toggleFolderExpansion = (folderId: number) => {
    if (expandedFolders.value.has(folderId)) {
      expandedFolders.value.delete(folderId);
    } else {
      expandedFolders.value.add(folderId);
    }
  };

  const isFolderExpanded = (folderId: number): boolean => {
    return expandedFolders.value.has(folderId);
  };

  const clearSelection = () => {
    selectedFolder.value = null;
    folderContents.value = { folders: [], files: [] };
  };

  return {
    folderTree: readonly(folderTree),
    selectedFolder: readonly(selectedFolder),
    folderContents: readonly(folderContents),
    expandedFolders: readonly(expandedFolders),
    loading: readonly(loading),
    error: readonly(error),
    loadFolderTree,
    selectFolder,
    toggleFolderExpansion,
    isFolderExpanded,
    clearSelection
  };
});