import { NextResponse } from "next/server";
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