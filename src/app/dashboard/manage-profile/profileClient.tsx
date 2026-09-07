"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const sidebarNav = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "person", label: "Manage Profile", href: "/dashboard/manage-profile" },
  { icon: "work", label: "Manage Works", href: "/dashboard/manage-works" },
  { icon: "psychology", label: "Manage Skills", href: "/dashboard/manage-skills" },
  { icon: "rss_feed", label: "Manage Blog", href: "/dashboard/manage-blog" },
];

const BIO_MAX = 500;

type SaveStatus = "idle" | "saving" | "success" | "error";
type UploadStatus = "idle" | "uploading" | "error";

function Sidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-4 px-6 py-8 text-white">
        <div className="size-6 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          Admin Console
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {sidebarNav.map((item) => {
          const isActive =
            item.href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-3 px-3 py-2 rounded bg-primary/10 text-primary font-bold"
                  : "flex items-center gap-3 px-3 py-2 rounded text-on-surface-variant hover:bg-[#2b3140] hover:text-white transition-colors"
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {mobile ? null : (
        <div className="p-4 border-t border-[#2b3140]">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded text-on-surface-variant hover:bg-[#2b3140] hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            View Live Site
          </a>
        </div>
      )}
    </>
  );
}

export default function ManageProfileClient({
  initialProfile,
}: {
  initialProfile: Profile | null;
}) {
  const emptyProfile: Profile = {
    id: 1,
    full_name: "",
    hero_greeting: "",
    hero_headline: "",
    bio: "",
    role_title: "",
    avatar_url: null,
    resume_url: "",
    location: "",
    phone: "",
    email: "",
    linkedin_url: "",
    github_url: "",
    instagram_url: "",
    updated_at: new Date().toISOString(),
  };

  const [profile, setProfile] = useState<Profile>(initialProfile ?? emptyProfile);
  const [savedProfile, setSavedProfile] = useState<Profile>(initialProfile ?? emptyProfile);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  const updateField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiscard = () => {
    setProfile(savedProfile);
  };

  const handleSave = async () => {
    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan perubahan.");
      }

      setProfile(result.profile);
      setSavedProfile(result.profile);
      setSaveStatus("success");
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadStatus("error");
      setErrorMessage("Ukuran foto maksimal 2MB.");
      setTimeout(() => setUploadStatus("idle"), 2500);
      return;
    }

    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mengunggah foto.");
      }

      updateField("avatar_url", result.avatar_url);
      setSavedProfile((prev) => ({ ...prev, avatar_url: result.avatar_url }));
      setUploadStatus("idle");
    } catch (err) {
      setUploadStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setTimeout(() => setUploadStatus("idle"), 2500);
    }
  };

  const bioLength = profile.bio?.length ?? 0;

  return (
    <div
      className="relative flex h-screen w-full bg-[#15181e] dark overflow-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-full w-64 flex-col border-r border-[#2b3140] bg-[#101415] shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Drawer + Overlay */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] flex flex-col bg-[#101415] border-r border-[#2b3140] shadow-2xl transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-6 right-4 text-on-surface-variant hover:text-white"
            onClick={() => setIsDrawerOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <Sidebar mobile onNavigate={() => setIsDrawerOpen(false)} />
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-8 h-16 border-b border-[#2b3140] bg-[#101415]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex items-center justify-center rounded h-9 w-9 bg-[#2b3140] text-white hover:bg-[#32384a] transition-colors"
              onClick={() => setIsDrawerOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <span className="font-bold text-white text-sm md:text-base">Manage Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center justify-center rounded h-9 w-9 bg-[#2b3140] text-white hover:bg-[#32384a] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </header>

        <main className="flex flex-col gap-8 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
          <div>
            <h1 className="text-on-surface text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Manage Profile
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base mt-2 max-w-2xl">
              Refine your professional identity. These details are pulled directly into your
              public portfolio — the hero section, contact card, and footer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column: photo + status */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 md:p-8 flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-6" onClick={handlePhotoClick}>
                  <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-outline-variant/30 group-hover:border-secondary transition-colors bg-surface-container-high">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || "Profile Photo"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-5xl">person</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity rounded-full">
                    {uploadStatus === "uploading" ? (
                      <span className="material-symbols-outlined text-secondary text-3xl animate-spin">
                        sync
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-secondary text-3xl">
                        photo_camera
                      </span>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  disabled={uploadStatus === "uploading"}
                  className="text-secondary font-mono text-xs uppercase tracking-widest hover:underline underline-offset-4 mb-2 disabled:opacity-50"
                >
                  {uploadStatus === "uploading" ? "Uploading..." : "Change Photo"}
                </button>
                <p className="text-xs text-on-surface-variant">JPG, PNG or WebP. Max 2MB.</p>
                {uploadStatus === "error" && (
                  <p className="text-xs text-error mt-2">{errorMessage}</p>
                )}
              </div>

              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 md:p-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
                  Live Site Preview
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-on-surface-variant">Hero Greeting</span>
                    <span className="text-on-surface font-bold text-right">
                      HI, I&apos;M {profile.hero_greeting || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-4 pt-4 border-t border-outline-variant/20">
                    <span className="text-on-surface-variant">Last Updated</span>
                    <span className="text-on-surface font-bold text-right">
                      {new Date(profile.updated_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-4 pt-4 border-t border-outline-variant/20">
                    <span className="text-on-surface-variant">Visibility</span>
                    <span className="flex items-center gap-2 text-on-surface font-bold">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      Public
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: form */}
            <div className="lg:col-span-8">
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 md:p-10 space-y-8">
                {/* Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                      value={profile.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      placeholder="e.g. Darmawan Suka Prajadiputra"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                      Hero Greeting Name
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                      value={profile.hero_greeting}
                      onChange={(e) => updateField("hero_greeting", e.target.value.toUpperCase())}
                      placeholder="e.g. DARMAWAN"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                      Hero Headline
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                      value={profile.hero_headline}
                      onChange={(e) => updateField("hero_headline", e.target.value)}
                      placeholder="e.g. Welcome To My Portfolio"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                      Role / Title
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                      value={profile.role_title ?? ""}
                      onChange={(e) => updateField("role_title", e.target.value)}
                      placeholder="e.g. Software Developer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                    Location
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                      location_on
                    </span>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 pl-12 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                      value={profile.location ?? ""}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="e.g. Sukabumi City, West Java, Indonesia"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                    Hero Bio
                  </label>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg resize-none focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                    rows={5}
                    maxLength={BIO_MAX}
                    value={profile.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="A short paragraph describing what you do..."
                  />
                  <div className="flex justify-end">
                    <span className="text-xs text-on-surface-variant">
                      {bioLength} / {BIO_MAX} characters
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-6 border-t border-outline-variant/20">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                        value={profile.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                        Phone Number
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                        value={profile.phone ?? ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+62 8xx xxxx xxxx"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant block">
                      Resume Link
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 p-4 text-on-surface rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                      value={profile.resume_url ?? ""}
                      onChange={(e) => updateField("resume_url", e.target.value)}
                      placeholder="https://... (PDF resume link)"
                    />
                  </div>
                </div>

                {/* Social Integrations */}
                <div className="pt-6 border-t border-outline-variant/20">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
                    Social Integrations
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: "linkedin_url" as const, icon: "work", label: "LinkedIn" },
                      { key: "github_url" as const, icon: "code", label: "GitHub" },
                      { key: "instagram_url" as const, icon: "photo_camera", label: "Instagram" },
                    ].map((social) => (
                      <div
                        key={social.key}
                        className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant shrink-0">
                          {social.icon}
                        </span>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm text-on-surface mb-1">{social.label}</p>
                          <input
                            className="w-full bg-transparent text-sm text-on-surface-variant focus:outline-none focus:text-on-surface"
                            value={profile[social.key] ?? ""}
                            onChange={(e) => updateField(social.key, e.target.value)}
                            placeholder={`https://...`}
                          />
                        </div>
                        {profile[social.key] ? (
                          <button
                            type="button"
                            onClick={() => updateField(social.key, "")}
                            className="text-on-surface-variant hover:text-error transition-colors shrink-0"
                          >
                            <span className="material-symbols-outlined text-[20px]">link_off</span>
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                {saveStatus === "error" && (
                  <p className="text-sm text-error text-center">{errorMessage}</p>
                )}

                {/* Actions */}
                <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    disabled={!isDirty || saveStatus === "saving"}
                    className="text-on-surface-variant hover:text-on-surface font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isDirty || saveStatus === "saving"}
                    className={`w-full sm:w-auto px-10 py-4 rounded-lg font-bold tracking-tight transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${
                      saveStatus === "success"
                        ? "bg-tertiary-container text-secondary"
                        : "bg-secondary text-on-secondary shadow-secondary/10 hover:brightness-110"
                    }`}
                  >
                    {saveStatus === "saving" && (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Saving...
                      </>
                    )}
                    {saveStatus === "success" && (
                      <>
                        <span className="material-symbols-outlined">done_all</span>
                        Changes Saved
                      </>
                    )}
                    {(saveStatus === "idle" || saveStatus === "error") && (
                      <>
                        Save Changes
                        <span className="material-symbols-outlined">check_circle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}