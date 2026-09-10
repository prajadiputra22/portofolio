import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    .update({ name, icon_url })
    .eq("id", id)
    .select("id, name, icon_url, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Gagal memperbarui skill." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/dashboard/skills");

  return NextResponse.json({ skill: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("skills").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Gagal menghapus skill." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/dashboard/skills");

  return NextResponse.json({ success: true });
}