import { initDB } from "./db";
import type { ImageData } from "@/types";

export const saveImage = async (image: ImageData): Promise<void> => {
  const db = await initDB();
  await db.images.put(image);
};

export const listImages = async (): Promise<ImageData[]> => {
  const db = await initDB();
  return db.images.orderBy("createdAt").reverse().toArray();
};

export const deleteImage = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.images.delete(id);
};
