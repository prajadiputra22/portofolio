import { supabaseAdmin } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";
import HomeClient, { type BlogItem, type WorkItem } from "./HomeClient";

type RawSkill = { id: string; name: string; icon_url: string | null };
type RawBlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category: { name: string } | { name: string }[] | null;
};
type RawWorkRow = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  project_url: string | null;
  repo_url: string | null;
  work_skills: { skills: RawSkill | RawSkill[] | null }[] | null;
};

export const revalidate = 60;

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

const getCachedWorks = unstable_cache(getWorks, ["portfolio-works"], {
  revalidate: 60,
  tags: ["portfolio-works"],
});

async function getBlogs(): Promise<BlogItem[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, category:blog_categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  if (error || !data) return [];

  return (data as unknown as RawBlogRow[]).map((row) => {
    const category = Array.isArray(row.category) ? row.category[0] : row.category;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      coverImageUrl: row.cover_image_url,
      category: category?.name ?? null,
    };
  });
}

const getCachedBlogs = unstable_cache(getBlogs, ["portfolio-blog"], {
  revalidate: 60,
  tags: ["portfolio-blog"],
});

const getCachedProfile = unstable_cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("profile")
      .select(
        "id, full_name, hero_greeting, hero_headline, bio, role_title, avatar_url, resume_url, location, phone, email, linkedin_url, github_url, instagram_url, updated_at"
      )
      .maybeSingle();

    if (error) return null;
    return data;
  },
  ["portfolio-profile"],
  { revalidate: 60, tags: ["portfolio-profile"] }
);

export default async function Page() {
  const [works, blogs, profile] = await Promise.all([
    getCachedWorks(),
    getCachedBlogs(),
    getCachedProfile(),
  ]);

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
  return <HomeClient works={works} blogs={blogs} profile={safeProfile} />;
}