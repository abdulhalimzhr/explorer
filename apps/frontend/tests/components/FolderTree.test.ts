import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import FolderTree from '../../components/FolderTree.vue';
import type { Folder } from '../../types';

// Mock the store
const mockSelectFolder = vi.fn();
const mockToggleFolderExpansion = vi.fn();
const mockIsFolderExpanded = vi.fn().mockReturnValue(false);

vi.mock('~/stores/explorer', () => ({
  useExplorerStore: () => ({
    selectFolder: mockSelectFolder,
    toggleFolderExpansion: mockToggleFolderExpansion,
    isFolderExpanded: mockIsFolderExpanded,
    selectedFolder: null
  })
}));

// Mock the global useExplorerStore
vi.stubGlobal('useExplorerStore', () => ({
  selectFolder: mockSelectFolder,
  toggleFolderExpansion: mockToggleFolderExpansion,
  isFolderExpanded: mockIsFolderExpanded,
  selectedFolder: null
}));

const mockFolders: Folder[] = [
  {
    id: 1,
    name: 'Documents',
    parentId: null,
    path: '/Documents',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    children: [
      {
        id: 2,
        name: 'Work',
        parentId: 1,
        path: '/Documents/Work',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
    ]
  }
];

describe('FolderTree', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders folder names correctly', () => {
    const wrapper = mount(FolderTree, {
      props: {
        folders: mockFolders
      }
    });

    expect(wrapper.text()).toContain('Documents');
  });

  it('shows expand/collapse icons for folders with children', () => {
    const wrapper = mount(FolderTree, {
      props: {
        folders: mockFolders
      }
    });

    const expandButton = wrapper.find('[data-testid="expand-button"]');
    expect(expandButton.exists()).toBe(true);
  });

  it('calls selectFolder when folder is clicked', async () => {
    const wrapper = mount(FolderTree, {
      props: {
        folders: mockFolders
      }
    });

    const folderItem = wrapper.find('[data-testid="folder-item"]');
    await folderItem.trigger('click');
    
    expect(mockSelectFolder).toHaveBeenCalledWith(mockFolders[0]);
  });

  it('calls toggleFolderExpansion when expand button is clicked', async () => {
    const wrapper = mount(FolderTree, {
      props: {
        folders: mockFolders
      }
    });

    const expandButton = wrapper.find('[data-testid="expand-button"]');
    await expandButton.trigger('click');
    
    expect(mockToggleFolderExpansion).toHaveBeenCalledWith(1);
  });
});