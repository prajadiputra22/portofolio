import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin"; // <- sesuaikan
import { parseBlogForm, uploadCover, removeCoverByUrl } from "@/lib/blog/helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin.from("blog_posts").select("*, category:blog_categories(id,name,slug)").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Post tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ post: data });
}

/** Update penuh dari form edit (multipart/form-data). */
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;

  const { data: existing } = await supabaseAdmin
    .from("blog_posts")
    .select("cover_image_url,published_at")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: "Post tidak ditemukan." }, { status: 404 });

  const fd = await req.formData();
  const { data, coverFile, removeCover, error } = parseBlogForm(fd);
  if (error) return NextResponse.json({ error }, { status: 400 });

  let cover_image_url: string | null = existing.cover_image_url;
  if (coverFile) {
    const up = await uploadCover(coverFile);
    if (up.error) return NextResponse.json({ error: up.error }, { status: 400 });
    cover_image_url = up.url ?? null;
  } else if (removeCover) {
    cover_image_url = null;
  }

  const { error: dbError } = await supabaseAdmin
    .from("blog_posts")
    .update({
      ...data,
      cover_image_url,
      published_at:
        data.status === "published" ? existing.published_at ?? new Date().toISOString() : existing.published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (dbError) {
    const duplicate = dbError.code === "23505";
    return NextResponse.json(
      { error: duplicate ? "Slug sudah dipakai, gunakan slug lain." : dbError.message },
      { status: duplicate ? 409 : 500 }
    );
  }

  if (cover_image_url !== existing.cover_image_url) await removeCoverByUrl(existing.cover_image_url);
  return NextResponse.json({ ok: true });
}

/** Ubah status saja (dipakai tombol publish/unpublish di tabel). */
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (body.status !== "draft" && body.status !== "published") {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from("blog_posts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: "Post tidak ditemukan." }, { status: 404 });

  const { error } = await supabaseAdmin
    .from("blog_posts")
    .update({
      status: body.status,
      published_at: body.status === "published" ? existing.published_at ?? new Date().toISOString() : existing.published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const { data: existing } = await supabaseAdmin
    .from("blog_posts")
    .select("cover_image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await removeCoverByUrl(existing?.cover_image_url);
  return NextResponse.json({ ok: true });
}
