"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepperHeader } from "./StepperHeader";
import { Step1ImageUpload } from "./steps/Step1ImageUpload";
import { Step2Description } from "./steps/Step2Description";
import { Step3Size, type SizeValue } from "./steps/Step3Size";
import { Step4Placement } from "./steps/Step4Placement";
import { Container } from "../common";

const TOTAL_STEPS = 4;

export interface BookingRequestStepperProps {
  artistId: number;
  artistName: string;
  onExit?: () => void;
}

export function BookingRequestStepper({
  artistId,
  artistName,
  onExit,
}: BookingRequestStepperProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [size, setSize] = useState<SizeValue | "">("");
  const [placement, setPlacement] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    if (step === 1) {
      if (onExit) {
        onExit();
      } else {
        router.back();
      }
    } else {
      setStep((s) => s - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId,
          referenceImageUrls: referenceImageUrls.length > 0 ? referenceImageUrls : undefined,
          description,
          size: size || undefined,
          placement: placement || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Илгээх амжилтгүй боллоо");
      }

      await res.json();
      window.location.href = "/profile";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container >
      <StepperHeader
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        artistName={artistName}
      />

      {step === 1 && (
        <Step1ImageUpload
          imageUrls={referenceImageUrls}
          onImageUrlsChange={setReferenceImageUrls}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2Description
          description={description}
          onDescriptionChange={setDescription}
          onContinue={() => setStep(3)}
          error={error}
        />
      )}

      {step === 3 && (
        <Step3Size
          size={size}
          onSizeChange={setSize}
          onContinue={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Step4Placement
          placement={placement}
          onPlacementChange={setPlacement}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {step === 4 && error && (
        <p className="text-destructive text-sm text-center px-4 mt-2">
          {error}
        </p>
      )}
    </Container>
  );
}
