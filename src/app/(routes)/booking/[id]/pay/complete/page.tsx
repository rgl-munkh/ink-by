"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function PayCompletePage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");

    if (paymentId) {
      fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerPaymentId: paymentId }),
      })
        .then((res) => {
          setStatus(res.ok ? "success" : "error");
        })
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  const bookingId = params?.id as string | undefined;

  if (status === "loading") {
    return (
      <div className="container mx-auto max-w-md py-12">
        <p>Processing payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container mx-auto max-w-md py-12 space-y-4">
        <h1 className="text-xl font-bold text-destructive">Payment Failed</h1>
        <p className="text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-12 space-y-4">
      <h1 className="text-2xl font-bold">Payment Complete</h1>
      <p className="text-muted-foreground">
        Your booking has been confirmed. Your appointment is now scheduled.
      </p>
      {bookingId && (
        <Button asChild>
          <Link href={`/booking/${bookingId}`}>View Booking</Link>
        </Button>
      )}
      <Button variant="outline" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
