"use client";

import { useEffect, useMemo, useState } from "react";
import ImageUploader from "@/app/components/ImageUploader";
import ImageGrid from "@/app/components/ImageGrid";
import ImageDetailModal from "@/app/components/ImageDetailModal";
import ImageCard from "@/app/components/ImageCard";
import TagFilter from "@/app/components/TagFilter";
import TagManager from "@/app/components/TagManager";
import Header from "@/app/components/Header";
import Slideshow from "@/app/components/Slideshow";
import ApiKeySettings from "@/app/components/ApiKeySettings";
import { useImageStore } from "@/store/useImageStore";
import type { ImageData } from "@/types";

export default function Home() {
  const selectFilteredImages = useImageStore((state) => state.filteredImages);
  const images = selectFilteredImages();
  const allImages = useImageStore((state) => state.images);
  const tags = useImageStore((state) => state.tags);
  const selectedTags = useImageStore((state) => state.selectedTags);
  const setSelectedTags = useImageStore((state) => state.setSelectedTags);
  const addTag = useImageStore((state) => state.addTag);
  const removeTag = useImageStore((state) => state.removeTag);
  const updateImage = useImageStore((state) => state.updateImage);
  const removeImage = useImageStore((state) => state.removeImage);
  const rebuildTags = useImageStore((state) => state.rebuildTags);

  const [detailImageId, setDetailImageId] = useState<string | null>(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const lastError = useImageStore((state) => state.lastError);
  const setLastError = useImageStore((state) => state.setLastError);

  // アプリ起動時にタグカウントを再計算（不整合を修正）
  useEffect(() => {
    rebuildTags();
  }, []);

  // ストアから常に最新の画像データを取得（タグ追加時に自動反映）
  const detailImage = useMemo(
    () => allImages.find((img) => img.id === detailImageId) ?? null,
    [allImages, detailImageId],
  );

  const filterOptions = useMemo(
    () => tags.map((tag) => ({ name: tag.name, count: tag.count })),
    [tags],
  );

  const handleAcceptTag = async (imageId: string, tag: string) => {
    await addTag(imageId, tag);
  };

  const handleMemoSave = async (imageId: string, memo: string) => {
    await updateImage(imageId, { memo });
  };

  const openSlideshow = () => {
    if (images.length === 0) return;
    setIsSlideshowOpen(true);
  };

  const closeSlideshow = () => setIsSlideshowOpen(false);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50">
      {lastError && (
        <div className="mx-6 mt-4 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" data-testid="global-error">
          <span>{lastError}</span>
          <button
            type="button"
            className="rounded-full border border-rose-200/60 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100"
            onClick={() => setLastError(null)}
          >
            閉じる
          </button>
        </div>
      )}
      <Header onStartSlideshow={openSlideshow} />

      <section className="grid gap-6 px-6 py-10 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <ImageUploader />
          <TagFilter tags={filterOptions} selected={selectedTags} onChange={setSelectedTags} />
          <ApiKeySettings />
        </div>

        <div className="space-y-6">
          <ImageGrid
            images={images}
            onDeleteImage={removeImage}
            onSelectImage={(image) => setDetailImageId(image.id)}
          />
        </div>
      </section>

      {detailImage ? (
        <ImageDetailModal
          image={detailImage}
          isOpen
          onClose={() => setDetailImageId(null)}
          onUpdateMemo={handleMemoSave}
          onAcceptTags={handleAcceptTag}
          onRemoveTag={removeTag}
          aiSuggestions={[]}
        />
      ) : null}

      <Slideshow images={images} isOpen={isSlideshowOpen} onClose={closeSlideshow} interval={5} />
    </main>
  );
}
