"use client";

import { useState } from "react";
import { ImageCard } from "./image-card";
import { Lightbox } from "@/components/lightbox/lightbox";
import { Image } from "@/lib/data";

interface GalleryProps {
  images: Image[];
}

export function Gallery({ images }: GalleryProps) {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);

  const currentIndex = currentImage ? images.findIndex(img => img.id === currentImage.id) : -1;

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentImage(images[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentImage(images[currentIndex - 1]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => setCurrentImage(image)}
          />
        ))}
      </div>

      <Lightbox
        images={images}
        currentImage={currentImage}
        onClose={() => setCurrentImage(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  );
}