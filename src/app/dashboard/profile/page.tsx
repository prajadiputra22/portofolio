import { supabaseAdmin } from "@/utils/supabase/admin";
import ManageProfileClient, { type Profile } from "./profileClient";

export default async function ManageProfilePage() {
  const { data: profile } = await supabaseAdmin
    .from("profile")
    .select("*")
    .eq("id", 1)
    .single<Profile>();

  return <ManageProfileClient initialProfile={profile} />;
}