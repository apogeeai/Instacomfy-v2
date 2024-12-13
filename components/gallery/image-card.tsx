
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
    <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-[#141414]">
      <CardContent className="p-0">
        <button
          onClick={onClick}
          className="gallery-item relative overflow-hidden rounded-[3px]"
        >
          <Image
            src={image.url}
            alt={image.description}
            fill
            className="object-cover transition-transform duration-300"
            sizes="304px"
            priority={image.id <= 4 ? true : undefined}
          />
          <div className="gallery-item-overlay">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
