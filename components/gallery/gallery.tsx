
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ImageCard } from "./image-card";
import { Lightbox } from "@/components/lightbox/lightbox";
import { Image } from "@/lib/data";

interface GalleryProps {
  images: Image[];
}

export function Gallery({ images = [] }: GalleryProps) {
  const [displayedImages, setDisplayedImages] = useState<Image[]>([]);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [page, setPage] = useState(1);
  const imagesPerPage = 16; // 4x4 grid

  useEffect(() => {
    setDisplayedImages(images.slice(0, imagesPerPage));
  }, [images]);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * imagesPerPage;
    const end = start + imagesPerPage;
    const newImages = images.slice(0, end);
    setDisplayedImages(newImages);
    setPage(nextPage);
  };

  useInfiniteScroll(loadMore);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="gallery-grid"
      >
        {displayedImages.map((image) => (
          <motion.div
            key={image.id}
            variants={item}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-[304px] h-[304px]"
          >
            <ImageCard
              image={image}
              onClick={() => setCurrentImage(image)}
            />
          </motion.div>
        ))}
      </motion.div>

      <Lightbox
        images={images}
        currentImage={currentImage}
        onClose={() => setCurrentImage(null)}
        onNext={() => {
          const idx = images.findIndex(img => img.id === currentImage?.id);
          if (idx < images.length - 1) setCurrentImage(images[idx + 1]);
        }}
        onPrevious={() => {
          const idx = images.findIndex(img => img.id === currentImage?.id);
          if (idx > 0) setCurrentImage(images[idx - 1]);
        }}
      />
    </>
  );
}
