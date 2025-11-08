import ImageCard from "./ImageCard";
import type { ImageData } from "@/types";

type ImageGridProps = {
  images: ImageData[];
  onDeleteImage: (id: string) => void;
  onSelectImage?: (image: ImageData) => void;
};

export default function ImageGrid({
  images,
  onDeleteImage,
  onSelectImage,
}: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/60 px-6 py-12 text-center text-zinc-500">
        Drop images to start curating your moodboard.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="image-grid">
      {images.map((image) => (
        <ImageCard
          data-testid="image-card"
          key={image.id}
          image={image}
          onDelete={onDeleteImage}
          onSelect={onSelectImage}
        />
      ))}
    </div>
  );
}
