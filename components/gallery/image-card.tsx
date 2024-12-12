"use client";

import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Image as ImageType } from "@/lib/data";

interface ImageCardProps {
  image: ImageType;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
      <CardContent className="p-0">
        <button
          onClick={onClick}
          className="relative aspect-square w-full overflow-hidden"
        >
          <Image
            src={image.url}
            alt={image.description}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </button>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <p className="text-sm text-muted-foreground">{image.description}</p>
        <div className="flex items-center space-x-1">
          <Heart className="h-4 w-4" />
          <span className="text-sm">{image.likes}</span>
        </div>
      </CardFooter>
    </Card>
  );
}