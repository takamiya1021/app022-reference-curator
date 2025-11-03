import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImageData, Tag } from "@/types/index";

type ImageStoreState = {
  images: ImageData[];
  tags: Tag[];
  selectedTags: string[];
  searchQuery: string;
};

type ImageStoreActions = {
  addImage: (image: ImageData) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
  updateImage: (id: string, updates: Partial<ImageData>) => Promise<void>;
  addTag: (imageId: string, tag: string) => Promise<void>;
  removeTag: (imageId: string, tag: string) => Promise<void>;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  filteredImages: () => ImageData[];
};

export type ImageStore = ImageStoreState & ImageStoreActions;

const createTag = (name: string): Tag => ({
  id: name,
  name,
  color: "zinc",
  count: 1,
  createdAt: new Date(),
});

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      images: [],
      tags: [],
      selectedTags: [],
      searchQuery: "",
      addImage: async (image) => {
        set((state) => ({
          images: [...state.images, image],
          tags: image.tags.reduce((acc, tagName) => {
            const existing = acc.find((candidate) => candidate.name === tagName);
            if (existing) {
              existing.count += 1;
              return acc;
            }
            return [...acc, createTag(tagName)];
          }, [...state.tags]),
        }));
      },
      removeImage: async (id) => {
        set((state) => {
          const image = state.images.find((item) => item.id === id);
          const remainingImages = state.images.filter((item) => item.id !== id);
          let nextTags = state.tags;
          if (image) {
            nextTags = image.tags.reduce((acc, tagName) => {
              const tag = acc.find((item) => item.name === tagName);
              if (!tag) return acc;
              const updated = acc.map((item) =>
                item.name === tagName
                  ? { ...item, count: Math.max(0, item.count - 1) }
                  : item,
              );
              return updated.filter((item) => item.count > 0);
            }, [...state.tags]);
          }
          return {
            images: remainingImages,
            tags: nextTags,
          };
        });
      },
      updateImage: async (id, updates) => {
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
              return state.tags.map((tag) =>
                tag.name === tagName ? { ...tag, count: tag.count + 1 } : tag,
              );
            }
            return [...state.tags, createTag(tagName)];
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

          const tags = state.tags
            .map((tag) =>
              tag.name === tagName ? { ...tag, count: Math.max(0, tag.count - 1) } : tag,
            )
            .filter((tag) => tag.count > 0);

          return { images, tags };
        });
      },
      setSelectedTags: (tags) => set({ selectedTags: [...tags] }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      filteredImages: () => {
        const { images, selectedTags, searchQuery } = get();
        return images.filter((image) => {
          const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.every((tag) => image.tags.includes(tag));
          const matchesQuery =
            searchQuery.trim().length === 0 ||
            image.fileName.toLowerCase().includes(searchQuery.toLowerCase());
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
