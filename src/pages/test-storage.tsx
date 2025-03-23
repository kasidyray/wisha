import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DropzoneUpload } from '@/components/DropzoneUpload';
import { StorageImage, StorageFile } from '@/components/StorageImage';
import { storageService, FileUploadResult } from '@/services/storage';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const TestStorage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);
  const [uploadedBulkFiles, setUploadedBulkFiles] = useState<FileUploadResult[]>([]);

  const handleUploadComplete = (result: FileUploadResult) => {
    setUploadedFiles(prev => [...prev, result]);
  };

  const handleBulkUploadComplete = (results: FileUploadResult[]) => {
    setUploadedBulkFiles(prev => [...prev, ...results]);
  };

  const handleDeleteFile = async (path: string, isImage: boolean) => {
    try {
      const success = await storageService.deleteFile(path);
      if (success) {
        toast.success('File deleted successfully');
        // Remove from state
        if (isImage) {
          setUploadedFiles(prev => prev.filter(file => file.path !== path));
        } else {
          setUploadedBulkFiles(prev => prev.filter(file => file.path !== path));
        }
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Storage Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Simple File Upload</h2>
            <p className="text-gray-600">
              Upload a single file (image, document, etc.) using a simple button interface
            </p>
            
            <FileUpload 
              onUploadComplete={handleUploadComplete}
              folder="test-images"
              accept="image/*"
              buttonText="Upload Image"
            />
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Uploaded Images</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <StorageImage 
                      path={file.path} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="p-3 flex justify-between items-center">
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{file.fileName}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFile(file.path, true)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Drag & Drop Upload</h2>
            <p className="text-gray-600">
              Upload multiple files at once using drag and drop
            </p>
            
            <DropzoneUpload 
              onUploadComplete={handleBulkUploadComplete}
              folder="test-files"
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc', '.docx'],
                'text/plain': ['.txt'],
              }}
              multiple={true}
              maxFiles={5}
            />
          </div>
          
          {uploadedBulkFiles.length > 0 && (
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Uploaded Files</h2>
              
              <div className="space-y-2">
                {uploadedBulkFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.contentType.startsWith('image/') ? (
                        <div className="h-12 w-12 flex-shrink-0">
                          <StorageImage 
                            path={file.path}
                            className="h-full w-full object-cover rounded"
                            showPlaceholder={false}
                          />
                        </div>
                      ) : (
                        <StorageFile 
                          path={file.path}
                          label={file.fileName}
                          className="flex-1 min-w-0"
                        />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(file.path, false)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestStorage; 