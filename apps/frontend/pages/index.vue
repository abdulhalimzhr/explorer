<script setup lang="ts">
const explorerStore = useExplorerStore();

// Load folder tree on component mount
onMounted(() => {
  explorerStore.loadFolderTree();
});

// Computed properties for reactive data
const folderTree = computed(() => explorerStore.folderTree);
const selectedFolder = computed(() => explorerStore.selectedFolder);
const folderContents = computed(() => explorerStore.folderContents);
const loading = computed(() => explorerStore.loading);
const error = computed(() => explorerStore.error);

// Page metadata
useHead({
  title: 'Explorer - File Manager',
  meta: [
    { name: 'description', content: 'A Explorer-like file manager built with Vue 3 and Nuxt 3' }
  ]
});
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">
          File Explorer
        </h1>
        <div class="w-80">
          <SearchBar />
        </div>
      </div>
    </header>

    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4"
    >
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Folder Tree -->
      <div class="w-80 bg-white border-r border-gray-200 flex flex-col" data-testid="folder-tree-panel">
        <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 class="text-sm font-medium text-gray-700 uppercase tracking-wide">
            Folders
          </h2>
        </div>
        
        <div class="flex-1 overflow-auto p-2">
          <div
            v-if="loading && folderTree.length === 0"
            class="flex items-center justify-center h-32"
            data-testid="loading-spinner"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          
          <FolderTree
            v-else
            :folders="folderTree"
          />
        </div>
      </div>

      <!-- Right Panel - Folder Contents -->
      <div class="flex-1 bg-white flex flex-col" data-testid="folder-contents-panel">
        <div class="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-gray-700 uppercase tracking-wide">
              {{ selectedFolder ? selectedFolder.name : 'Contents' }}
            </h2>
            <div
              v-if="selectedFolder"
              class="text-xs text-gray-500"
            >
              {{ selectedFolder.path }}
            </div>
          </div>
        </div>

        <div class="flex-1 relative">
          <div
            v-if="loading"
            class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <FolderContents
            :folders="folderContents.folders"
            :files="folderContents.files"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 px-6 py-2">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div>
          {{ folderTree.length }} folders loaded
        </div>
        <div v-if="selectedFolder">
          {{ folderContents.folders.length }} folders, {{ folderContents.files.length }} files
        </div>
      </div>
    </footer>
  </div>
</template>