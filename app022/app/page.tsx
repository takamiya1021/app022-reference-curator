"use client";

import { useMemo, useState } from "react";
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
  const tags = useImageStore((state) => state.tags);
  const selectedTags = useImageStore((state) => state.selectedTags);
  const setSelectedTags = useImageStore((state) => state.setSelectedTags);
  const addTag = useImageStore((state) => state.addTag);
  const removeTag = useImageStore((state) => state.removeTag);
  const updateImage = useImageStore((state) => state.updateImage);
  const removeImage = useImageStore((state) => state.removeImage);

  const [detailImage, setDetailImage] = useState<ImageData | null>(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);

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
      <Header
        onOpenUploader={() => document.getElementById("image-uploader-input")?.click()}
        onStartSlideshow={openSlideshow}
        onOpenSettings={() => {
          const element = document.getElementById("settings-section");
          element?.scrollIntoView({ behavior: "smooth" });
        }}
      />

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
            onSelectImage={(image) => setDetailImage(image)}
          />
        </div>
      </section>

      {detailImage ? (
        <ImageDetailModal
          image={detailImage}
          isOpen
          onClose={() => setDetailImage(null)}
          onUpdateMemo={handleMemoSave}
          onAcceptTags={handleAcceptTag}
          aiSuggestions={[]}
        />
      ) : null}

      <Slideshow images={images} isOpen={isSlideshowOpen} onClose={closeSlideshow} interval={5} />
    </main>
  );
}
