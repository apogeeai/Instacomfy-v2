"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface AIPromptProps {
  onGenerate: (imageUrl: string) => void;
}

export function AIPrompt({ onGenerate }: AIPromptProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your AI image generation API
    // For now, we'll just simulate it with a placeholder image
    onGenerate("https://source.unsplash.com/random");
    setPrompt("");
  };

  return (
    <Card className="fixed bottom-4 left-1/2 w-full max-w-[600px] -translate-x-1/2 p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate an AI image..."
          className="flex-1"
        />
        <Button type="submit">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}