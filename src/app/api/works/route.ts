import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const DESCRIPTION_MAX_LENGTH = 100;
const BUCKET_NAME = "works";

export async function POST(request: Request) {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const projectUrl = formData.get("project_url");
  const repoUrl = formData.get("repo_url");
  const file = formData.get("cover_image");

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Judul project wajib diisi." }, { status: 400 });
  }

  if (typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Deskripsi singkat wajib diisi." }, { status: 400 });
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return NextResponse.json(
      { error: `Deskripsi maksimal ${DESCRIPTION_MAX_LENGTH} karakter.` },
      { status: 400 }
    );
  }

  let coverImageUrl: string | null = null;

  // Upload gambar ke Supabase Storage kalau ada file yang dikirim
  if (file instanceof File && file.size > 0) {
    const fileExt = file.name.split(".").pop() ?? "jpg";
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Gagal mengunggah gambar. Coba lagi." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    coverImageUrl = publicUrlData.publicUrl;
  }

  const { data: work, error: insertError } = await supabaseAdmin
    .from("works")
    .insert({
      title: title.trim(),
      description: description.trim(),
      cover_image_url: coverImageUrl,
      project_url: typeof projectUrl === "string" && projectUrl ? projectUrl : null,
      repo_url: typeof repoUrl === "string" && repoUrl ? repoUrl : null,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Gagal menyimpan project. Coba lagi." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, work });
}