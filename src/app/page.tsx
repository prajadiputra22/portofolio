import { supabaseAdmin } from "@/lib/supabase/admin";
import HomeClient, { type WorkItem } from "./HomeClient";

type RawSkill = { id: string; name: string; icon_url: string | null };
type RawWorkRow = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  project_url: string | null;
  repo_url: string | null;
  work_skills: { skills: RawSkill | RawSkill[] | null }[] | null;
};

async function getWorks(): Promise<WorkItem[]> {
  const { data, error } = await supabaseAdmin
    .from("works")
    .select(
      "id, title, description, cover_image_url, project_url, repo_url, created_at, work_skills(skills(id, name, icon_url))"
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as RawWorkRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.cover_image_url,
    projectUrl: row.project_url,
    repoUrl: row.repo_url,
    tags: (row.work_skills ?? [])
      .map((ws) => (Array.isArray(ws.skills) ? ws.skills[0] : ws.skills))
      .filter((skill): skill is RawSkill => Boolean(skill))
      .map((skill) => skill.name),
  }));
}

export default async function Page() {
  const works = await getWorks();
  const { data: profile } = await supabaseAdmin
    .from("profile")
    .select("*")
    .maybeSingle();

  const safeProfile = profile ?? {
    id: 0,
    full_name: "",
    hero_greeting: "",
    hero_headline: "Welcome To My Portfolio",
    bio: "",
    role_title: null,
    avatar_url: null,
    resume_url: null,
    location: null,
    phone: null,
    email: "",
    linkedin_url: null,
    github_url: null,
    instagram_url: null,
    updated_at: new Date().toISOString(),
  };
  return <HomeClient works={works} profile={safeProfile} />;
}