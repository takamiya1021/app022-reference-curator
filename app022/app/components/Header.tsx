type HeaderProps = {
  onOpenUploader: () => void;
  onStartSlideshow: () => void;
  onOpenSettings: () => void;
};

export default function Header({
  onOpenUploader,
  onStartSlideshow,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
          Visual reference curator
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          Reference Curator
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onOpenUploader}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
        >
          Add images
        </button>
        <button
          type="button"
          onClick={onStartSlideshow}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800"
        >
          Start slideshow
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-800"
        >
          Settings
        </button>
      </div>
    </header>
  );
}
