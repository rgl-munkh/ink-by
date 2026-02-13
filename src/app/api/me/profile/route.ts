import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AuthError, requireUser } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { name, email, phone } = body;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      );
    }
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    await db
      .update(users)
      .set({
        name: name.trim(),
        email: email.trim(),
        phone: typeof phone === "string" ? phone.trim() || null : null,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status },
      );
    }
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
