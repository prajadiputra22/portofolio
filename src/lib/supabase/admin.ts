import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// PENTING:
// - File ini HANYA boleh diimport dari API routes / server actions (server-side).
// - JANGAN PERNAH import file ini dari komponen client ("use client") — service
//   role key akan ter-bundle ke browser dan bocor ke publik kalau itu terjadi.
// - Service role key bypass RLS sepenuhnya, jadi treat this like a root password.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});