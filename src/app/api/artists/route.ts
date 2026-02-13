import { NextResponse } from "next/server";
import { db } from "@/db";
import { artists } from "@/db/schema";

export async function GET() {
  try {
    const list = await db.select().from(artists);
    return NextResponse.json(list);
  } catch (err) {
    console.error("Get artists error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
