import React, { useState, useEffect } from 'react';
import { storageService } from '@/services/storage';
import { FileIcon } from 'lucide-react';

interface StorageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string;
  fallbackText?: string;
  showPlaceholder?: boolean;
}

export const StorageImage: React.FC<StorageImageProps> = ({
  path,
  fallbackText,
  showPlaceholder = true,
  alt = 'Image',
  className = '',
  ...props
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!path) {
      setError(true);
      return;
    }

    // Get the public URL for the image
    try {
      const url = storageService.getPublicUrl(path);
      setImageUrl(url);
      setError(false);
    } catch (err) {
      console.error('Error getting image URL:', err);
      setError(true);
    }
  }, [path]);

  if (error || !imageUrl) {
    if (!showPlaceholder) {
      return null;
    }
    
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-md ${className}`}
        {...props}
      >
        <div className="flex flex-col items-center text-gray-400 p-4">
          <FileIcon size={24} />
          <span className="text-sm mt-2">{fallbackText || 'Image not available'}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

interface StorageFileProps {
  path: string;
  label?: string;
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
  showSize?: boolean;
}

export const StorageFile: React.FC<StorageFileProps> = ({
  path,
  label,
  className = '',
  linkClassName = '',
  iconClassName = '',
  showSize = false,
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!path) {
      setError(true);
      return;
    }

    // Get the public URL for the file
    try {
      const url = storageService.getPublicUrl(path);
      setFileUrl(url);
      setError(false);
    } catch (err) {
      console.error('Error getting file URL:', err);
      setError(true);
    }
  }, [path]);

  if (error || !fileUrl) {
    return null;
  }

  // Extract file name from path
  const fileName = label || path.split('/').pop() || 'File';

  return (
    <div className={`flex items-center ${className}`}>
      <FileIcon className={`mr-2 text-gray-500 ${iconClassName}`} size={18} />
      <a 
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-blue-600 hover:underline truncate ${linkClassName}`}
      >
        {fileName}
      </a>
    </div>
  );
}; 