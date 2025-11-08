"use client";

import { ChangeEvent, useRef, useState, useTransition } from "react";
import { createImagesFromFiles } from "@/lib/imageFactory";
import { useImageStore } from "@/store/useImageStore";

type ImageUploaderProps = {
  onFilesAdded?: (files: File[]) => void;
};

export default function ImageUploader({ onFilesAdded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addImages = useImageStore((state) => state.addImages);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleImport = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setError("");
      const images = await createImagesFromFiles(files);
      await addImages(images);
      setStatus(`${images.length}枚の画像を追加しました`);
    } catch (err) {
      setError("画像の追加中にエラーが発生しました");
      console.error(err);
    }
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    onFilesAdded?.(fileList);

    startTransition(() => {
      handleImport(fileList);
    });

    event.target.value = "";
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <section className="rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center text-zinc-700">
      <h2 className="text-xl font-semibold text-zinc-900">Collect visuals in seconds</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Drag & drop inspiration or pick files to add them to your library.
      </p>
      <input
        ref={inputRef}
        id="image-uploader-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelection}
        className="hidden"
      />
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleButtonClick}
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800"
          disabled={isPending}
        >
          {isPending ? "Importing..." : "Browse files"}
        </button>
        <label
          htmlFor="image-uploader-input"
          className="cursor-pointer text-sm font-medium text-zinc-600 underline"
        >
          Add images
        </label>
      </div>
      {status && <p className="mt-4 text-sm text-emerald-600">{status}</p>}
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </section>
  );
}
