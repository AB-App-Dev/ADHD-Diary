"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";

interface AvatarUploadProps {
  onSuccess?: () => void;
}

export function AvatarUpload({ onSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      let processedFile: File = file;

      // Compress if > 250KB
      if (file.size > 250 * 1024) {
        processedFile = await imageCompression(file, {
          maxSizeMB: 0.24,
          maxWidthOrHeight: 400,
          useWebWorker: true,
        });
      }

      const formData = new FormData();
      formData.append("avatar", processedFile);

      const response = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload fehlgeschlagen");
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground hover:bg-background disabled:opacity-50"
      >
        <svg
          className="h-4 w-4 text-white group-hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {uploading ? "Wird hochgeladen..." : "Avatar hochladen"}
      </button>
      {error && (
        <p className="px-4 py-1 text-xs text-red-400">{error}</p>
      )}
    </>
  );
}
