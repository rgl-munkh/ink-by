"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
  artistId?: number | null;
}

interface BecomeArtistRequest {
  id: number;
  status: string;
  phoneNumber: string | null;
  instagramUsername: string | null;
}

export default function BecomeArtistPage() {
  const [user, setUser] = useState<SessionUser | null | "loading">("loading");
  const [request, setRequest] = useState<BecomeArtistRequest | null | "loading">(
    "loading",
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session").then((r) => r.json()),
      fetch("/api/become-artist/request").then((r) => r.json()),
    ]).then(([sessionRes, requestRes]) => {
      setUser(sessionRes?.user ?? null);
      setRequest(requestRes?.request ?? null);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/become-artist/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber || undefined,
          instagramUsername: instagramUsername || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit request");
        return;
      }
      setRequest({ id: data.id, status: "pending", phoneNumber, instagramUsername });
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (user === "loading" || request === "loading") {
    return (
      <div className="container mx-auto max-w-md py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <p className="text-muted-foreground">
          Please <Link href="/login" className="text-primary underline">sign in</Link> to apply.
        </p>
      </div>
    );
  }

  if (user.role === "artist" && user.artistId) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>You are an artist</CardTitle>
            <CardDescription>
              Your artist profile has been approved. You can manage your
              requests and availability from your artist dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/artist/${user.artistId}/profile`}>
                Go to Artist Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (request && request.status === "pending") {
    return (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Request pending</CardTitle>
            <CardDescription>
              Your request to become an artist is under review. An admin will
              contact you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className="text-primary text-sm underline">
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (request && request.status === "rejected") {
    return (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Request rejected</CardTitle>
            <CardDescription>
              Your request to become an artist was not approved. Please contact
              support if you have questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className="text-primary text-sm underline">
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Become an artist</CardTitle>
          <CardDescription>
            Submit your details to request an artist account. An admin will
            review your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUsername">Instagram username</Label>
              <Input
                id="instagramUsername"
                type="text"
                placeholder="@username"
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit request"}
            </Button>
          </form>
          <p className="mt-4 text-center">
            <Link href="/" className="text-primary text-sm underline">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
