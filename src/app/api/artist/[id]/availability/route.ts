import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { availability } from "@/db/schema";
import { requireAdminOrArtist } from "@/lib/auth";
import { AuthError } from "@/lib/auth";
import { createAvailabilitySchema } from "@/lib/validations/booking";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const artistId = Number.parseInt(id, 10);
    if (Number.isNaN(artistId)) {
      return NextResponse.json({ error: "Invalid artist ID" }, { status: 400 });
    }

    const slots = await db
      .select()
      .from(availability)
      .where(eq(availability.artistId, artistId))
      .orderBy(availability.start);

    return NextResponse.json(slots);
  } catch (err) {
    console.error("Get availability error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const artistId = Number.parseInt(id, 10);
    if (Number.isNaN(artistId)) {
      return NextResponse.json({ error: "Invalid artist ID" }, { status: 400 });
    }

    await requireAdminOrArtist(artistId);

    const body = await request.json();
    const parsed = createAvailabilitySchema.safeParse({
      ...body,
      artistId,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { slots } = parsed.data;

    const existing = await db
      .select()
      .from(availability)
      .where(eq(availability.artistId, artistId));

    for (const slot of slots) {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      if (start >= end) {
        return NextResponse.json(
          { error: "Slot start must be before end" },
          { status: 400 },
        );
      }
      for (const ex of existing) {
        if (rangesOverlap(start, end, ex.start, ex.end)) {
          return NextResponse.json(
            { error: "Slots overlap with existing availability" },
            { status: 409 },
          );
        }
      }
    }

    const inserted = await db
      .insert(availability)
      .values(
        slots.map((s) => ({
          artistId,
          start: new Date(s.start),
          end: new Date(s.end),
          isBooked: false,
        })),
      )
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Create availability error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
