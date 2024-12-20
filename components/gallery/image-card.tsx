
import Image from "next/image";
import { Image as ImageType } from "@/lib/data";

interface ImageCardProps {
  image: ImageType;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <div 
      className="relative w-full h-full cursor-pointer overflow-hidden rounded-lg"
      onClick={onClick}
    >
      <Image
        src={image.url}
        alt={image.description || "Gallery image"}
        className="object-cover"
        fill
        sizes="304px"
        loading="lazy"
        quality={90}
      />
    </div>
  );
}
