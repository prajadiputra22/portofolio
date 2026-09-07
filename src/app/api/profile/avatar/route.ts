import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format harus JPG, PNG, atau WebP" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Ukuran file maksimal 2MB" }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";

  const path = `profile/avatar.${ext}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("avatars").getPublicUrl(path);

  const versionedUrl = `${publicUrl}?v=${Date.now()}`;

  const { data, error } = await supabaseAdmin
    .from("profile")
    .update({ avatar_url: versionedUrl })
    .eq("id", 1)
    .select("avatar_url")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ avatar_url: data.avatar_url });
}