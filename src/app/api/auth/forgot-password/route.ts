import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, email")
    .eq("email", email)
    .single();

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await supabaseAdmin
      .from("users")
      .update({ reset_token: token, reset_token_expires: expires.toISOString() })
      .eq("id", user.id);

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "ARCHITECT.DEV <onboarding@resend.dev>",
      to: email,
      subject: "Reset Password - ARCHITECT.DEV",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Permintaan Reset Password</h2>
          <p>Kami menerima permintaan untuk mereset password akun kamu. Klik tombol di bawah untuk melanjutkan. Link ini berlaku selama 1 jam.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7bd0ff;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">
            Reset Password
          </a>
          <p style="color:#888;font-size:12px;margin-top:24px;">Jika kamu tidak meminta ini, abaikan email ini.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ success: true });
}