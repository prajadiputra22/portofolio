import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin"; // <- sesuaikan
import { parseBlogForm, uploadCover } from "@/lib/blog/helpers";

export const dynamic = "force-dynamic";

const LIST_COLUMNS =
  "id,title,slug,excerpt,cover_image_url,category_id,category:blog_categories(id,name,slug),tags,featured,status,views,published_at,created_at,updated_at";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select(LIST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

export async function POST(req: Request) {
  const fd = await req.formData();
  const { data, coverFile, error } = parseBlogForm(fd);
  if (error) return NextResponse.json({ error }, { status: 400 });

  let cover_image_url: string | null = null;
  if (coverFile) {
    const up = await uploadCover(coverFile);
    if (up.error) return NextResponse.json({ error: up.error }, { status: 400 });
    cover_image_url = up.url ?? null;
  }

  const { data: row, error: dbError } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      ...data,
      cover_image_url,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (dbError) {
    const duplicate = dbError.code === "23505";
    const badCategory = dbError.code === "23503";
    return NextResponse.json(
      {
        error: duplicate
          ? "Slug sudah dipakai, gunakan slug lain."
          : badCategory
          ? "Kategori tidak ditemukan."
          : dbError.message,
      },
      { status: duplicate ? 409 : badCategory ? 400 : 500 }
    );
  }

  return NextResponse.json({ id: row.id }, { status: 201 });
}
