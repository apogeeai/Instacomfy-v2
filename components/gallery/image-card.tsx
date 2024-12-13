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
    <CardContent className="gallery-item relative w-[304px] h-[304px] overflow-hidden rounded-[3px]">
      <button onClick={onClick} className="">
        <Image
          src={image.url}
          alt={image.description}
          fill
          className="object-cover transition-transform duration-300"
          sizes="304px"
          priority={image.id <= 4 ? true : undefined}
        />
      </button>
    </CardContent>
  );
}
