"use client";

import { useState, useCallback } from "react";
import { Gallery } from "@/components/gallery/gallery";
import { Header } from "@/components/header";
import { AIPrompt } from "@/components/ai-prompt";
import { ThemeProvider } from "next-themes";
import { initialImages, getMoreImages, Image } from "@/lib/data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export default function Home() {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => {
    const newImages = getMoreImages(page);
    setImages(prev => [...prev, ...newImages]);
    setPage(prev => prev + 1);
  }, [page]);

  const { isFetching } = useInfiniteScroll(loadMore);

  const handleNewImage = (imageUrl: string) => {
    setImages(prev => [{
      id: Date.now(),
      url: imageUrl,
      likes: 0,
      description: "AI Generated Image"
    }, ...prev]);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="mx-auto min-w-[420px] max-w-[1260px]">
          <Header />
          <main className="p-4">
            <Gallery images={images} />
            {isFetching && (
              <div className="my-4 text-center text-muted-foreground">
                Loading more images...
              </div>
            )}
            <AIPrompt onGenerate={handleNewImage} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}