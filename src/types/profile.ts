export type Profile = {
  id: number;
  full_name: string;
  hero_greeting: string;
  hero_headline: string;
  bio: string;
  role_title: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  location: string | null;
  phone: string | null;
  email: string;
  linkedin_url: string | null;
  github_url: string | null;
  instagram_url: string | null;
  updated_at: string;
};