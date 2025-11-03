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

const sortTagsByName = (tags: Tag[]): Tag[] =>
  [...tags].sort((a, b) => a.name.localeCompare(b.name));

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      images: [],
      tags: [],
      selectedTags: [],
      searchQuery: "",
      addImage: async (image) => {
        set((state) => {
          const nextTags = image.tags.reduce<Tag[]>((acc, tagName) => {
            const existingIndex = acc.findIndex((candidate) => candidate.name === tagName);
            if (existingIndex !== -1) {
              const existing = acc[existingIndex];
              const updated = { ...existing, count: existing.count + 1 };
              return acc.map((tag, idx) => (idx === existingIndex ? updated : tag));
            }
            return [...acc, createTag(tagName)];
          }, [...state.tags]);

          return {
            images: [...state.images, image],
            tags: sortTagsByName(nextTags),
          };
        });
      },
      removeImage: async (id) => {
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
