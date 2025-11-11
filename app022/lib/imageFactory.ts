import { generateThumbnail } from "@/lib/imageUtils";
import type { ImageData } from "@/types";

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for HTTP environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const buildImageData = async (file: File): Promise<ImageData> => {
  const thumbnail = await generateThumbnail(file);
  const now = new Date();
  return {
    id: generateUUID(),
    file,
    thumbnail,
    fileName: file.name || "untitled",
    mimeType: file.type || "image/*",
    tags: ["untagged"],
    createdAt: now,
    updatedAt: now,
  };
};

export const createImagesFromFiles = async (files: File[]): Promise<ImageData[]> => {
  if (files.length === 0) return [];
  return Promise.all(files.map(buildImageData));
};
