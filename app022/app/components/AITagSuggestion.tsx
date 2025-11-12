"use client";

import type { FC } from "react";

type AITagSuggestionProps = {
  tags: string[];
  onAcceptTag: (tag: string) => void;
};

const AITagSuggestion: FC<AITagSuggestionProps> = ({ tags, onAcceptTag }) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="text-sm font-semibold text-zinc-700">AIタグ候補</h3>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag} className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
            <span aria-label={`AI提案タグ ${tag}`} className="text-xs font-medium text-zinc-600">
              {tag}
            </span>
            <button
              type="button"
              onClick={() => onAcceptTag(tag)}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-zinc-800 active:scale-95 active:bg-zinc-950"
            >
              "{tag}" を追加
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AITagSuggestion;
