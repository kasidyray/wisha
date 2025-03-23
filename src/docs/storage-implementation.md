# Supabase Storage Implementation Guide

This guide explains how to use the Supabase Storage integration in your Wish-Flare application.

## Setup

The storage integration is already set up with the following components:

1. **Storage Service**: A service layer to interact with Supabase Storage
2. **File Upload Components**: UI components for uploading files
3. **Storage Display Components**: UI components for displaying stored files

## Bucket Configuration in Supabase

Before using the storage features, you need to set up your Supabase storage bucket:

1. Log in to your Supabase dashboard
2. Navigate to the "Storage" section
3. Click "Create bucket"
4. Name your bucket `wisha-bucket` (as configured in the code)
5. Set the Security Level:
   - For public files: Choose "Public"
   - For private files: Choose "Private"
6. Configure CORS if needed for your domain

## Storage Service

The storage service (`src/services/storage.ts`) provides methods for file operations:

```typescript
// Import the storage service
import { storageService } from '@/services/storage';

// Upload a file
const result = await storageService.uploadFile(file, 'avatars');

// Get public URL for a file
const url = storageService.getPublicUrl('avatars/file123.jpg');

// Delete a file
const success = await storageService.deleteFile('avatars/file123.jpg');

// Create a signed URL (for private buckets)
const signedUrl = await storageService.createSignedUrl('private/file123.jpg', 60);

// List files in a folder
const files = await storageService.listFiles('avatars');
```

## File Upload Components

### Simple File Upload

The `FileUpload` component provides a simple button-based file upload interface:

```jsx
import { FileUpload } from '@/components/FileUpload';
import { FileUploadResult } from '@/services/storage';

// In your component
const handleUploadComplete = (result: FileUploadResult) => {
  console.log('File uploaded:', result);
  // Store the file path or URL in your form or database
};

// In your render function
<FileUpload 
  onUploadComplete={handleUploadComplete}
  folder="avatars"
  accept="image/*"
  maxSizeMB={2}
  buttonText="Upload Avatar"
/>
```

### Drag & Drop Upload

The `DropzoneUpload` component provides a drag-and-drop interface for single or multiple files:

```jsx
import { DropzoneUpload } from '@/components/DropzoneUpload';
import { FileUploadResult } from '@/services/storage';

// In your component
const handleUploadComplete = (results: FileUploadResult[]) => {
  console.log('Files uploaded:', results);
  // Store the file paths or URLs in your form or database
};

// In your render function
<DropzoneUpload
  onUploadComplete={handleUploadComplete}
  folder="event-images"
  accept={{
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'application/pdf': ['.pdf'],
  }}
  multiple={true}
  maxFiles={5}
  maxSizeMB={10}
/>
```

## Display Components

### Displaying Images

The `StorageImage` component displays images from Supabase Storage:

```jsx
import { StorageImage } from '@/components/StorageImage';

// In your render function
<StorageImage 
  path="avatars/user123.jpg"
  className="w-32 h-32 rounded-full object-cover"
  alt="User Avatar"
  fallbackText="No avatar available"
/>
```

### Displaying Files

The `StorageFile` component creates a link to files from Supabase Storage:

```jsx
import { StorageFile } from '@/components/StorageImage';

// In your render function
<StorageFile 
  path="documents/report.pdf"
  label="Annual Report"
  className="my-2"
/>
```

## Integration Examples

### User Avatar Upload

```jsx
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { StorageImage } from '@/components/StorageImage';
import { FileUploadResult } from '@/services/storage';

const ProfileForm = () => {
  const [avatarPath, setAvatarPath] = useState(user?.avatar || '');

  const handleAvatarUpload = (result: FileUploadResult) => {
    setAvatarPath(result.path);
    // You would typically update this in your form state
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <StorageImage 
          path={avatarPath} 
          className="w-32 h-32 rounded-full object-cover mb-4" 
          alt="User Avatar" 
        />
        
        <FileUpload 
          onUploadComplete={handleAvatarUpload}
          folder="avatars"
          accept="image/*"
          buttonText="Change Avatar"
        />
      </div>
      
      {/* Rest of your form */}
    </div>
  );
};
```

### Event Image Gallery

```jsx
import { useState } from 'react';
import { DropzoneUpload } from '@/components/DropzoneUpload';
import { StorageImage } from '@/components/StorageImage';
import { FileUploadResult } from '@/services/storage';

const EventGallery = ({ eventId }) => {
  const [images, setImages] = useState<FileUploadResult[]>([]);

  const handleImagesUpload = (results: FileUploadResult[]) => {
    setImages(prev => [...prev, ...results]);
    // You would typically save these paths to your database
  };

  return (
    <div className="space-y-6">
      <DropzoneUpload 
        onUploadComplete={handleImagesUpload}
        folder={`events/${eventId}/gallery`}
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
        multiple={true}
        maxFiles={10}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <StorageImage 
            key={index}
            path={image.path}
            className="w-full aspect-square object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
```

## Testing

You can test the storage implementation by visiting the `/test-storage` route in the application. This page provides a UI for testing both simple and drag-and-drop file uploads, as well as displaying and deleting the uploaded files.

## Security Considerations

- **File Types**: Always validate file types both on the client and server side
- **File Size**: Limit file sizes to prevent abuse
- **RLS Policies**: Configure Row Level Security policies in Supabase for your buckets
- **Private Content**: Use signed URLs for content that should not be publicly accessible

## Troubleshooting

### Common Issues

1. **Upload fails with 403 error**: Check your bucket permissions and RLS policies
2. **Files not displaying**: Verify the bucket is public or you're using signed URLs
3. **Large file uploads fail**: Check your file size limits in Supabase

### Best Practices

1. Use consistent folder structures (e.g., `avatars/`, `events/{eventId}/`, etc.)
2. Generate unique file names to prevent conflicts
3. Store file paths in your database for later retrieval
4. Implement cleanup logic to delete unused files 