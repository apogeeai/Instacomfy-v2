
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ImageCard } from "./image-card";
import { Lightbox } from "@/components/lightbox/lightbox";
import { Image } from "@/lib/data";

interface GalleryProps {
  images: Image[];
}

export function Gallery({ images = [] }: GalleryProps) {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="gallery-grid min-w-[420px] max-w-[1260px] mx-auto grid grid-cols-3 gap-10"
      >
        {images.map((image, i) => (
          <motion.div
            key={image.id}
            variants={item}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  );
}
