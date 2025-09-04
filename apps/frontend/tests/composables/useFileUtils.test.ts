import { describe, it, expect } from 'vitest';
import { useFileUtils } from '~/composables/useFileUtils';

describe('useFileUtils', () => {
  const { formatFileSize, getFileIcon, getFileCategory } =
    useFileUtils();

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1099511627776)).toBe('1 TB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });
  });

  describe('getFileIcon', () => {
    it('should return correct icon classes for different mime types', () => {
      expect(getFileIcon('image/jpeg')).toBe('text-green-500');
      expect(getFileIcon('video/mp4')).toBe('text-red-600');
      expect(getFileIcon('audio/mpeg')).toBe('text-pink-500');
      expect(getFileIcon('application/pdf')).toBe('text-red-500');
      expect(
        getFileIcon(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ).toBe('text-blue-500');
      expect(getFileIcon('text/plain')).toBe('text-gray-600');
    });

    it('should return default icon for unknown mime types', () => {
      expect(getFileIcon('application/unknown')).toBe(
        'text-gray-500'
      );
      expect(getFileIcon()).toBe('text-gray-500');
    });
  });

  describe('getFileCategory', () => {
    it('should return correct categories for different mime types', () => {
      expect(getFileCategory('image/jpeg')).toBe('image');
      expect(getFileCategory('video/mp4')).toBe('video');
      expect(getFileCategory('audio/mpeg')).toBe('audio');
      expect(getFileCategory('application/pdf')).toBe('pdf');
      expect(
        getFileCategory(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ).toBe('document');
      expect(getFileCategory('text/plain')).toBe('text');
    });

    it('should return default category for unknown mime types', () => {
      expect(getFileCategory('application/unknown')).toBe('file');
      expect(getFileCategory()).toBe('unknown');
    });
  });
});
