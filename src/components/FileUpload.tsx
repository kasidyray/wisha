import React, { useState, useRef } from 'react';
import { storageService, FileUploadResult } from '@/services/storage';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface FileUploadProps {
  onUploadComplete?: (result: FileUploadResult) => void;
  onUploadError?: (error: Error) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  buttonText?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  folder = 'uploads',
  accept = 'image/*',
  maxSizeMB = 5,
  buttonText = 'Upload File',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    setFile(selectedFile);

    // Create preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await storageService.uploadFile(file, folder);
      
      toast.success('File uploaded successfully!');
      onUploadComplete?.(result);
      // Reset state after successful upload
      setFile(null);
      setPreview(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Provide a more user-friendly error message
      if (error.message?.includes('storage/bucket-not-found')) {
        toast.error('Storage bucket does not exist. Please set up your storage bucket.');
      } else if (error.message?.includes('storage/unauthorized')) {
        toast.error('You do not have permission to upload files.');
      } else if (error.message?.includes('storage/quota-exceeded')) {
        toast.error('Storage quota exceeded. Please contact support.');
      } else if (error.message?.includes('storage/object-too-large')) {
        toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      } else {
        toast.error('Failed to upload file. Please try again.');
      }
      
      onUploadError?.(error as Error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          <span>Select File</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {file && (
          <Button
            type="button"
            variant="airbnb"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>{buttonText}</span>
              </>
            )}
          </Button>
        )}
      </div>

      {file && (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-12 w-12 object-cover rounded-md"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                File
              </div>
            )}
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
            onClick={handleClearFile}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}; 