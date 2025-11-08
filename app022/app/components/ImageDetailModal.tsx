"use client";

import { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { ImageData } from "@/types";
import AITagSuggestion from "./AITagSuggestion";

type ImageDetailModalProps = {
  image: ImageData;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMemo: (imageId: string, memo: string) => void;
  onAcceptTags: (imageId: string, tag: string) => void;
  aiSuggestions: string[];
};

const ImageDetailModal: FC<ImageDetailModalProps> = ({
  image,
  isOpen,
  onClose,
  onUpdateMemo,
  onAcceptTags,
  aiSuggestions,
}) => {
  const [memoValue, setMemoValue] = useState(image.memo ?? "");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setMemoValue(image.memo ?? "");
    const dialog = dialogRef.current;
    dialog?.focus({ preventScroll: true });

    const handleKeydown = (event: KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isOpen, image.id, image.memo, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleMemoChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMemoValue(event.target.value);
  };

  const handleSaveMemo = () => {
    onUpdateMemo(image.id, memoValue.trim());
  };

  const handleAcceptTag = (tag: string) => {
    onAcceptTags(image.id, tag);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-detail-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      data-testid="image-detail-modal"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-6 border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div>
            <h2 id="image-detail-title" className="text-xl font-semibold text-zinc-900">
              {image.fileName}
            </h2>
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              {image.mimeType} ・ {image.tags.join(", ") || "tagなし"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900"
          >
            閉じる
          </button>
        </header>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <img
              src={image.thumbnail}
              alt={image.fileName}
              className="max-h-[60vh] w-full rounded-2xl object-contain bg-zinc-100"
            />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-700">タグ</h3>
              <ul className="flex flex-wrap gap-2">
                {image.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                    {tag}
                  </li>
                ))}
                {image.tags.length === 0 && (
                  <li className="text-xs text-zinc-400">タグはまだありません</li>
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="image-memo" className="text-sm font-semibold text-zinc-700">
                メモ
              </label>
              <textarea
                id="image-memo"
                value={memoValue}
                onChange={handleMemoChange}
                className="h-32 w-full resize-none rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
              <button
                type="button"
                onClick={handleSaveMemo}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                保存
              </button>
            </div>

            <AITagSuggestion tags={aiSuggestions} onAcceptTag={handleAcceptTag} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailModal;
