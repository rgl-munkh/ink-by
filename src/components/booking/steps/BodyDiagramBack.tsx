"use client";

import { cn } from "@/lib/utils";
import { BACK_PATHS } from "./bodyDiagramPaths";

interface BodyDiagramBackProps {
  selectedKey: string | null;
  onPartClick: (key: string) => void;
}

export function BodyDiagramBack({ selectedKey, onPartClick }: BodyDiagramBackProps) {
  return (
    <svg
      viewBox="0 0 226 373"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {BACK_PATHS.map(({ key, d }) => (
        <path
          key={key}
          data-key={key}
          d={d}
          fill="currentColor"
          className={cn(
            "cursor-pointer transition-opacity",
            "hover:opacity-80",
            selectedKey === key ? "opacity-100" : "opacity-40"
          )}
          onClick={() => onPartClick(key)}
        />
      ))}
    </svg>
  );
}
