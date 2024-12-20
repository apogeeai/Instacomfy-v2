
import Image from "next/image";
import { motion } from "framer-motion";
import { Image as ImageType } from "@/lib/data";

interface ImageCardProps {
  image: ImageType;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <motion.div 
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted"
      onClick={onClick}
    >
      <Image
        src={image.url}
        alt={image.description || "Gallery image"}
        className="object-cover"
        fill
        sizes="(max-width: 768px) 33vw, 304px"
        loading="lazy"
        quality={90}
      />
    </motion.div>
  );
}
