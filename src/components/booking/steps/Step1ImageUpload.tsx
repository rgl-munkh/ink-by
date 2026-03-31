"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_IMAGES = 3;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface Step1ImageUploadProps {
  imageUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
  onContinue: () => void;
}

export function Step1ImageUpload({
  imageUrls,
  onImageUrlsChange,
  onContinue,
}: Step1ImageUploadProps) {
  const [uploading, setUploading] = useState(-1);
  const [error, setError] = useState("");
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    if (file.size > MAX_SIZE) {
      setError("Файл 5MB-аас бага байх ёстой");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("JPG, PNG эсвэл WebP форматаар оруулна уу");
      return;
    }

    setUploading(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/ref-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Зураг оруулах амжилтгүй боллоо");
      }
      const { url } = await res.json();
      const newUrls = [...imageUrls];
      newUrls[index] = url;
      onImageUrlsChange(newUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setUploading(-1);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    onImageUrlsChange(newUrls);
  };

  return (
    <div className="px-4 w-full pb-8">
      <p className="text-lg font-bold text-center mb-6">
        👀 Танд харуулах шивээсний зураг байгаа юу?
      </p>

      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="relative aspect-4/3 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-size-[1rem_1rem] overflow-hidden"
          >
            {imageUrls[index] ? (
              <>
                {/* biome-ignore lint/performance/noImgElement: blob or uploaded URL */}
                <img
                  src={imageUrls[index]}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 rounded-full bg-black/50 text-white p-1.5 text-xs hover:bg-black/70"
                >
                  ×
                </button>
              </>
            ) : (
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  ref={(el) => { fileRefs.current[index] = el; }}
                  onChange={(e) => handleFileChange(index, e)}
                  disabled={uploading >= 0}
                />
                <span className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-medium shadow-sm">
                  <Upload className="size-4" />
                  {uploading === index ? "Оруулж байна..." : "Зураг оруулах"}
                </span>
              </label>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-2 text-center">
        Хязгаар {imageUrls.length}/{MAX_IMAGES}
      </p>

      {error && (
        <p className="text-destructive text-sm mt-2 text-center">{error}</p>
      )}

      <Button
        className="w-full mt-8 rounded-xl py-6"
        size="lg"
        onClick={onContinue}
      >
        Үргэлжлүүлэх
        <span className="ml-1">›</span>
      </Button>
    </div>
  );
}
