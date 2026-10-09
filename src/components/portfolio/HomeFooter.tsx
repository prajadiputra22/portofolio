import type { Profile } from "@/types/profile";

type HomeFooterProps = Pick<
  Profile,
  "full_name" | "linkedin_url" | "github_url" | "instagram_url"
>;

export default function HomeFooter({ profile }: { profile: HomeFooterProps }) {
  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-lowest py-8 md:py-10">
      <div className="flex flex-col items-center justify-between gap-3 px-margin-mobile md:flex-row md:gap-4 md:px-margin-desktop">
        <span className="text-center font-label-mono text-[11px] uppercase text-secondary md:text-label-mono">
          {profile.full_name}
        </span>
        <p className="text-center font-caption text-caption text-on-surface-variant opacity-80 transition-all hover:opacity-100">
          © {new Date().getFullYear()} {profile.full_name}.
        </p>
        <div className="flex gap-4 md:gap-6">
          {profile.linkedin_url && (
            <a
              className="font-caption text-caption text-on-surface-variant underline decoration-secondary/30 transition-all hover:text-secondary"
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}
          {profile.github_url && (
            <a
              className="font-caption text-caption text-on-surface-variant underline decoration-secondary/30 transition-all hover:text-secondary"
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {profile.instagram_url && (
            <a
              className="font-caption text-caption text-on-surface-variant underline decoration-secondary/30 transition-all hover:text-secondary"
              href={profile.instagram_url}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
