import Dexie from "dexie";
import { initDB } from "../../lib/db";
import {
  saveImage,
  listImages,
  deleteImage,
} from "../../lib/imageRepository";
import type { ImageData } from "../../types";

const createImage = (overrides: Partial<ImageData> = {}): ImageData => ({
  id: crypto.randomUUID(),
  file: new Blob(["dummy"], { type: "image/png" }),
  thumbnail: "data:image/png;base64,AAA",
  fileName: "example.png",
  mimeType: "image/png",
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("imageRepository", () => {
  beforeEach(async () => {
    await Dexie.delete("ReferenceCurator");
    await initDB();
  });

  it("persists images and retrieves them", async () => {
    const image = createImage();
    await saveImage(image);

    const stored = await listImages();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.fileName).toBe(image.fileName);
    expect(stored[0]?.thumbnail).toBe(image.thumbnail);
  });

  it("deletes images by id", async () => {
    const image = createImage({ id: "delete-me" });
    await saveImage(image);

    await deleteImage("delete-me");
    const stored = await listImages();
    expect(stored).toHaveLength(0);
  });
});
