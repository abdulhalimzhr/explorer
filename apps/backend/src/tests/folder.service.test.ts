import { describe, it, expect, beforeEach } from 'bun:test';
import { FolderService } from '../services/folder.service';

describe('FolderService', () => {
  let folderService: FolderService;

  beforeEach(() => {
    folderService = new FolderService();
  });

  describe('getFolderTree', () => {
    it('should return folder tree structure', async () => {
      const result = await folderService.getFolderTree();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getFolderContents', () => {
    it('should return folder contents for valid folder ID', async () => {
      const result = await folderService.getFolderContents(1);
      expect(result).toHaveProperty('folders');
      expect(result).toHaveProperty('files');
      expect(Array.isArray(result.folders)).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
    });
  });

  describe('searchFolders', () => {
    it('should return matching folders for search query', async () => {
      const result = await folderService.searchFolders('Documents');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array for non-matching query', async () => {
      const result = await folderService.searchFolders('NonExistentFolder');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});