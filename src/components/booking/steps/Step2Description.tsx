"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PLACEHOLDER =
  "Жнь: Mystery гэхдээ сүртэй сүрдмээр, нарийхан зураастай байвал гоё гэж бодож байна. Энд дарж бичих...";

export interface Step2DescriptionProps {
  description: string;
  onDescriptionChange: (v: string) => void;
  onContinue: () => void;
  error?: string;
}

export function Step2Description({
  description,
  onDescriptionChange,
  onContinue,
  error,
}: Step2DescriptionProps) {
  const isValid = description.length >= 10;

  return (
    <div className="px-4 w-full h-full justify-between flex flex-col">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold text-center mb-6">
          🧐 Шивээсний утга учир ямар байлгмаар байна вэ?
        </p>

        <Textarea
          placeholder={PLACEHOLDER}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[120px] rounded-xl resize-none"
        />

        {error && (
          <p className="text-destructive text-sm mt-2">{error}</p>
        )}

      </div>
      <Button
        className="w-full mt-8 rounded-xl py-6"
        size="lg"
        onClick={onContinue}
        disabled={!isValid}
      >
        Үргэлжлүүлэх
        <span className="ml-1">›</span>
      </Button>
    </div>
  );
}
