"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/auth-provider";

export default function Upload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    setProgress(0);

    try {
      const files = Array.from(e.target.files);

      for (let i = 0; i < files.length; i++) {
        const fileExt = files[i].name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(`uploads/${fileName}`, files[i]);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(`uploads/${fileName}`);

        const { error: dbError } = await supabase
          .from("generated_images")
          .insert([
            {
              url: publicUrl,
              prompt: "Uploaded image",
              created_at: new Date().toISOString(),
            },
          ]);

        if (dbError) {
          console.error("Database error:", dbError);
        }

        setProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Mass Image Upload</h1>
      <label
        className={`relative flex flex-col items-center justify-center w-full rounded-md border-2 border-dashed p-8 text-center transition-colors ${
          uploading
            ? "border-blue-500 bg-blue-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-500 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <span className="text-gray-600">
          {uploading ? "Uploading files..." : "Click or Drag & Drop to upload images"}
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="absolute h-full w-full opacity-0"
          disabled={uploading}
          onChange={handleUpload}
        />
      </label>

      {uploading && (
        <div className="mt-6 w-full">
          <div className="h-2 w-full rounded bg-gray-200">
            <div
              className="h-full rounded bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-gray-700">
            {Math.round(progress)}% Complete
          </p>
        </div>
      )}
    </main>
  );
}
