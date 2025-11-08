import { generateThumbnail } from "@/lib/imageUtils";
import type { ImageData } from "@/types";

const buildImageData = async (file: File): Promise<ImageData> => {
  const thumbnail = await generateThumbnail(file);
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    file,
    thumbnail,
    fileName: file.name || "untitled",
    mimeType: file.type || "image/*",
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const createImagesFromFiles = async (files: File[]): Promise<ImageData[]> => {
  if (files.length === 0) return [];
  return Promise.all(files.map(buildImageData));
};
