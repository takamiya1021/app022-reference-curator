import { useRef } from "react";

type ImageUploaderProps = {
  onFilesAdded: (files: File[]) => void;
};

export default function ImageUploader({ onFilesAdded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    onFilesAdded(fileList);
    event.target.value = "";
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <section className="rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center text-zinc-700">
      <h2 className="text-xl font-semibold text-zinc-900">
        Collect visuals in seconds
      </h2>
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
        >
          Browse files
        </button>
        <label
          htmlFor="image-uploader-input"
          className="cursor-pointer text-sm font-medium text-zinc-600 underline"
        >
          Add images
        </label>
      </div>
    </section>
  );
}
