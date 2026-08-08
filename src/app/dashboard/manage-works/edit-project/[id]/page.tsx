import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSkillsForWork } from "@/lib/works/skills";
import EditProjectForm from "./EditProjectForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  const { data: work, error } = await supabaseAdmin
    .from("works")
    .select("id, title, description, cover_image_url, project_url, repo_url")
    .eq("id", id)
    .maybeSingle();

  if (error || !work) {
    notFound();
  }

  const skills = await getSkillsForWork(work.id);

  return <EditProjectForm work={{ ...work, skills: skills.map((s) => s.name) }} />;
}