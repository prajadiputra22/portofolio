import { supabaseAdmin } from "@/lib/supabase/admin"; // <- sesuaikan dengan klien admin yang sudah kamu pakai di api/works

export const BLOG_BUCKET = "blog";
const MAX_COVER_BYTES = 5 * 1024 * 1024;

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export function parseBlogForm(fd: FormData) {
  const title = String(fd.get("title") ?? "").trim();
  const slug = slugify(String(fd.get("slug") ?? "") || title);
  const excerpt = String(fd.get("excerpt") ?? "").trim();
  const content = String(fd.get("content") ?? "");
  const category_id = String(fd.get("category_id") ?? "").trim();
  const featured = String(fd.get("featured") ?? "false") === "true";
  const status = String(fd.get("status") ?? "draft") === "published" ? "published" : "draft";

  let tags: string[] = [];
  try {
    const parsed = JSON.parse(String(fd.get("tags") ?? "[]"));
    if (Array.isArray(parsed)) {
      tags = parsed.map((t) => String(t).trim()).filter(Boolean).slice(0, 10);
    }
  } catch {
    /* abaikan, tags kosong */
  }

  const cover = fd.get("cover");
  const coverFile = cover instanceof File && cover.size > 0 ? cover : null;
  const removeCover = String(fd.get("remove_cover") ?? "false") === "true";

  let error: string | null = null;
  if (!title) error = "Judul wajib diisi.";
  else if (!slug) error = "Slug tidak valid.";
  else if (!category_id) error = "Kategori wajib dipilih.";
  else if (excerpt.length > 250) error = "Excerpt maksimal 250 karakter.";
  else if (status === "published" && !content.trim()) error = "Konten wajib diisi sebelum dipublikasikan.";

  return { data: { title, slug, excerpt, content, category_id, tags, featured, status }, coverFile, removeCover, error };
}

export async function uploadCover(file: File): Promise<{ url?: string; error?: string }> {
  if (!file.type.startsWith("image/")) return { error: "Cover harus berupa gambar." };
  if (file.size > MAX_COVER_BYTES) return { error: "Ukuran cover maksimal 5 MB." };

  const ext = (file.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BLOG_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };

  const { data } = supabaseAdmin.storage.from(BLOG_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

/** Hapus file lama di storage berdasarkan URL publiknya. */
export async function removeCoverByUrl(url: string | null | undefined) {
  if (!url) return;
  const marker = `/object/public/${BLOG_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  await supabaseAdmin.storage.from(BLOG_BUCKET).remove([path]);
}
