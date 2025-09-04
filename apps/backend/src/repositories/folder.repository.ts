import { eq, isNull } from 'drizzle-orm';
import { db } from '../database/connection';
import { folders, type Folder, type NewFolder } from '../database/schema';

export interface FolderWithChildren extends Folder {
  children?: FolderWithChildren[];
}

export class FolderRepository {
  async findAll(): Promise<Folder[]> {
    try {
      return await db.select().from(folders).orderBy(folders.name);
    } catch (error) {
      console.error('Failed to fetch all folders:', error);
      throw new Error('Database query failed');
    }
  }

  async findById(id: number): Promise<Folder | undefined> {
    try {
      const result = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error(`Failed to fetch folder ${id}:`, error);
      throw new Error('Database query failed');
    }
  }

  async findByParentId(parentId: number | null): Promise<Folder[]> {
    try {
      const query = parentId === null 
        ? db.select().from(folders).where(isNull(folders.parentId))
        : db.select().from(folders).where(eq(folders.parentId, parentId));
      
      return await query.orderBy(folders.name);
    } catch (error) {
      console.error(`Failed to fetch folders for parent ${parentId}:`, error);
      throw new Error('Database query failed');
    }
  }

  async findRootFolders(): Promise<Folder[]> {
    return this.findByParentId(null);
  }

  async buildFolderTree(): Promise<FolderWithChildren[]> {
    try {
      const allFolders = await this.findAll();
      
      if (allFolders.length === 0) {
        return [];
      }

      const folderMap = new Map<number, FolderWithChildren>();
      
      // Create map of all folders with empty children arrays
      allFolders.forEach(folder => {
        folderMap.set(folder.id, { ...folder, children: [] });
      });

      const rootFolders: FolderWithChildren[] = [];

      // Build tree structure
      allFolders.forEach(folder => {
        const folderWithChildren = folderMap.get(folder.id);
        if (!folderWithChildren) return;
        
        if (folder.parentId === null) {
          rootFolders.push(folderWithChildren);
        } else {
          const parent = folderMap.get(folder.parentId);
          if (parent && parent.children) {
            parent.children.push(folderWithChildren);
          }
        }
      });

      return rootFolders;
    } catch (error) {
      console.error('Failed to build folder tree:', error);
      throw new Error('Failed to build folder structure');
    }
  }

  async create(folder: NewFolder): Promise<Folder> {
    try {
      const result = await db.insert(folders).values(folder).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw new Error('Failed to create folder');
    }
  }

  async update(id: number, updates: Partial<NewFolder>): Promise<Folder | undefined> {
    try {
      const result = await db.update(folders)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(folders.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error(`Failed to update folder ${id}:`, error);
      throw new Error('Failed to update folder');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await db.delete(folders).where(eq(folders.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error(`Failed to delete folder ${id}:`, error);
      throw new Error('Failed to delete folder');
    }
  }
}