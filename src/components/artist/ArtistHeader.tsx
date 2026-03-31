"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ArtistHeaderProps {
  onSelect?: () => void;
}

export function ArtistHeader({ onSelect }: ArtistHeaderProps) {
  const router = useRouter();

  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    } else {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="flex items-center w-full justify-between px-4 py-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        Буцах
      </Button>
      <Button
        size="sm"
        className="rounded-xl"
        onClick={handleSelect}
      >
        Сонгох
        <Check className="size-4" />
      </Button>
    </header>
  );
}
