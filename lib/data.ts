export interface Image {
  id: number;
  url: string;
  likes: number;
  description: string;
}

export const initialImages: Image[] = [];

export function getMoreImages(page: number): Image[] {
  return initialImages.map((img) => ({
    ...img,
    id: img.id + page * 40,
    url: `${img.url}?page=${page}`, // This ensures unique images from Unsplash
  }));
}
