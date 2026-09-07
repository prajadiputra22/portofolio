import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  getSkillsForWork,
  linkSkillsToWork,
  parseSkillNames,
  unlinkAllSkillsFromWork,
} from "@/lib/works/skills";

const DESCRIPTION_MAX_LENGTH = 100;
const BUCKET_NAME = "works";

type RouteParams = { params: Promise<{ id: string }> };

// GET
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("works")
    .select("id, title, description, cover_image_url, project_url, repo_url, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
  }

  const skills = await getSkillsForWork(id);

  return NextResponse.json({ work: { ...data, skills } });
}

// PUT
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const projectUrl = formData.get("project_url");
  const repoUrl = formData.get("repo_url");
  const file = formData.get("cover_image");
  const skillNames = parseSkillNames(formData);

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

  const { data: existingWork, error: fetchError } = await supabaseAdmin
    .from("works")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  if (fetchError || !existingWork) {
    return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
  }

  let coverImageUrl: string | null = existingWork.cover_image_url;

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

  const { data: work, error: updateError } = await supabaseAdmin
    .from("works")
    .update({
      title: title.trim(),
      description: description.trim(),
      cover_image_url: coverImageUrl,
      project_url: typeof projectUrl === "string" && projectUrl ? projectUrl : null,
      repo_url: typeof repoUrl === "string" && repoUrl ? repoUrl : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError || !work) {
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan. Coba lagi." },
      { status: 500 }
    );
  }

  try {
    
    await unlinkAllSkillsFromWork(id);
    await linkSkillsToWork(id, skillNames);
  } catch {
    revalidatePath("/");
    revalidatePath("/dashboard/manage-works");

    return NextResponse.json({
      success: true,
      work,
      warning: "Perubahan tersimpan, tapi sebagian skill gagal disimpan.",
    });
  }
  revalidatePath("/");
  revalidatePath("/dashboard/manage-works");

  return NextResponse.json({ success: true, work });
}
