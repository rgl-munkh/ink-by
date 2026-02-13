"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSheetProps {
  bookingId: number;
  amount: number;
  onSuccess?: () => void;
}

export function PaymentSheet({
  bookingId,
  amount,
  onSuccess,
}: PaymentSheetProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create payment");
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
      onSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Booking Fee</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-semibold">${amount.toFixed(2)}</p>
        <p className="text-muted-foreground text-sm">
          This secures your appointment slot. The remaining balance is due at
          your appointment.
        </p>
        <Button onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
