"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import OpenAI from "openai";
//import { supabase } from "@/lib/supabase"; //Removed Supabase import

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
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      if (response.data?.[0]?.url) {
        const openaiUrl = response.data[0].url;
        
        // Download the image from OpenAI URL through our proxy
        const imageResponse = await fetch('/api/fetch-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: openaiUrl }),
        });
        
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch image from proxy');
        }
        
        const imageBlob = await imageResponse.blob();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const imageFile = new File([imageBlob], fileName, { type: 'image/png' });

        // Upload to Supabase storage bucket 'images' - Removed Supabase upload
        //const { data: uploadData, error: uploadError } = await supabase.storage
        //  .from('images')
        //  .upload(fileName, imageFile);

        //if (uploadError) throw uploadError;

        // Get the public URL - Removed Supabase public URL retrieval
        //const { data: { publicUrl } } = supabase.storage
        //  .from('images')
        //  .getPublicUrl(fileName, {
        //    transform: {
        //      width: 1024,
        //      height: 1024,
        //      quality: 100
        //    }
        //  });

        // Assuming the proxy returns a public URL directly.
        const publicUrl = URL.createObjectURL(imageFile);


        // Save to generated_images in Replit DB
        const id = Date.now().toString();
        await db.set(`image:${id}`, {
          url: publicUrl,
          prompt: prompt,
          created_at: new Date().toISOString()
        });

        // Pass the public URL to the gallery
        onGenerate(publicUrl);
        setPrompt("");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
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
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}