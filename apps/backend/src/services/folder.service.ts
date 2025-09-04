import { FolderRepository, type FolderWithChildren } from '../repositories/folder.repository';
import { FileRepository } from '../repositories/file.repository';
import { cacheService } from './cache.service';
import { AppError } from '../middleware/error.middleware';
import type { Folder, File } from '../database/schema';

export interface FolderContents {
  folders: Folder[];
  files: File[];
}

export class FolderService {
  private folderRepo: FolderRepository;
  private fileRepo: FileRepository;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.folderRepo = new FolderRepository();
    this.fileRepo = new FileRepository();
  }

  async getFolderTree(): Promise<FolderWithChildren[]> {
    const cacheKey = 'folder-tree';
    
    // Try cache first
    const cached = cacheService.get<FolderWithChildren[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const folderTree = await this.folderRepo.buildFolderTree();
      cacheService.set(cacheKey, folderTree, this.CACHE_TTL);
      return folderTree;
    } catch (error) {
      console.error('Failed to build folder tree:', error);
      throw new AppError('Unable to load folder structure', 500, 'FOLDER_TREE_ERROR');
    }
  }

  async getFolderContents(folderId: number): Promise<FolderContents> {
    const cacheKey = `folder-contents-${folderId}`;
    
    // Check cache
    const cached = cacheService.get<FolderContents>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Fetch folders and files in parallel
      const [folders, files] = await Promise.all([
        this.folderRepo.findByParentId(folderId),
        this.fileRepo.findByFolderId(folderId)
      ]);

      const contents: FolderContents = { folders, files };
      cacheService.set(cacheKey, contents, this.CACHE_TTL);
      
      return contents;
    } catch (error) {
      console.error(`Failed to get contents for folder ${folderId}:`, error);
      throw new AppError('Unable to load folder contents', 500, 'FOLDER_CONTENTS_ERROR');
    }
  }

  async getFolderById(id: number): Promise<Folder | null> {
    const cacheKey = `folder-${id}`;
    
    // Try cache first
    const cached = cacheService.get<Folder>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const folder = await this.folderRepo.findById(id);
      
      // Cache the result (even if null to avoid repeated DB calls)
      if (folder) {
        cacheService.set(cacheKey, folder, this.CACHE_TTL);
      }
      
      return folder || null;
    } catch (error) {
      console.error(`Failed to get folder ${id}:`, error);
      throw new AppError('Unable to load folder', 500, 'FOLDER_FETCH_ERROR');
    }
  }

  async searchFolders(query: string): Promise<Folder[]> {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const cacheKey = `search-${searchTerm}`;
    
    // Check cache
    const cached = cacheService.get<Folder[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const allFolders = await this.folderRepo.findAll();
      
      // Filter folders by name or path
      const results = allFolders.filter(folder => {
        const nameMatch = folder.name.toLowerCase().includes(searchTerm);
        const pathMatch = folder.path.toLowerCase().includes(searchTerm);
        return nameMatch || pathMatch;
      });

      // Sort by relevance: exact name matches first, then alphabetical
      results.sort((a, b) => {
        const aExactMatch = a.name.toLowerCase() === searchTerm;
        const bExactMatch = b.name.toLowerCase() === searchTerm;
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        return a.name.localeCompare(b.name);
      });

      // Cache results for shorter time since search results can change
      cacheService.set(cacheKey, results, this.CACHE_TTL / 2);
      
      return results;
    } catch (error) {
      console.error(`Failed to search folders with query "${query}":`, error);
      throw new AppError('Search failed', 500, 'FOLDER_SEARCH_ERROR');
    }
  }

  // Helper method to invalidate cache when folders change
  invalidateCache(folderId?: number): void {
    if (folderId) {
      cacheService.delete(`folder-${folderId}`);
      cacheService.delete(`folder-contents-${folderId}`);
    }
    
    // Always invalidate tree cache when any folder changes
    cacheService.delete('folder-tree');
  }
}