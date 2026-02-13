import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type AppUser = {
  id: number;
  authUserId: string;
  name: string;
  email: string;
  role: string;
};

export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const [appUser] = await db
    .select({
      id: users.id,
      authUserId: users.authUserId,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.authUserId, authUser.id));

  if (!appUser || !appUser.authUserId) return null;

  return {
    id: appUser.id,
    authUserId: appUser.authUserId,
    name: appUser.name,
    email: appUser.email,
    role: appUser.role,
  };
}

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Unauthorized", 401);
  }
  return user;
}

export async function requireRole(
  role: "client" | "artist" | "admin"
): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== role) {
    throw new AuthError("Forbidden", 403);
  }
  return user;
}

export async function requireAdmin(): Promise<AppUser> {
  return requireRole("admin");
}

export async function requireArtist(artistId?: number): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== "artist") {
    throw new AuthError("Forbidden", 403);
  }
  if (artistId !== undefined) {
    const { artists } = await import("@/db/schema");
    const [artist] = await db
      .select({ id: artists.id })
      .from(artists)
      .where(
        and(eq(artists.id, artistId), eq(artists.userId, user.id)),
      );
    if (!artist) {
      throw new AuthError("Forbidden", 403);
    }
  }
  return user;
}

export async function requireAdminOrArtist(
  artistId: number,
): Promise<AppUser> {
  const user = await requireUser();
  if (user.role === "admin") return user;
  if (user.role !== "artist") {
    throw new AuthError("Forbidden", 403);
  }
  const { artists } = await import("@/db/schema");
  const [artist] = await db
    .select({ id: artists.id })
    .from(artists)
    .where(
      and(eq(artists.id, artistId), eq(artists.userId, user.id)),
    );
  if (!artist) {
    throw new AuthError("Forbidden", 403);
  }
  return user;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}
