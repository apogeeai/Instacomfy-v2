
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase';

export default function Upload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`uploads/${fileName}`, file);
          
        if (error) {
          console.error('Upload error:', error);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(`uploads/${fileName}`);
          
        const { error: dbError } = await supabase.from('generated_images')
          .insert([{ 
            url: publicUrl,
            prompt: 'Uploaded image',
            created_at: new Date().toISOString()
          }]);

        if (dbError) {
          console.error('Database error:', dbError);
        }
      }
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-2xl font-bold">Upload Images</h1>
      <div className="grid place-items-center gap-4">
        <Button disabled={uploading} asChild>
          <label>
            {uploading ? 'Uploading...' : 'Select Images'}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </Button>
      </div>
    </div>
  );
}
