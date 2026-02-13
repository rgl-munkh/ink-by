"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BodyDiagramFront } from "./BodyDiagramFront";
import { BodyDiagramBack } from "./BodyDiagramBack";
import { DATA_KEY_TO_LABEL } from "./bodyDiagramLabels";

export interface Step4PlacementProps {
  placement: string;
  onPlacementChange: (v: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function Step4Placement({
  placement,
  onPlacementChange,
  onSubmit,
  isSubmitting,
}: Step4PlacementProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const sideLabel = side === "front" ? "Урд тал" : "Хойд тал";
  const selectedLabel = selectedKey ? DATA_KEY_TO_LABEL[selectedKey] : null;
  const placementValue = selectedKey
    ? `${DATA_KEY_TO_LABEL[selectedKey]} - ${sideLabel}`
    : "";

  const handlePartClick = (key: string) => {
    setSelectedKey(key);
    onPlacementChange(`${DATA_KEY_TO_LABEL[key]} - ${sideLabel}`);
  };

  const handleSideChange = (newSide: "front" | "back") => {
    setSide(newSide);
    setSelectedKey(null);
  };

  const handleContinue = () => {
    if (placementValue) {
      onSubmit();
    }
  };

  return (
    <div className="px-4 pb-8">
      <p className="text-lg font-bold text-center mb-6">
        👀 Хаана хийлгэх вэ?
      </p>

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleSideChange("front")}
          className={cn(
            "flex-1 rounded-xl border-2 py-3 font-medium transition-colors",
            side === "front"
              ? "border-foreground bg-muted"
              : "border-muted bg-background hover:border-muted-foreground/50"
          )}
        >
          Урд тал
        </button>
        <button
          type="button"
          onClick={() => handleSideChange("back")}
          className={cn(
            "flex-1 rounded-xl border-2 py-3 font-medium transition-colors",
            side === "back"
              ? "border-foreground bg-muted"
              : "border-muted bg-background hover:border-muted-foreground/50"
          )}
        >
          Хойд тал
        </button>
      </div>

      <div className="rounded-xl border bg-muted/30 p-6 mb-6">
        <div className="aspect-[226/373] max-h-[330px] w-full max-w-[200px] mx-auto flex items-center justify-center rounded-lg overflow-hidden">
          {side === "front" ? (
            <BodyDiagramFront
              selectedKey={selectedKey}
              onPartClick={handlePartClick}
            />
          ) : (
            <BodyDiagramBack
              selectedKey={selectedKey}
              onPartClick={handlePartClick}
            />
          )}
        </div>
        <div className="text-center mt-4">
          {selectedLabel ? (
            <p className="font-medium">{selectedLabel}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Дээрх биеийн хэсгээс сонгоно уу
            </p>
          )}
        </div>
      </div>

      <Button
        className="w-full rounded-xl py-6"
        size="lg"
        onClick={handleContinue}
        disabled={isSubmitting || !selectedKey}
      >
        {isSubmitting ? "Илгээж байна..." : "Илгээх"}
        <span className="ml-1">›</span>
      </Button>
    </div>
  );
}
