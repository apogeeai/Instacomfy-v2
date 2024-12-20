"use client";

import { Heart } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Image as ImageType } from "@/lib/data";

interface ImageCardProps {
  image: ImageType;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <CardContent className="gallery-item relative w-full h-full overflow-hidden rounded-[3px]">
      <button onClick={onClick} className="w-full h-full">
        <Image
          src={image.url}
          alt={image.description}
          fill
          className="object-cover transition-transform duration-300"
          sizes="(max-width: 768px) 33vw, 25vw"
          priority={image.id <= 4 ? true : undefined}
        />
      </button>
    </CardContent>
  );
}