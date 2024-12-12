export interface Image {
  id: number;
  url: string;
  likes: number;
  description: string;
}

export const initialImages: Image[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1605379399642-870262d3d051",
    likes: 234,
    description: "Modern workspace setup"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    likes: 456,
    description: "Gaming battlestation"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    likes: 789,
    description: "Minimalist office"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    likes: 321,
    description: "Clean desk setup"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a",
    likes: 567,
    description: "Professional workspace"
  },
  // Add more images here...
  {
    id: 40,
    url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    likes: 432,
    description: "Modern office space"
  }
];

export function getMoreImages(page: number): Image[] {
  return initialImages.map(img => ({
    ...img,
    id: img.id + page * 40,
    url: `${img.url}?page=${page}` // This ensures unique images from Unsplash
  }));
}