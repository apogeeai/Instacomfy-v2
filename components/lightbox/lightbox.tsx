"use client";

import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/lib/data";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: Image[];
  currentImage: Image | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Lightbox({
  images,
  currentImage,
  onClose,
  onNext,
  onPrevious
}: LightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") onNext();
    if (e.key === "ArrowLeft") onPrevious();
  }, [onClose, onNext, onPrevious]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative h-full w-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 z-50 -translate-y-1/2"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 z-50 -translate-y-1/2"
          onClick={onNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="flex h-full items-center justify-center p-10">
          <div className="relative h-full max-h-[80vh] w-full max-w-[80vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage.url}
              alt={currentImage.description}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-background/90 p-4 backdrop-blur">
          <p className="text-sm">{currentImage.description}</p>
        </div>
      </div>
    </div>
  );
}