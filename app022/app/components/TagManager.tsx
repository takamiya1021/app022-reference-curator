import { useState } from "react";

type TagManagerProps = {
  tags: string[];
  suggestions: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

export default function TagManager({
  tags,
  suggestions,
  onAddTag,
  onRemoveTag,
}: TagManagerProps) {
  const [value, setValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddTag(trimmed);
    setValue("");
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-zinc-800">Tags</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="rounded-full border border-transparent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-rose-600 transition hover:border-rose-100 hover:bg-rose-50"
            >
              Remove {tag}
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-xs text-zinc-400">No tags yet</span>
        )}
      </div>
      <div className="mt-4">
        <input
          list="tag-suggestions"
          placeholder="Add tag"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        <datalist id="tag-suggestions">
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </div>
    </section>
  );
}
