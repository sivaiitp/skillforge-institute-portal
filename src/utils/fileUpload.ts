
export const saveMarkdownFile = async (fileName: string, content: string): Promise<string> => {
  try {
    // In a real implementation, you would upload to your server or cloud storage
    // For now, we'll create a simulated file path
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `/content/${sanitizedFileName}`;
    
    // In production, you would:
    // 1. Upload the file to your server's public/content directory
    // 2. Or upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 3. Return the actual URL where the file can be accessed
    
    // For development, we'll use localStorage as a temporary solution
    localStorage.setItem(`markdown_${sanitizedFileName}`, content);
    
    console.log(`File saved to: ${filePath}`);
    console.log(`Content length: ${content.length} characters`);
    
    return filePath;
  } catch (error) {
    console.error('Error saving markdown file:', error);
    throw new Error('Failed to save markdown file');
  }
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'text/markdown',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'audio/mp3',
    'audio/wav'
  ];
  
  const allowedExtensions = ['.md', '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.mp3', '.wav'];
  
  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  return hasValidType || hasValidExtension;
};

export const getFileInfo = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  return {
    size: file.size,
    mimeType: file.type || getMimeTypeFromExtension(extension),
    extension: extension
  };
};

const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    'md': 'text/markdown',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mp4': 'video/mp4',
    'avi': 'video/avi',
    'mp3': 'audio/mp3',
    'wav': 'audio/wav'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};
