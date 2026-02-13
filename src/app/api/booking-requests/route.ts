import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingRequests } from "@/db/schema";
import { AuthError, requireUser } from "@/lib/auth";
import { createBookingRequestSchema } from "@/lib/validations/booking";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = createBookingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      artistId,
      referenceImageUrl,
      referenceImageUrls,
      description,
      size,
      placement,
      preferredDates,
    } = parsed.data;

    const imageUrls = referenceImageUrls ?? (referenceImageUrl ? [referenceImageUrl] : []);
    const firstImageUrl = imageUrls[0] ?? referenceImageUrl ?? null;

    const [result] = await db
      .insert(bookingRequests)
      .values({
        userId: user.id,
        artistId,
        referenceImageUrl: firstImageUrl,
        referenceImageUrls: imageUrls,
        description,
        size: size ?? null,
        placement: placement ?? null,
        preferredDates: preferredDates ?? null,
        status: "pending",
      })
      .returning({ id: bookingRequests.id });

    return NextResponse.json({ id: result?.id }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status },
      );
    }
    console.error("Create booking request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
