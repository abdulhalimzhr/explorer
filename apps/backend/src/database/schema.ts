import { pgTable, serial, varchar, integer, text, timestamp, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  parentId: integer('parent_id').references(() => folders.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  folderId: integer('folder_id').notNull().references(() => folders.id, { onDelete: 'cascade' }),
  size: bigint('size', { mode: 'number' }).default(0),
  mimeType: varchar('mime_type', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;