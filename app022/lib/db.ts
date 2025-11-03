import Dexie, { Table } from "dexie";
import type { ImageData, Tag } from "@/types/index";

export class ImageDatabase extends Dexie {
  images!: Table<ImageData>;
  tags!: Table<Tag>;

  constructor() {
    super("ReferenceCurator");
    this.version(1).stores({
      images: "id, fileName, mimeType, createdAt, updatedAt, *tags",
      tags: "id, name, count",
    });
  }
}

let dbInstance: ImageDatabase | null = null;

export const initDB = async (): Promise<ImageDatabase> => {
  if (!dbInstance) {
    dbInstance = new ImageDatabase();
  }
  return dbInstance;
};
