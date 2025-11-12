import { create } from "zustand";
import { persist } from "zustand/middleware";
import { saveImage, saveImages, deleteImage } from "@/lib/imageRepository";
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
  rebuildTags: () => void;
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
          // IndexedDBから画像を削除
          await deleteImage(id);

          set((state) => {
            const image = state.images.find((item) => item.id === id);
            const remainingImages = state.images.filter((item) => item.id !== id);

            if (!image) {
              return { images: remainingImages, tags: state.tags };
            }

            // 削除する画像のタグのカウントを減らす
            const nextTags = state.tags
              .map((tag) => {
                if (image.tags.includes(tag.name)) {
                  return { ...tag, count: tag.count - 1 };
                }
                return tag;
              })
              .filter((tag) => tag.count > 0); // カウント0のタグを削除

            return {
              images: remainingImages,
              tags: sortTagsByName(nextTags),
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
          const targetImage = state.images.find((img) => img.id === imageId);
          const shouldRemoveUntagged =
            targetImage &&
            tagName !== "untagged" &&
            targetImage.tags.includes("untagged");

          const images = state.images.map((image) => {
            if (image.id !== imageId) return image;
            if (image.tags.includes(tagName)) return image;

            // 新しいタグを追加し、必要に応じてuntaggedを削除
            const newTags = shouldRemoveUntagged
              ? [...image.tags.filter(t => t !== "untagged"), tagName]
              : [...image.tags, tagName];

            return {
              ...image,
              tags: newTags,
              updatedAt: new Date(),
            };
          });

          const tags = (() => {
            let updatedTags = state.tags;

            // untaggedを削除する場合、カウントを-1
            if (shouldRemoveUntagged) {
              updatedTags = updatedTags
                .map((tag) =>
                  tag.name === "untagged" ? { ...tag, count: tag.count - 1 } : tag,
                )
                .filter((tag) => tag.count > 0);
            }

            // 新しいタグを追加またはカウント+1
            const existing = updatedTags.find((tag) => tag.name === tagName);
            if (existing) {
              updatedTags = updatedTags.map((tag) =>
                tag.name === tagName ? { ...tag, count: tag.count + 1 } : tag,
              );
            } else {
              updatedTags = [...updatedTags, createTag(tagName)];
            }

            return sortTagsByName(updatedTags);
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
      rebuildTags: () => {
        set((state) => {
          // 全画像から正確なタグカウントを再計算
          const tagMap = new Map<string, number>();

          state.images.forEach((image) => {
            image.tags.forEach((tagName) => {
              tagMap.set(tagName, (tagMap.get(tagName) ?? 0) + 1);
            });
          });

          // 既存タグの作成日時を保持しつつ、カウントを更新
          const newTags: Tag[] = [];
          tagMap.forEach((count, tagName) => {
            const existingTag = state.tags.find((t) => t.name === tagName);
            newTags.push({
              id: tagName,
              name: tagName,
              color: "zinc",
              count,
              createdAt: existingTag?.createdAt ?? new Date(),
            });
          });

          return { tags: sortTagsByName(newTags) };
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
