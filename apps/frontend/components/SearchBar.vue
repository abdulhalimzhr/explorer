<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import type { Folder } from '~/types';

// Reactive state
const searchQuery = ref('');
const searchResults = ref<Folder[]>([]);
const isSearching = ref(false);
const showResults = ref(false);
const searchError = ref<string | null>(null);

// Composables
const { searchFolders } = useApi();
const explorerStore = useExplorerStore();

// Debounced search function
const performSearch = useDebounceFn(async (query: string) => {
  const trimmedQuery = query.trim();
  
  if (!trimmedQuery) {
    searchResults.value = [];
    showResults.value = false;
    searchError.value = null;
    return;
  }

  if (trimmedQuery.length < 2) {
    return; // Don't search for single characters
  }

  isSearching.value = true;
  searchError.value = null;

  try {
    const response = await searchFolders(trimmedQuery);
    
    if (response.success && response.data?.results) {
      searchResults.value = response.data.results;
      showResults.value = true;
    } else {
      searchResults.value = [];
      showResults.value = false;
    }
  } catch (error) {
    console.error('Search failed:', error);
    searchError.value = 'Search failed. Please try again.';
    searchResults.value = [];
    showResults.value = false;
  } finally {
    isSearching.value = false;
  }
}, 300);

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  performSearch(newQuery);
});

// Handle search result selection
const selectResult = (folder: Folder) => {
  explorerStore.selectFolder(folder);
  clearSearch();
};

// Clear search state
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  showResults.value = false;
  searchError.value = null;
};

// Hide results when clicking outside
const hideResults = () => {
  showResults.value = false;
};

// Show results when focusing if we have results
const handleFocus = () => {
  if (searchResults.value.length > 0) {
    showResults.value = true;
  }
};
</script>

<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="relative">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search folders..."
        class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-colors"
        :class="{ 'border-red-300': searchError }"
        data-testid="search-input"
        @focus="handleFocus"
      />
      
      <!-- Clear button -->
      <button
        v-if="searchQuery"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
        @click="clearSearch"
        aria-label="Clear search"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showResults"
        v-click-outside="hideResults"
        class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        data-testid="search-results"
      >
        <!-- Loading state -->
        <div
          v-if="isSearching"
          class="p-4 text-center text-gray-500 text-sm"
        >
          <div class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>Searching...</span>
          </div>
        </div>
        
        <!-- Error state -->
        <div
          v-else-if="searchError"
          class="p-4 text-center text-red-500 text-sm"
        >
          {{ searchError }}
        </div>
        
        <!-- No results -->
        <div
          v-else-if="searchResults.length === 0"
          class="p-4 text-center text-gray-500 text-sm"
        >
          No folders found for "{{ searchQuery }}"
        </div>
        
        <!-- Results list -->
        <div v-else>
          <button
            v-for="folder in searchResults"
            :key="folder.id"
            type="button"
            class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus:bg-gray-50"
            @click="selectResult(folder)"
          >
            <div class="flex items-center">
              <FolderIcon class="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-gray-900 truncate">
                  {{ folder.name }}
                </div>
                <div class="text-xs text-gray-500 truncate mt-1">
                  {{ folder.path }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>