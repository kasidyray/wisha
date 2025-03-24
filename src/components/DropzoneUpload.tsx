import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { storageService, FileUploadResult } from '@/services/storage';
import { Loader2, Upload, File, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface DropzoneUploadProps {
  onUploadComplete?: (results: FileUploadResult[]) => void;
  onUploadError?: (error: Error) => void;
  folder?: string;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  maxFiles?: number;
  className?: string;
  multiple?: boolean;
}

export const DropzoneUpload: React.FC<DropzoneUploadProps> = ({
  onUploadComplete,
  onUploadError,
  folder = 'uploads',
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
  maxSizeMB = 5,
  maxFiles = 5,
  className = '',
  multiple = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
      // Filter out files that are too large
      const validFiles = acceptedFiles.filter(file => {
        if (file.size > maxSizeBytes) {
          toast.error(`File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`);
          return false;
        }
        return true;
      });

      // Handle file limit
      if (multiple) {
        // For multiple files, check if the combined count exceeds max
        if (files.length + validFiles.length > maxFiles) {
          toast.error(`You can only upload up to ${maxFiles} files at once.`);
          // Only add files up to the max allowed
          const remainingSlots = Math.max(0, maxFiles - files.length);
          setFiles(prev => [...prev, ...validFiles.slice(0, remainingSlots)]);
          return;
        }
        setFiles(prev => [...prev, ...validFiles]);
      } else {
        // For single file upload, just take the first valid file
        if (validFiles.length > 0) {
          setFiles([validFiles[0]]);
        }
      }
    },
    [files.length, maxFiles, maxSizeMB, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled: isUploading,
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const results: FileUploadResult[] = [];
      let hasErrors = false;
      
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i];
          const result = await storageService.uploadFile(file, folder);
          results.push(result);
        } catch (error) {
          console.error(`Error uploading file ${i+1}/${files.length}:`, error);
          hasErrors = true;
        }
        
        // Update progress even if there was an error
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Call the callback with all successfully uploaded files
      if (results.length > 0) {
        const successCount = results.length;
        const errorCount = files.length - successCount;
        
        if (errorCount > 0) {
          toast.warning(`${successCount} ${successCount === 1 ? 'file' : 'files'} uploaded successfully, ${errorCount} failed.`);
        } else {
          toast.success(`${successCount} ${successCount === 1 ? 'file' : 'files'} uploaded successfully!`);
        }
        
        onUploadComplete?.(results);
        // Clear files after upload attempt
        setFiles([]);
      } else {
        throw new Error('No files were uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      
      // Provide a more user-friendly error message
      if (error.message?.includes('storage/bucket-not-found')) {
        toast.error('Storage bucket does not exist. Please set up your storage bucket.');
      } else if (error.message?.includes('storage/unauthorized')) {
        toast.error('You do not have permission to upload files.');
      } else if (error.message?.includes('storage/quota-exceeded')) {
        toast.error('Storage quota exceeded. Please contact support.');
      } else {
        toast.error('Failed to upload files. Please try again.');
      }
      
      onUploadError?.(error as Error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload 
            className={`mb-2 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
            size={32} 
          />
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the files here</p>
          ) : (
            <>
              <p className="text-gray-600 font-medium">
                Drag & drop files here, or click to select
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {multiple 
                  ? `Up to ${maxFiles} files, max ${maxSizeMB}MB each` 
                  : `Maximum size: ${maxSizeMB}MB`
                }
              </p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <File className="h-10 w-10 p-1 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <Button
              type="button"
              onClick={uploadFiles}
              disabled={isUploading || files.length === 0}
              variant="airbnb"
              className="w-full"
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="mr-2" />
                  <span>
                    Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                  </span>
                </div>
              ) : (
                <span>Upload {files.length} {files.length === 1 ? 'file' : 'files'}</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 