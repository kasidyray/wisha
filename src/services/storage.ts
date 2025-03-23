import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'wisha-bucket';

export type FileUploadResult = {
  path: string;
  url: string;
  fileName: string;
  contentType: string;
  size: number;
};

// Check if the bucket exists and create it if it doesn't
export const checkAndInitBucket = async (): Promise<boolean> => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      // Try to set up RLS policies for buckets first
      try {
        await supabase.rpc('setup_storage_policies', { bucket_name: BUCKET_NAME });
      } catch (policyError) {
        console.error('Error setting up policies:', policyError);
        // Continue anyway, the RLS policies might already exist
      }
      
      // Continue anyway after attempting to set up policies
      console.log('Continuing to check bucket existence despite error...');
    }
    
    // Check if our bucket is in the list
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME) || false;
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      try {
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          
          // If we get an error, check if the bucket now exists anyway
          const { data: bucketsAfterCreate } = await supabase.storage.listBuckets();
          const bucketExistsAfterCreate = bucketsAfterCreate?.some(bucket => bucket.name === BUCKET_NAME) || false;
          
          if (!bucketExistsAfterCreate) {
            console.log('Bucket still does not exist after creation attempt');
            return false;
          } else {
            console.log('Bucket exists despite creation error');
          }
        } else {
          console.log(`Bucket ${BUCKET_NAME} created successfully`);
        }
      } catch (error) {
        console.error('Unexpected error creating bucket:', error);
        return false;
      }
    } else {
      console.log(`Bucket ${BUCKET_NAME} already exists`);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing bucket:', error);
    return false;
  }
};

export const storageService = {
  /**
   * Upload file to Supabase Storage
   * @param file - File to upload
   * @param folder - Folder to store the file in (e.g., 'avatars', 'events', 'messages')
   * @returns Promise with the file upload result
   */
  async uploadFile(
    file: File,
    folder: string = 'uploads'
  ): Promise<FileUploadResult | null> {
    try {
      // Ensure the bucket exists
      const bucketReady = await checkAndInitBucket();
      if (!bucketReady) {
        throw new Error('Storage bucket is not available');
      }
      
      // Generate a unique file name to prevent conflicts
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }

      // Get the public URL for the file
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        url: urlData.publicUrl,
        fileName: file.name,
        contentType: file.type,
        size: file.size,
      };
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  },

  /**
   * Upload file from a base64 string
   * @param base64Data - Base64 string data (without the prefix)
   * @param fileName - Name of the file
   * @param contentType - MIME type of the file
   * @param folder - Folder to store the file in
   * @returns Promise with the file upload result
   */
  async uploadFromBase64(
    base64Data: string,
    fileName: string,
    contentType: string,
    folder: string = 'uploads'
  ): Promise<FileUploadResult | null> {
    try {
      // Convert base64 to blob
      const base64Response = await fetch(`data:${contentType};base64,${base64Data}`);
      const blob = await base64Response.blob();

      // Create a File object from the blob
      const file = new File([blob], fileName, { type: contentType });

      // Use the regular upload method
      return this.uploadFile(file, folder);
    } catch (error) {
      console.error('Error in uploadFromBase64:', error);
      throw error;
    }
  },

  /**
   * Get public URL for a file
   * @param path - Path of the file in the bucket
   * @returns Public URL of the file
   */
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  /**
   * Delete a file from storage
   * @param path - Path of the file to delete
   * @returns Promise<boolean> indicating success or failure
   */
  async deleteFile(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  },

  /**
   * Create a signed URL for temporary access to a file
   * @param path - Path of the file
   * @param expiresIn - Seconds until the URL expires (default: 60)
   * @returns Promise with the signed URL
   */
  async createSignedUrl(
    path: string,
    expiresIn: number = 60
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error in createSignedUrl:', error);
      return null;
    }
  },

  /**
   * List all files in a folder
   * @param folder - Folder to list files from
   * @returns Promise with an array of file objects
   */
  async listFiles(folder: string = ''): Promise<any[] | null> {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(folder);

      if (error) {
        console.error('Error listing files:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in listFiles:', error);
      return null;
    }
  }
}; 