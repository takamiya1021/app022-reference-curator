type HeaderProps = {
  onStartSlideshow: () => void;
};

export default function Header({
  onStartSlideshow,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
          ビジュアルリファレンス管理
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          リファレンスキュレーター
        </h1>
      </div>
      <button
        type="button"
        onClick={onStartSlideshow}
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 active:scale-95 active:bg-zinc-950"
      >
        🎬 スライドショー開始
      </button>
    </header>
  );
}
