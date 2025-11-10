"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImageData } from "@/types";

type SlideshowProps = {
  images: ImageData[];
  isOpen: boolean;
  onClose: () => void;
  interval: number; // seconds
};

const PROGRESS_TICK_MS = 100;

export default function Slideshow({ images, isOpen, onClose, interval }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hasImages = images.length > 0;
  const currentImage = useMemo(() => images[currentIndex] ?? null, [images, currentIndex]);

  const closeSlideshow = useCallback(async () => {
    setProgress(0);
    setCurrentIndex(0);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      // ignore fullscreen exit errors
    }
    onClose();
  }, [onClose]);

  const goToNext = useCallback(() => {
    if (!hasImages) return;
    setCurrentIndex((index) => (index + 1) % images.length);
  }, [hasImages, images.length]);

  const goToPrevious = useCallback(() => {
    if (!hasImages) return;
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  }, [hasImages, images.length]);

  useEffect(() => {
    if (!isOpen || !hasImages) {
      setProgress(0);
      return undefined;
    }

    setProgress(0);
    const totalMs = Math.max(1, interval * 1000);
    let elapsed = 0;

    const timer = window.setInterval(() => {
      elapsed += PROGRESS_TICK_MS;
      const nextProgress = Math.min(1, elapsed / totalMs);
      setProgress(nextProgress);

      if (elapsed >= totalMs) {
        elapsed = 0;
        goToNext();
        setProgress(0);
      }
    }, PROGRESS_TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [isOpen, hasImages, interval, goToNext, currentIndex]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeSlideshow();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goToNext, goToPrevious, closeSlideshow]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return undefined;

    const element = containerRef.current;
    element.focus({ preventScroll: true });

    const requestFullscreen = async () => {
      try {
        if (document.fullscreenElement) return;
        await element.requestFullscreen();
      } catch (error) {
        // ignore fullscreen errors, continue without fullscreen
      }
    };

    requestFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isOpen]);

  if (!isOpen || !hasImages) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Moodboard slideshow"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-sm font-semibold tracking-widest uppercase text-white/70">
          Moodboard slideshow
        </p>
        <button
          type="button"
          onClick={closeSlideshow}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:text-white"
        >
          Close slideshow
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-8">
        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
        >
          Previous image
        </button>

        {currentImage ? (
          <figure className="flex max-h-[80vh] max-w-5xl flex-col items-center gap-4 text-center">
            <img
              src={currentImage.thumbnail}
              alt={currentImage.fileName}
              className="max-h-[65vh] w-full rounded-3xl object-contain shadow-2xl"
            />
            <figcaption className="text-sm text-white/70">
              {currentIndex + 1} / {images.length} — {currentImage.fileName}
            </figcaption>
          </figure>
        ) : null}

        <button
          type="button"
          onClick={goToNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
        >
          Next image
        </button>
      </div>

      <div className="px-8 pb-6">
        <div className="h-2 w-full rounded-full bg-white/10">
          <div
            role="progressbar"
            aria-label="Slide progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            className="h-full rounded-full bg-white"
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
