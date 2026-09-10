import { supabaseAdmin } from "@/lib/supabase/admin";
import ManageSkillsClient from "@/components/Manageskillsclient";
import DashboardShell from "@/components/Dashboardshell";
import type { Skill } from "@/types/skill";

async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabaseAdmin
    .from("skills")
    .select("id, name, icon_url, created_at")
    .order("name", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data skills:", error.message);
    return [];
  }

  return (data ?? []) as Skill[];
}

export default async function ManageSkills() {
  const skills = await getSkills();

  return (
    <DashboardShell title="Manage Skills">
      <ManageSkillsClient initialSkills={skills} />
    </DashboardShell>
  );
}