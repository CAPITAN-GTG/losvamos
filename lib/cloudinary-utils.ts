// Cloudinary upload utilities

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload image to Cloudinary
 * @param file - File object or base64 string
 * @param folder - Optional folder path in Cloudinary
 * @returns Promise with Cloudinary upload result
 */
export async function uploadToCloudinary(
  file: File | string, 
  folder: string = 'losvamos'
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  
  if (typeof file === 'string') {
    // Handle base64 string
    formData.append('file', file);
  } else {
    // Handle File object
    formData.append('file', file);
  }
  
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
  formData.append('folder', folder);
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of File objects or base64 strings
 * @param folder - Optional folder path in Cloudinary
 * @returns Promise with array of Cloudinary upload results
 */
export async function uploadMultipleToCloudinary(
  files: (File | string)[],
  folder: string = 'losvamos'
): Promise<CloudinaryUploadResult[]> {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple Cloudinary upload error:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
}

/**
 * Convert base64 data URL to File object
 * @param dataUrl - Base64 data URL
 * @param filename - Filename for the File object
 * @returns File object
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Validate image file
 * @param file - File object
 * @param maxSizeInMB - Maximum file size in MB
 * @returns boolean indicating if file is valid
 */
export function validateImageFile(file: File, maxSizeInMB: number = 10): boolean {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return false;
  }
  
  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return false;
  }
  
  return true;
}
