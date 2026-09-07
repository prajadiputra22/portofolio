import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import type { Profile } from "@/types/profile";

const EDITABLE_FIELDS = [
  "full_name",
  "hero_greeting",
  "hero_headline",
  "bio",
  "role_title",
  "avatar_url",
  "resume_url",
  "location",
  "phone",
  "email",
  "linkedin_url",
  "github_url",
  "instagram_url",
] as const;

async function requireSession() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("profile")
    .select("*")
    .eq("id", 1)
    .single<Profile>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

export async function PUT(request: Request) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      const value = body[field];
      update[field] = typeof value === "string" ? value.trim() : value;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // Validasi ringan untuk field yang wajib diisi
  if ("full_name" in update && !update.full_name) {
    return NextResponse.json({ error: "Full name tidak boleh kosong" }, { status: 400 });
  }
  if ("email" in update && update.email && !/^\S+@\S+\.\S+$/.test(update.email as string)) {
    return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("profile")
    .update(update)
    .eq("id", 1)
    .select("*")
    .single<Profile>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ profile: data });
}