
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface AIPromptProps {
  onGenerate: (imageUrl: string) => void;
}

export function AIPrompt({ onGenerate }: AIPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      console.log("Generating image with prompt:", prompt);
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      if (!data.imageUrl) {
        throw new Error('No image URL received');
      }

      const tempImageUrl = data.imageUrl;
      console.log("Temporary image URL:", tempImageUrl);
      
      const imageResponse = await fetch(`/api/proxy-image?url=${encodeURIComponent(tempImageUrl)}`);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }
      
      const imageBlob = await imageResponse.blob();
      const fileName = `ai-generated-${Date.now()}.png`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(`public/${fileName}`, imageBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/png',
        });

      if (uploadError) {
        throw new Error(`Storage upload error: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(`public/${fileName}`);

      const { error: dbError } = await supabase
        .from('generated_images')
        .insert([
          { 
            url: publicUrl,
            prompt: prompt,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      onGenerate(publicUrl);
      setPrompt("");
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Failed to generate image: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="fixed bottom-4 left-1/2 w-full max-w-[600px] -translate-x-1/2 p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate an AI image..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin">⌛</div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Card>
  );
}
