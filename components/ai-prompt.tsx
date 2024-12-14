
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
        const tempImageUrl = response.data[0].url;
        
        // Download image and upload to Supabase storage
        const imageResponse = await fetch(tempImageUrl);
        const imageBlob = await imageResponse.blob();
        
        const fileName = `ai-generated-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('images')
          .upload(fileName, imageBlob);

        if (uploadError) {
          console.error('Error uploading to storage:', uploadError);
          return;
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('images')
          .getPublicUrl(fileName);

        // Save to Supabase database
        const { error } = await supabase
          .from('generated_images')
          .insert([
            { 
              url: publicUrl,
              prompt: prompt,
              created_at: new Date().toISOString()
            }
          ]);
          
        if (error) {
          console.error('Error saving to database:', error);
        }

        onGenerate(imageUrl);
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
