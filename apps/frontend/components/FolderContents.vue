<script setup lang="ts">
import { FolderIcon, DocumentIcon } from '@heroicons/vue/24/outline';
import type { Folder, File } from '~/types';

interface Props {
  folders: Folder[];
  files: File[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

// Composables
const explorerStore = useExplorerStore();
const { formatFileSize, getFileIcon } = useFileUtils();

// Computed
const totalItems = computed(() => props.folders.length + props.files.length);
const isEmpty = computed(() => totalItems.value === 0 && !props.loading);

// Methods
const handleFolderDoubleClick = (folder: Folder) => {
  explorerStore.selectFolder(folder);
};

const handleFileClick = (file: File) => {
  // Could emit event or handle file preview/download
  console.log('File clicked:', file.name);
};
</script>

<template>
  <div class="h-full overflow-auto">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="flex items-center justify-center h-full"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-500">Loading contents...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="isEmpty"
      class="flex items-center justify-center h-full text-gray-500"
    >
      <div class="text-center">
        <FolderIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p class="text-lg font-medium mb-2">No contents to display</p>
        <p class="text-sm">Select a folder to view its contents</p>
      </div>
    </div>

    <!-- Content -->
    <div
      v-else
      class="p-4 space-y-6"
    >
      <!-- Summary -->
      <div class="text-sm text-gray-600">
        {{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }}
        <span v-if="folders.length > 0">({{ folders.length }} folder{{ folders.length !== 1 ? 's' : '' }})</span>
        <span v-if="files.length > 0">({{ files.length }} file{{ files.length !== 1 ? 's' : '' }})</span>
      </div>

      <!-- Folders Section -->
      <section v-if="folders.length > 0">
        <h3 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Folders ({{ folders.length }})
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          <div
            v-for="folder in folders"
            :key="folder.id"
            class="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
            :title="`Double-click to open ${folder.name}`"
            @dblclick="handleFolderDoubleClick(folder)"
          >
            <FolderIcon class="w-12 h-12 text-blue-600 mb-2" />
            <span class="text-xs text-center text-gray-800 truncate w-full">
              {{ folder.name }}
            </span>
          </div>
        </div>
      </section>

      <!-- Files Section -->
      <section v-if="files.length > 0" data-testid="files-section">
        <h3 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Files ({{ files.length }})
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          <div
            v-for="file in files"
            :key="file.id"
            class="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
            :title="`${file.name} (${formatFileSize(file.size)})`"
            @click="handleFileClick(file)"
          >
            <DocumentIcon 
              class="w-12 h-12 mb-2"
              :class="getFileIcon(file.mimeType)"
            />
            <span class="text-xs text-center text-gray-800 truncate w-full">
              {{ file.name }}
            </span>
            <span class="text-xs text-gray-500 mt-1">
              {{ formatFileSize(file.size) }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>