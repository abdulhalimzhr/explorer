import { eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { files, type File, type NewFile } from '../database/schema';

export class FileRepository {
  async findAll(): Promise<File[]> {
    return await db.select().from(files);
  }

  async findById(id: number): Promise<File | undefined> {
    const result = await db.select().from(files).where(eq(files.id, id));
    return result[0];
  }

  async findByFolderId(folderId: number): Promise<File[]> {
    return await db.select().from(files).where(eq(files.folderId, folderId));
  }

  async create(file: NewFile): Promise<File> {
    const result = await db.insert(files).values(file).returning();
    return result[0];
  }

  async update(id: number, file: Partial<NewFile>): Promise<File | undefined> {
    const result = await db.update(files)
      .set({ ...file, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id));
    return result.rowCount > 0;
  }
}