import Dexie from "dexie";
import { initDB } from "../../lib/db";
import {
  saveImage,
  saveImages,
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

  it("stores multiple images in a single batch", async () => {
    const images = [
      createImage({ id: "a", fileName: "a.png" }),
      createImage({ id: "b", fileName: "b.png" }),
      createImage({ id: "c", fileName: "c.png" }),
    ];

    await saveImages(images);
    const stored = await listImages();
    expect(stored.map((item) => item.fileName).sort()).toEqual([
      "a.png",
      "b.png",
      "c.png",
    ]);
  });
});
