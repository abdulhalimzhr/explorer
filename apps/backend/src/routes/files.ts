import { Elysia, t } from 'elysia';
import { FileRepository } from '../repositories/file.repository';

const fileRepository = new FileRepository();

export const fileRoutes = new Elysia({ prefix: '/files' })
  .get('/folder/:folderId', async ({ params: { folderId } }) => {
    try {
      const id = parseInt(folderId);
      if (isNaN(id)) {
        return {
          success: false,
          error: 'Invalid folder ID'
        };
      }

      const files = await fileRepository.findByFolderId(id);
      return {
        success: true,
        data: files
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, {
    params: t.Object({
      folderId: t.String()
    }),
    detail: {
      tags: ['files'],
      summary: 'Get files in folder',
      description: 'Returns all files in the specified folder'
    }
  })

  .get('/:id', async ({ params: { id } }) => {
    try {
      const fileId = parseInt(id);
      if (isNaN(fileId)) {
        return {
          success: false,
          error: 'Invalid file ID'
        };
      }

      const file = await fileRepository.findById(fileId);
      if (!file) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      return {
        success: true,
        data: file
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['files'],
      summary: 'Get file by ID',
      description: 'Returns a specific file by its ID'
    }
  });