import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin"; // <- sesuaikan
import { slugify } from "@/lib/blog/helpers";

type Ctx = { params: Promise<{ id: string }> };

/** Ganti nama kategori. */
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const slug = slugify(name);
  if (!name || !slug) return NextResponse.json({ error: "Nama kategori tidak valid." }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("blog_categories")
    .update({ name, slug })
    .eq("id", id)
    .select("id,name,slug")
    .maybeSingle();

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { error: duplicate ? "Kategori sudah ada." : error.message },
      { status: duplicate ? 409 : 500 }
    );
  }
  if (!data) return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ category: data });
}

/** Hapus kategori. Ditolak jika masih dipakai post (FK on delete restrict). */
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const { error } = await supabaseAdmin.from("blog_categories").delete().eq("id", id);
  if (error) {
    const inUse = error.code === "23503";
    return NextResponse.json(
      { error: inUse ? "Kategori masih dipakai oleh post." : error.message },
      { status: inUse ? 409 : 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
