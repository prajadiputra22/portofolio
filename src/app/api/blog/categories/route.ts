import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin"; // <- sesuaikan
import { slugify } from "@/lib/blog/helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("blog_categories")
    .select("id,name,slug")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const slug = slugify(name);
  if (!name || !slug) return NextResponse.json({ error: "Nama kategori tidak valid." }, { status: 400 });
  if (name.length > 80) return NextResponse.json({ error: "Nama kategori maksimal 80 karakter." }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("blog_categories")
    .insert({ name, slug })
    .select("id,name,slug")
    .single();

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { error: duplicate ? "Kategori sudah ada." : error.message },
      { status: duplicate ? 409 : 500 }
    );
  }
  return NextResponse.json({ category: data }, { status: 201 });
}
