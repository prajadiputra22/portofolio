import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { token, newPassword } = await request.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, reset_token_expires")
    .eq("reset_token", token)
    .single();

  if (!user || !user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
    return NextResponse.json({ error: "Link reset tidak valid atau sudah kedaluwarsa." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await supabaseAdmin
    .from("users")
    .update({
      password_hash: passwordHash,
      reset_token: null,
      reset_token_expires: null,
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}