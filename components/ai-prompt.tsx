"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from '@/utils/supabase-upload';

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
        
        // Download the image from OpenAI URL
        const imageResponse = await fetch(openaiUrl);
        const imageBlob = await imageResponse.blob();
        const imageFile = new File([imageBlob], `dalle-${Date.now()}.png`, { type: 'image/png' });
        
        // Upload to Supabase storage
        const supabaseImageUrl = await uploadImageToSupabase(imageFile, 'ai-generated');
        
        // Save to Supabase database
        const { error } = await supabase
          .from('generated_images')
          .insert([
            { 
              url: supabaseImageUrl,
              prompt: prompt,
              created_at: new Date().toISOString()
            }
          ]);
          
        if (error) {
          console.error('Error saving to database:', error);
        }

        onGenerate(supabaseImageUrl);
        setPrompt("");
      }
    } catch (error: any) {
      console.error("Error generating image:", error?.error || error);
      alert("Failed to generate image. Please try a different prompt.");
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
