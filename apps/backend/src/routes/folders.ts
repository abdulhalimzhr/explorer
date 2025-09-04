import { Elysia, t } from 'elysia';
import { FolderService } from '../services/folder.service';
import { FolderParamsSchema, SearchQuerySchema, type ApiResponse } from '../types/api.types';
import { AppError } from '../middleware/error.middleware';

const folderService = new FolderService();

export const folderRoutes = new Elysia({ prefix: '/folders' })
  .get('/', async (): Promise<ApiResponse> => {
    const folderTree = await folderService.getFolderTree();
    return {
      success: true,
      data: folderTree,
      timestamp: new Date().toISOString()
    };
  }, {
    detail: {
      tags: ['folders'],
      summary: 'Get complete folder tree structure',
      description: 'Returns the complete hierarchical folder structure with all nested folders'
    }
  })
  
  .get('/:id/contents', async ({ params }): Promise<ApiResponse> => {
    const { id } = FolderParamsSchema.parse(params);
    
    const folder = await folderService.getFolderById(id);
    if (!folder) {
      throw new AppError('Folder not found', 404, 'FOLDER_NOT_FOUND');
    }

    const contents = await folderService.getFolderContents(id);
    return {
      success: true,
      data: {
        folder,
        ...contents
      },
      timestamp: new Date().toISOString()
    };
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['folders'],
      summary: 'Get folder contents',
      description: 'Returns direct subfolders and files of the specified folder'
    }
  })

  .get('/:id', async ({ params }): Promise<ApiResponse> => {
    const { id } = FolderParamsSchema.parse(params);
    
    const folder = await folderService.getFolderById(id);
    if (!folder) {
      throw new AppError('Folder not found', 404, 'FOLDER_NOT_FOUND');
    }

    return {
      success: true,
      data: folder,
      timestamp: new Date().toISOString()
    };
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['folders'],
      summary: 'Get folder by ID',
      description: 'Returns a specific folder by its ID'
    }
  })

  .get('/search', async ({ query }): Promise<ApiResponse> => {
    const { q } = SearchQuerySchema.parse(query);
    
    const results = await folderService.searchFolders(q);
    return {
      success: true,
      data: {
        query: q,
        results,
        count: results.length
      },
      timestamp: new Date().toISOString()
    };
  }, {
    query: t.Object({
      q: t.String()
    }),
    detail: {
      tags: ['folders'],
      summary: 'Search folders',
      description: 'Search folders by name or path with fuzzy matching'
    }
  });