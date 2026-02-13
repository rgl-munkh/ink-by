import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { requireAdminOrArtist } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const artistIdStr = formData.get("artistId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!artistIdStr) {
      return NextResponse.json(
        { error: "artistId is required" },
        { status: 400 },
      );
    }

    const artistId = Number.parseInt(artistIdStr, 10);
    if (Number.isNaN(artistId)) {
      return NextResponse.json({ error: "Invalid artistId" }, { status: 400 });
    }

    await requireAdminOrArtist(artistId);

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File must be JPG, PNG, or WebP" },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `portfolio/${artistId}/${crypto.randomUUID()}.${ext}`;

    const supabase = getSupabase();
    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
