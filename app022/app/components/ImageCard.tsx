import type { ImageData } from "@/types";

type ImageCardProps = {
  image: ImageData;
  onDelete: (id: string) => void;
  onSelect?: (image: ImageData) => void;
};

export default function ImageCard({
  image,
  onDelete,
  onSelect,
}: ImageCardProps) {
  const handleDelete = () => onDelete(image.id);

  const handleSelect = () => {
    onSelect?.(image);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={handleSelect}
        className="relative aspect-square w-full overflow-hidden bg-zinc-100"
      >
        <img
          src={image.thumbnail}
          alt={image.fileName}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </button>
      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {image.fileName}
          </p>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600 transition hover:border-rose-100 hover:bg-rose-50"
          >
            Delete image
          </button>
        </div>
        {image.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {image.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-400">No tags yet</p>
        )}
      </div>
    </article>
  );
}
