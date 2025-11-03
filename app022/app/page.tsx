export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-100 px-6 py-12 text-zinc-900">
      <span className="rounded-full bg-zinc-900 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-100">
        Visual reference curator
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Reference Curator
      </h1>
      <p className="max-w-xl text-center text-lg text-zinc-600 sm:text-xl">
        Collect inspirational images, tag them instantly, and play them back as a
        moodboard slideshow to stay in the creative flow.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-100 shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800"
        >
          Start collecting
        </button>
        <button
          type="button"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
        >
          View moodboard
        </button>
      </div>
    </main>
  );
}
