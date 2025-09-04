export const useFileUtils = () => {
  // Format file size in human readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Get appropriate icon class based on file type
  const getFileIcon = (mimeType?: string): string => {
    if (!mimeType) return 'text-gray-500';

    const iconMap: Record<string, string> = {
      // Images
      'image/jpeg': 'text-green-500',
      'image/jpg': 'text-green-500',
      'image/png': 'text-green-500',
      'image/gif': 'text-green-500',
      'image/svg+xml': 'text-green-500',
      
      // Documents
      'application/pdf': 'text-red-500',
      'application/msword': 'text-blue-500',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'text-blue-500',
      'application/vnd.ms-excel': 'text-green-600',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'text-green-600',
      'application/vnd.ms-powerpoint': 'text-orange-500',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'text-orange-500',
      
      // Text files
      'text/plain': 'text-gray-600',
      'text/html': 'text-orange-600',
      'text/css': 'text-blue-600',
      'text/javascript': 'text-yellow-600',
      'application/json': 'text-yellow-600',
      
      // Archives
      'application/zip': 'text-purple-500',
      'application/x-rar-compressed': 'text-purple-500',
      'application/x-7z-compressed': 'text-purple-500',
      
      // Audio/Video
      'audio/mpeg': 'text-pink-500',
      'audio/wav': 'text-pink-500',
      'video/mp4': 'text-red-600',
      'video/avi': 'text-red-600',
    };

    return iconMap[mimeType] || 'text-gray-500';
  };

  // Get file type category
  const getFileCategory = (mimeType?: string): string => {
    if (!mimeType) return 'unknown';

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return 'archive';

    return 'file';
  };

  // Check if file is an image
  const isImage = (mimeType?: string): boolean => {
    return mimeType?.startsWith('image/') || false;
  };

  // Check if file can be previewed
  const canPreview = (mimeType?: string): boolean => {
    if (!mimeType) return false;
    
    const previewableTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml',
      'text/plain', 'text/html', 'text/css', 'text/javascript',
      'application/json', 'application/pdf'
    ];
    
    return previewableTypes.includes(mimeType);
  };

  return {
    formatFileSize,
    getFileIcon,
    getFileCategory,
    isImage,
    canPreview,
  };
};