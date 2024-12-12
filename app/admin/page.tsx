
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false });
    setImages(data || []);
  }

  async function deleteImage(id: number) {
    await supabase.from('generated_images').delete().eq('id', id);
    loadImages();
  }

  if (!isAdmin) return <div>Access denied</div>;

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="relative aspect-square">
            <Image
              src={image.url}
              alt="Gallery image"
              fill
              className="object-cover"
            />
            <Button
              variant="destructive"
              className="absolute right-2 top-2"
              onClick={() => deleteImage(image.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
