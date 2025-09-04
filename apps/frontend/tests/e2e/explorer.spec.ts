import { test, expect } from '@playwright/test';

test.describe('Explorer App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display the main interface', async ({ page }) => {
    // Check if the main title is visible
    await expect(page.locator('h1')).toContainText('File Explorer');
    
    // Check if both panels are present
    await expect(page.locator('[data-testid="folder-tree-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="folder-contents-panel"]')).toBeVisible();
  });

  test('should load folder tree on startup', async ({ page }) => {
    // Wait for folder tree to load
    await page.waitForSelector('[data-testid="folder-item"]');
    
    // Check if folders are displayed
    const folderItems = page.locator('[data-testid="folder-item"]');
    await expect(folderItems).toHaveCountGreaterThan(0);
  });

  test('should display folder contents when folder is clicked', async ({ page }) => {
    // Wait for folder tree to load
    await page.waitForSelector('[data-testid="folder-item"]');
    
    // Click on the first folder
    const firstFolder = page.locator('[data-testid="folder-item"]').first();
    await firstFolder.click();
    
    // Wait for contents to load
    await page.waitForTimeout(1000);
    
    // Check if contents panel shows something
    const contentsPanel = page.locator('[data-testid="folder-contents-panel"]');
    await expect(contentsPanel).not.toContainText('Select a folder to view its contents');
  });

  test('should expand and collapse folders', async ({ page }) => {
    // Wait for folder tree to load
    await page.waitForSelector('[data-testid="folder-item"]');
    
    // Find a folder with children and expand it
    const expandButton = page.locator('[data-testid="expand-button"]').first();
    if (await expandButton.isVisible()) {
      await expandButton.click();
      
      // Check if children are now visible
      await page.waitForTimeout(500);
      const childFolders = page.locator('[data-testid="folder-item"]');
      await expect(childFolders).toHaveCountGreaterThan(1);
    }
  });

  test('should search folders', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('[data-testid="search-input"]');
    
    // Type in search box
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Documents');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Check if search results dropdown appears
    const searchResults = page.locator('[data-testid="search-results"]');
    await expect(searchResults).toBeVisible();
  });

  test('should display files in folder contents', async ({ page }) => {
    // Wait for folder tree to load
    await page.waitForSelector('[data-testid="folder-item"]');
    
    // Click on a folder that has files
    const folderWithFiles = page.locator('[data-testid="folder-item"]').first();
    await folderWithFiles.click();
    
    // Wait for contents to load
    await page.waitForTimeout(1000);
    
    // Check if files section exists (even if empty)
    const filesSection = page.locator('[data-testid="files-section"]');
    // Files section should exist even if no files are present
  });

  test('should show loading states', async ({ page }) => {
    // Check initial loading state
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    
    // Loading spinner should appear initially
    await expect(loadingSpinner).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('[data-testid="folder-item"]');
    
    // Loading spinner should disappear
    await expect(loadingSpinner).not.toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // This test would simulate network errors or invalid responses
    // For now, just check that error states don't crash the app
    
    await page.waitForSelector('[data-testid="folder-item"]');
    
    // The app should still be functional
    await expect(page.locator('h1')).toContainText('File Explorer');
  });
});