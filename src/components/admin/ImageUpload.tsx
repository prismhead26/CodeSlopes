'use client';

import { useState, useRef, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Validates that a URL is safe for use in an img src attribute
 * Only allows blob: URLs (from createObjectURL) and https: URLs (from Firebase Storage)
 */
function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    // Only allow blob: (local previews) and https: (Firebase Storage)
    return parsed.protocol === 'blob:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  folder?: string;
}

export default function ImageUpload({ onUploadComplete, currentImage, folder = 'images' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial preview from currentImage (https URL from Firebase)
  useEffect(() => {
    if (currentImage && isValidImageUrl(currentImage)) {
      setPreviewUrl(currentImage);
    }
  }, [currentImage]);

  // Cleanup blob URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Revoke previous blob URL if exists
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    // Create secure blob URL for preview (inherently safe, no XSS risk)
    const newBlobUrl = URL.createObjectURL(file);
    setBlobUrl(newBlobUrl);
    setPreviewUrl(newBlobUrl);

    // Upload to Firebase Storage
    setUploading(true);
    setUploadProgress(0);

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error('Failed to upload image');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          setUploadProgress(0);
          onUploadComplete(downloadURL);
          toast.success('Image uploaded successfully');
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    // Revoke blob URL to free memory
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl('');
    }
    setPreviewUrl('');
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <PhotoIcon className="h-5 w-5" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </label>

        {previewUrl && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors inline-flex items-center gap-2"
          >
            <XMarkIcon className="h-5 w-5" />
            Remove
          </button>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Image Preview - Uses blob: URLs (from createObjectURL) or https: URLs (from Firebase) */}
      {previewUrl && isValidImageUrl(previewUrl) && (
        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg object-contain"
          />
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
      </p>
    </div>
  );
}
