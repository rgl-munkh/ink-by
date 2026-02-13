"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROGRESS_BY_STEP: Record<number, number> = {
  1: 0,
  2: 23,
  3: 75,
  4: 88,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export interface StepperHeaderProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  artistName: string;
}

export function StepperHeader({
  step,
  totalSteps,
  onBack,
  artistName,
}: StepperHeaderProps) {
  const progress = PROGRESS_BY_STEP[step] ?? Math.round((step / totalSteps) * 100);

  return (
    <header className="flex flex-col items-center px-4 pt-4 pb-2">
      <div className="flex items-center justify-between w-full mb-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Буцах
        </Button>
        <div className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
          {progress}%
        </div>
      </div>
      <div className="size-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
        {getInitials(artistName)}
      </div>
    </header>
  );
}
