import { z } from 'zod';

// Request validation schemas
export const FolderParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
    message: 'ID must be a valid number'
  })
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query cannot be empty').max(100, 'Search query too long')
});

// Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string().optional()
});

// Types
export type FolderParams = z.infer<typeof FolderParamsSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
};