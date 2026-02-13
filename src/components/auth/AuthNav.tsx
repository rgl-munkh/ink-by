"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function AuthNav() {
  const [user, setUser] = useState<SessionUser | null | "loading">("loading");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  if (user === "loading") {
    return (
      <nav className="flex items-center gap-4 text-sm text-muted-foreground">
        —
      </nav>
    );
  }

  const sessionUser = user as { id: number; name: string; email: string; role: string };

  return (
    <nav className="flex items-center gap-4 text-sm">
      {user ? (
        <>
          {sessionUser.role === "client" && (
            <Link href="/become-artist" className="text-primary hover:underline">
              Become an artist
            </Link>
          )}
          <Link href="/profile" className="text-muted-foreground hover:text-foreground">
            {sessionUser.name}
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-primary hover:underline"
          >
            Sign out
          </button>
        </>
      ) : (
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      )}
    </nav>
  );
}
