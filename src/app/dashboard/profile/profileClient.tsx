"use client";

import { useRef, useState } from "react";
import DashboardShell from "@/components/Dashboardshell";

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

const BIO_MAX = 500;

type SaveStatus = "idle" | "saving" | "success" | "error";
type UploadStatus = "idle" | "uploading" | "error";

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
    <DashboardShell title="Manage Profile">
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
                        <AppIcon name="person" className="text-5xl" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity rounded-full">
                    {uploadStatus === "uploading" ? (
                      <AppIcon name="sync" className="text-secondary text-3xl animate-spin" />
                    ) : (
                      <AppIcon name="photo_camera" className="text-secondary text-3xl" />
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">
                      <AppIcon name="location_on" className="text-on-surface-variant text-[20px]" />
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
                      { key: "linkedin_url" as const, icon: "work" as const, label: "LinkedIn" },
                      { key: "github_url" as const, icon: "code" as const, label: "GitHub" },
                      { key: "instagram_url" as const, icon: "photo_camera" as const, label: "Instagram" },
                    ].map((social) => (
                      <div
                        key={social.key}
                        className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20"
                      >
                        <AppIcon name={social.icon} className="text-on-surface-variant shrink-0" />
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
                            <AppIcon name="link_off" className="text-[20px]" />
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
                    <AppIcon name="restart_alt" className="text-[18px]" />
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
                        <AppIcon name="sync" className="animate-spin" />
                        Saving...
                      </>
                    )}
                    {saveStatus === "success" && (
                      <>
                        <AppIcon name="done_all" />
                        Changes Saved
                      </>
                    )}
                    {(saveStatus === "idle" || saveStatus === "error") && (
                      <>
                        Save Changes
                        <AppIcon name="check_circle" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
    </DashboardShell>
  );
}