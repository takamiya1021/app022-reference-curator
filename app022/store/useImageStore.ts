import { create } from "zustand";
import { persist } from "zustand/middleware";
import { saveImage, saveImages } from "@/lib/imageRepository";
import type { ImageData, Tag } from "@/types/index";

type ImageStoreState = {
  images: ImageData[];
  tags: Tag[];
  selectedTags: string[];
  searchQuery: string;
  lastError: string | null;
};

type ImageStoreActions = {
  addImage: (image: ImageData) => Promise<void>;
  addImages: (images: ImageData[]) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
  updateImage: (id: string, updates: Partial<ImageData>) => Promise<void>;
  addTag: (imageId: string, tag: string) => Promise<void>;
  removeTag: (imageId: string, tag: string) => Promise<void>;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  filteredImages: () => ImageData[];
  setLastError: (message: string | null) => void;
};

export type ImageStore = ImageStoreState & ImageStoreActions;

const createTag = (name: string): Tag => ({
  id: name,
  name,
  color: "zinc",
  count: 1,
  createdAt: new Date(),
});

const sortTagsByName = (tags: Tag[]): Tag[] =>
  [...tags].sort((a, b) => a.name.localeCompare(b.name));

const appendImages = (
  state: ImageStoreState,
  images: ImageData[],
): Pick<ImageStoreState, "images" | "tags"> => {
  if (images.length === 0) {
    return { images: state.images, tags: state.tags };
  }

  const nextImages = [...state.images, ...images];
  const tagMap = new Map<string, Tag>();
  state.tags.forEach((tag) => tagMap.set(tag.name, { ...tag }));

  images.forEach((image) => {
    image.tags.forEach((tagName) => {
      const existing = tagMap.get(tagName);
      if (existing) {
        tagMap.set(tagName, { ...existing, count: existing.count + 1 });
      } else {
        tagMap.set(tagName, createTag(tagName));
      }
    });
  });

  const nextTags = sortTagsByName(Array.from(tagMap.values()));
  return { images: nextImages, tags: nextTags };
};

const formatDexieError = (error: unknown): string => {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  if (/quota|storage|disk/i.test(raw)) {
    return "ストレージ容量が不足しています。不要な画像を削除してください";
  }
  return raw || "データ保存中にエラーが発生しました";
};

const handleStoreError = (error: unknown, set: (partial: Partial<ImageStoreState>) => void): never => {
  const friendly = formatDexieError(error);
  set({ lastError: friendly });
  throw new Error(friendly);
};

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      images: [],
      tags: [],
      selectedTags: [],
      searchQuery: "",
      lastError: null,
      setLastError: (message) => set({ lastError: message }),
      addImage: async (image) => {
        try {
          await saveImage(image);
          set((state) => appendImages(state, [image]));
        } catch (error) {
          handleStoreError(error, (partial) => set(partial));
        }
      },
      addImages: async (images) => {
        if (images.length === 0) return;
        try {
          await saveImages(images);
          set((state) => appendImages(state, images));
        } catch (error) {
          handleStoreError(error, (partial) => set(partial));
        }
      },
      removeImage: async (id) => {
        try {
          set((state) => {
            const image = state.images.find((item) => item.id === id);
            const remainingImages = state.images.filter((item) => item.id !== id);
            const nextTags = image
              ? sortTagsByName(
                  image.tags.reduce<Tag[]>((acc, tagName) => {
                    const tag = acc.find((item) => item.name === tagName);
                    if (!tag) return acc;
                    const updated = acc
                      .map((candidate) =>
                        candidate.name === tagName
                          ? { ...candidate, count: Math.max(0, candidate.count - 1) }
                          : candidate,
                      )
                      .filter((candidate) => candidate.count > 0);
                    return updated;
                  }, [...state.tags]),
                )
              : sortTagsByName(state.tags);
            return {
              images: remainingImages,
              tags: nextTags,
            };
          });
        } catch (error) {
          handleStoreError(error, (partial) => set(partial));
        }
      },
      updateImage: async (id, updates) => {
        try {
          set((state) => ({
            images: state.images.map((image) =>
              image.id === id
                ? {
                    ...image,
                    ...updates,
                    updatedAt: updates.updatedAt ?? new Date(),
                  }
                : image,
            ),
          }));
        } catch (error) {
          handleStoreError(error, (partial) => set(partial));
        }
      },
      addTag: async (imageId, tagName) => {
        set((state) => {
          const images = state.images.map((image) => {
            if (image.id !== imageId) return image;
            if (image.tags.includes(tagName)) return image;
            return {
              ...image,
              tags: [...image.tags, tagName],
              updatedAt: new Date(),
            };
          });

          const tags = (() => {
            const existing = state.tags.find((tag) => tag.name === tagName);
            if (existing) {
              return sortTagsByName(
                state.tags.map((tag) =>
                  tag.name === tagName ? { ...tag, count: tag.count + 1 } : tag,
                ),
              );
            }
            return sortTagsByName([...state.tags, createTag(tagName)]);
          })();

          return { images, tags };
        });
      },
      removeTag: async (imageId, tagName) => {
        set((state) => {
          const images = state.images.map((image) => {
            if (image.id !== imageId) return image;
            if (!image.tags.includes(tagName)) return image;
            return {
              ...image,
              tags: image.tags.filter((tag) => tag !== tagName),
              updatedAt: new Date(),
            };
          });

          const tags = sortTagsByName(
            state.tags
              .map((tag) =>
                tag.name === tagName ? { ...tag, count: Math.max(0, tag.count - 1) } : tag,
              )
              .filter((tag) => tag.count > 0),
          );

          return { images, tags };
        });
      },
      setSelectedTags: (tags) => set({ selectedTags: [...tags] }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      filteredImages: () => {
        const { images, selectedTags, searchQuery } = get();
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return images.filter((image) => {
          const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.every((tag) => image.tags.includes(tag));
          const matchesQuery =
            normalizedQuery.length === 0 ||
            image.fileName.toLowerCase().includes(normalizedQuery) ||
            image.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
            (image.memo && image.memo.toLowerCase().includes(normalizedQuery)) ||
            (image.aiDescription &&
              image.aiDescription.toLowerCase().includes(normalizedQuery));
          return matchesTags && matchesQuery;
        });
      },
    }),
    {
      name: "reference-curator-store",
      partialize: (state) => ({
        images: state.images,
        tags: state.tags,
        selectedTags: state.selectedTags,
        searchQuery: state.searchQuery,
      }),
    },
  ),
);
