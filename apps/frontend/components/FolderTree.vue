<script setup lang="ts">
import { ChevronRightIcon, ChevronDownIcon, FolderIcon } from '@heroicons/vue/24/outline';
import type { Folder } from '~/types';

interface Props {
  folders: Folder[];
  level?: number;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
});

const explorerStore = useExplorerStore();

const handleFolderClick = (folder: Folder) => {
  explorerStore.selectFolder(folder);
};

const handleToggleExpansion = (folder: Folder, event: Event) => {
  event.stopPropagation();
  explorerStore.toggleFolderExpansion(folder.id);
};

const hasChildren = (folder: Folder): boolean => {
  return folder.children && folder.children.length > 0;
};
</script>

<template>
  <div class="select-none">
    <div
      v-for="folder in folders"
      :key="folder.id"
      class="folder-item"
    >
      <div
        class="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
        :class="{
          'bg-blue-100 border-l-4 border-blue-500': explorerStore.selectedFolder?.id === folder.id,
          'ml-4': level > 0
        }"
        data-testid="folder-item"
        @click="handleFolderClick(folder)"
      >
        <button
          v-if="hasChildren(folder)"
          class="flex-shrink-0 w-4 h-4 mr-1 hover:bg-gray-200 rounded"
          data-testid="expand-button"
          @click="handleToggleExpansion(folder, $event)"
        >
          <ChevronDownIcon
            v-if="explorerStore.isFolderExpanded(folder.id)"
            class="w-4 h-4 text-gray-600"
          />
          <ChevronRightIcon
            v-else
            class="w-4 h-4 text-gray-600"
          />
        </button>
        <div
          v-else
          class="w-4 h-4 mr-1"
        />
        
        <FolderIcon class="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
        <span class="text-sm text-gray-800 truncate">{{ folder.name }}</span>
      </div>

      <div
        v-if="hasChildren(folder) && explorerStore.isFolderExpanded(folder.id)"
        class="ml-2"
      >
        <FolderTree
          :folders="folder.children"
          :level="level + 1"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder-item {
  @apply transition-colors duration-150;
}
</style>