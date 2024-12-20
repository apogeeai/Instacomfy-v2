"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import OpenAI from "openai";
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

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        // Get public URL without testing it
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        // Save to generated_images table
        const { data: dbData, error: dbError } = await supabase
          .from('generated_images')
          .insert([
            { 
              url: publicUrl,
              prompt: prompt,
              created_at: new Date().toISOString()
            }
          ])
          .select();

        if (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }

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
    <Card className="fixed bottom-4 left-1/2 w-full max-w-[600px] -translate-x-1/2 p-4 bg-background border-border">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate an AI image..."
          className="flex-1 bg-background text-foreground"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}