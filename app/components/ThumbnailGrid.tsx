'use client'

import { useEffect, useState } from 'react'

interface ThumbnailGridProps {
  items: {
    id: string
    imageUrl: string
    title: string
  }[]
}

export default function ThumbnailGrid({ items }: ThumbnailGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 p-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-medium truncate">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  )
} 