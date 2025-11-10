import { act } from "@testing-library/react";
import { useImageStore } from "../../store/useImageStore";
import type { ImageData } from "../../types";
import { saveImages } from "../../lib/imageRepository";

jest.mock("@/lib/imageRepository", () => ({
  saveImage: jest.fn().mockResolvedValue(undefined),
  saveImages: jest.fn().mockResolvedValue(undefined),
}));

const createImage = (overrides: Partial<ImageData> = {}): ImageData => ({
  id: crypto.randomUUID(),
  file: new Blob(),
  thumbnail: "data:image/png;base64,AAA",
  fileName: "sample.png",
  mimeType: "image/png",
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const resetStore = () => {
  useImageStore.setState({
    images: [],
    tags: [],
    selectedTags: [],
    searchQuery: "",
  });
};

describe("useImageStore", () => {
  beforeEach(async () => {
    resetStore();
    await useImageStore.persist?.clearStorage?.();
  });

  it("should add images into state", async () => {
    const mockImage = createImage({ id: "test-image" });

    await act(async () => {
      await useImageStore.getState().addImage(mockImage);
    });

    expect(useImageStore.getState().images[0]?.id).toBe("test-image");
  });

  it("maintains sorted tag list and counts", async () => {
    const image = createImage({ id: "img-1", fileName: "one.png", tags: ["sunset"] });

    await act(async () => {
      await useImageStore.getState().addImage(image);
      await useImageStore.getState().addTag("img-1", "blue");
      await useImageStore.getState().addTag("img-1", "abstract");
    });

    const state = useImageStore.getState();
    expect(state.tags.map((tag) => `${tag.name}:${tag.count}`)).toEqual([
      "abstract:1",
      "blue:1",
      "sunset:1",
    ]);
  });

  it("filters images by AND tags and tag-aware search", async () => {
    const imageA = createImage({
      id: "a",
      fileName: "concept-a.png",
      tags: ["sunset", "ocean"],
    });
    const imageB = createImage({
      id: "b",
      fileName: "concept-b.png",
      tags: ["forest", "ocean"],
    });

    await act(async () => {
      await useImageStore.getState().addImage(imageA);
      await useImageStore.getState().addImage(imageB);
    });

    act(() => {
      useImageStore.getState().setSelectedTags(["sunset", "ocean"]);
      useImageStore.getState().setSearchQuery("sunset");
    });

    let filtered = useImageStore.getState().filteredImages();
    expect(filtered.map((image) => image.id)).toEqual(["a"]);

    act(() => {
      useImageStore.getState().setSelectedTags([]);
      useImageStore.getState().setSearchQuery("forest");
    });

    filtered = useImageStore.getState().filteredImages();
    expect(filtered.map((image) => image.id)).toEqual(["b"]);
  });

  it("adds multiple images in a batch", async () => {
    const images = [
      createImage({ id: "a", fileName: "a.png", tags: ["sunset"] }),
      createImage({ id: "b", fileName: "b.png", tags: ["ocean"] }),
    ];

    await act(async () => {
      await useImageStore.getState().addImages(images);
    });

    const state = useImageStore.getState();
    expect(state.images).toHaveLength(2);
    expect(state.tags.map((tag) => tag.name).sort()).toEqual(["ocean", "sunset"]);
  });

  it("records lastError when addImages fails", async () => {
    (saveImages as jest.Mock).mockRejectedValueOnce(new Error("QuotaExceeded"));
    const image = createImage({ id: "fail" });

    await expect(
      useImageStore.getState().addImages([image]),
    ).rejects.toThrow(/ストレージ容量/);

    expect(useImageStore.getState().lastError).toMatch(/ストレージ容量/);
  });
});
