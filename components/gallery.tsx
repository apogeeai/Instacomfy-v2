"use client";

import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

interface GalleryProps {
  images: {
    id: number;
    url: string;
    likes: number;
    description: string;
  }[];
}

export function Gallery({ images }: GalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.description}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4">
            <p className="text-sm text-muted-foreground">{image.description}</p>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="text-sm">{image.likes}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}