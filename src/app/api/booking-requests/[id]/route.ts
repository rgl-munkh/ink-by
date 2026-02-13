import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingRequests, quotes } from "@/db/schema";
import { AuthError, requireUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id: idParam } = await params;
    const id = Number.parseInt(idParam, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [br] = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, id));

    if (!br) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (br.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const request = br;

    const requestQuotes = await db
      .select()
      .from(quotes)
      .where(eq(quotes.bookingRequestId, id));

    return NextResponse.json({
      ...request,
      quotes: requestQuotes,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Get booking request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
