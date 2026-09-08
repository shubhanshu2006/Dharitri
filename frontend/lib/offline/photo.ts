/**
 * Photo Utilities
 * Image compression and processing for mobile field verification
 */

import { MOBILE_SETTINGS } from "@/lib/constants/field";

/**
 * Compress image file
 */
export async function compressImage(
  file: File,
  maxWidth: number = MOBILE_SETTINGS.PHOTO_MAX_WIDTH,
  maxHeight: number = MOBILE_SETTINGS.PHOTO_MAX_HEIGHT,
  quality: number = MOBILE_SETTINGS.PHOTO_QUALITY
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(
  blob: Blob,
  maxSize: number = 200
): Promise<Blob> {
  return compressImage(
    new File([blob], "thumbnail.jpg", { type: "image/jpeg" }),
    maxSize,
    maxSize,
    0.7
  );
}

/**
 * Convert Blob to Base64
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert Base64 to Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  blob: Blob
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image too large. Maximum size is 10MB",
    };
  }

  return { valid: true };
}

/**
 * Add GPS metadata to image (EXIF-like)
 */
export function addGPSMetadata(
  blob: Blob,
  latitude: number,
  longitude: number,
  accuracy?: number
): Blob & { metadata?: any } {
  const blobWithMetadata = blob as Blob & { metadata?: any };
  blobWithMetadata.metadata = {
    latitude,
    longitude,
    accuracy,
    timestamp: new Date().toISOString(),
  };
  return blobWithMetadata;
}
