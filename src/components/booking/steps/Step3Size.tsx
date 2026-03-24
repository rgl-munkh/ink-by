"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIZE_OPTIONS = [
  { value: "credit_card", label: "Кредит картны хэмжээтэй", emoji: "💳" },
  { value: "fist", label: "Зангидсан гарны хэмжээтэй", emoji: "✊" },
  { value: "palm", label: "Дэлгэсэн гарны алга шиг", emoji: "🖐" },
  { value: "forearm", label: "Гарын шуу тал эсвэл бүхэлдээ", emoji: "🕶" },
  { value: "unsure", label: "Сайн мэдэхгүй байна", emoji: "🐣" },
] as const;

export type SizeValue = (typeof SIZE_OPTIONS)[number]["value"];

export interface Step3SizeProps {
  size: SizeValue | "";
  onSizeChange: (v: SizeValue) => void;
  onContinue: () => void;
}

export function Step3Size({
  size,
  onSizeChange,
  onContinue,
}: Step3SizeProps) {
  return (
    <div className="px-4 w-full pb-8">
      <p className="text-lg font-bold text-center mb-6">
        🍌 Шивээс хийлгэх хэмжээ?
      </p>

      <div className="space-y-3">
        {SIZE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSizeChange(opt.value)}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors",
              size === opt.value
                ? "border-foreground bg-muted"
                : "border-muted bg-background hover:border-muted-foreground/50"
            )}
          >
            <span className="text-xl">{opt.emoji}</span>
            <span className="font-medium">{opt.label}</span>
          </button>
        ))}
      </div>

      <Button
        className="w-full mt-8 rounded-xl py-6"
        size="lg"
        onClick={onContinue}
        disabled={!size}
      >
        Үргэлжлүүлэх
        <span className="ml-1">›</span>
      </Button>
    </div>
  );
}
