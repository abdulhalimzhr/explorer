import { z } from 'zod';

export const FolderSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  parentId: z.number().nullable(),
  path: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  children: z.array(z.lazy(() => FolderSchema)).optional()
});

export const FileSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  folderId: z.number(),
  size: z.number().min(0),
  mimeType: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string().optional()
});

export const validateApiResponse = <T>(data: unknown, schema: z.ZodSchema<T>): T => {
  const apiResponse = ApiResponseSchema.parse(data);
  
  if (!apiResponse.success) {
    throw new Error(apiResponse.error || 'API request failed');
  }
  
  return schema.parse(apiResponse.data);
};

export type ValidatedFolder = z.infer<typeof FolderSchema>;
export type ValidatedFile = z.infer<typeof FileSchema>;