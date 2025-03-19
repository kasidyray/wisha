
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import Button from './Button';

interface MediaUploadProps {
  onChange: (file: File | null) => void;
  type?: 'image' | 'video' | 'audio' | 'all';
  className?: string;
  label?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onChange, 
  type = 'image',
  className = '',
  label = 'Upload Media'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const getAcceptedTypes = () => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      case 'all':
        return 'image/*,video/*,audio/*';
      default:
        return 'image/*';
    }
  };
  
  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    onChange(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type.startsWith('video/')) {
      setPreview('video');
    } else if (selectedFile.type.startsWith('audio/')) {
      setPreview('audio');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={getAcceptedTypes()}
        className="hidden"
      />
      
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full relative cursor-pointer flex flex-col items-center justify-center p-8 
          rounded-xl border-2 border-dashed transition-all duration-300
          ${isDragging ? 'border-champagne-300 bg-champagne-50' : 'border-gray-200 hover:border-champagne-200 bg-gray-50'}
          ${file ? 'hidden' : 'block'}
        `}
      >
        <Upload className="w-10 h-10 mb-3 text-gray-400" />
        <p className="text-center mb-1">{label}</p>
        <p className="text-xs text-muted-foreground text-center">Drag and drop or click to browse</p>
      </div>
      
      {preview && (
        <div className="relative p-4 bg-white border border-gray-200 rounded-xl shadow-sm animate-fade-in">
          <button 
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          {typeof preview === 'string' && preview.startsWith('data:image/') ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="mx-auto max-h-64 rounded-lg object-contain"
            />
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
              {preview === 'video' ? (
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 mb-2 mx-auto text-gray-400" />
                  <p className="text-sm text-muted-foreground">Video File</p>
                  <p className="text-xs mt-1">{file?.name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 mb-2 mx-auto text-gray-400" />
                  <p className="text-sm text-muted-foreground">Audio File</p>
                  <p className="text-xs mt-1">{file?.name}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm flex-1 truncate">{file?.name}</span>
            <span className="text-xs text-muted-foreground">{(file?.size && Math.round(file.size / 1024)) || 0} KB</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
