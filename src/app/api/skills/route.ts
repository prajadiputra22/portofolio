import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("skills")
    .select("id, name, icon_url")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Gagal mengambil daftar skill." }, { status: 500 });
  }

  return NextResponse.json({ skills: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const icon_url = body?.icon_url?.trim();

  if (!name || !icon_url) {
    return NextResponse.json(
      { error: "Nama skill dan URL logo wajib diisi." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("skills")
    .insert({ name, icon_url })
    .select("id, name, icon_url, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Gagal menambahkan skill." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/dashboard/skills");

  return NextResponse.json({ skill: data }, { status: 201 });
}