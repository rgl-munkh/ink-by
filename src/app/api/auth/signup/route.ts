import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name ?? email.split("@")[0] },
        },
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (authData.user) {
      const displayName = name ?? authData.user.user_metadata?.name ?? email.split("@")[0];

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.authUserId, authData.user.id));

      if (!existing) {
        await db.insert(users).values({
          authUserId: authData.user.id,
          name: displayName,
          email: authData.user.email ?? email,
          role: "client",
        });
      }
    }

    return NextResponse.json({
      user: authData.user,
      session: authData.session,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
