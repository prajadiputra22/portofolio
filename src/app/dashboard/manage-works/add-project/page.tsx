"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const DESCRIPTION_MAX_LENGTH = 100;

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/manage-profile", label: "Manage Profile", icon: "person" },
  { href: "/dashboard/manage-works", label: "Manage Works", icon: "deployed_code" },
  { href: "/dashboard/manage-skills", label: "Manage Skills", icon: "terminal" },
  { href: "/dashboard/manage-blog", label: "Manage Blog", icon: "article" },
];

export default function AddProject() {
  const pathname = usePathname();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isWorksActive = pathname?.startsWith("/dashboard/manage-works");

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      setFileName(files[0].name);
      setSelectedFile(files[0]);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function resetDropZone() {
    setFileName(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("project_url", projectLink);
    formData.append("repo_url", githubLink);
    if (selectedFile) {
      formData.append("cover_image", selectedFile);
    }

    const res = await fetch("/api/works", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setErrorMessage(body.error ?? "Gagal menyimpan project. Coba lagi.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard/manage-works");
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {/* Persistent Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col z-50 transition-transform -translate-x-full md:translate-x-0">
        <div className="h-20 flex items-center px-6 border-b border-outline-variant/30">
          <div className="font-headline-md text-[20px] font-bold text-on-surface tracking-tight">
            ARCHITECT.DEV
          </div>
        </div>
        <nav className="flex-1 py-8 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const active =
              link.href === "/dashboard/manage-works" ? isWorksActive : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "flex items-center gap-3 px-6 py-3 sidebar-link-active transition-colors"
                    : "flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-colors"
                }
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span className={active ? "font-body-md font-semibold" : "font-body-md"}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-outline-variant/30">
          <button className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Resume
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 h-16 flex items-center justify-between px-6">
          <div className="font-headline-md text-body-lg font-bold text-on-surface">ARCHITECT.DEV</div>
          <button className="text-on-surface">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Header (Desktop) */}
        <header className="hidden md:flex h-20 px-margin-desktop items-center justify-between border-b border-outline-variant/30 sticky top-0 bg-background/95 backdrop-blur z-30">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">Add New Project</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Configure project details for the portfolio gallery.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard/manage-works"
              className="px-6 py-2 rounded-xl font-label-mono text-label-mono uppercase tracking-widest border border-outline-variant text-on-surface hover:bg-surface-variant/50 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
            >
              Cancel
            </Link>
            <button
              form="project-form"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl font-bold bg-secondary text-on-secondary-container hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary/50 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Project"}
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 w-full flex-1">
          {/* Mobile title (shown since desktop header is hidden on mobile) */}
          <div className="md:hidden mb-6">
            <h1 className="font-headline-md text-headline-md text-on-surface">Add New Project</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Configure project details for the portfolio gallery.
            </p>
          </div>

          <form id="project-form" className="space-y-8" onSubmit={handleSubmit}>
            {/* Bento Grid Layout for Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (Main Details) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Identity Card */}
                <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
                  <h2 className="font-body-lg text-body-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">edit_document</span>
                    Core Details
                  </h2>
                  <div className="space-y-5 relative z-10">
                    <div>
                      <label
                        className="block font-label-mono text-label-mono text-on-surface-variant mb-2 uppercase tracking-widest"
                        htmlFor="project-title"
                      >
                        Project Title
                      </label>
                      <input
                        id="project-title"
                        name="project-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Next.js Enterprise Architecture"
                        className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors font-body-md text-body-md placeholder:text-on-surface-variant/50"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest"
                          htmlFor="project-desc"
                        >
                          Short Description
                        </label>
                        <span className="font-caption text-caption text-on-surface-variant">
                          {description.length}/{DESCRIPTION_MAX_LENGTH}
                        </span>
                      </div>
                      <textarea
                        id="project-desc"
                        name="project-desc"
                        rows={4}
                        maxLength={DESCRIPTION_MAX_LENGTH}
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH))}
                        placeholder="Briefly describe..."
                        className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors font-body-md text-body-md placeholder:text-on-surface-variant/50 resize-y"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Media & Meta) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Image Upload Card */}
                <div className="glass-panel rounded-xl p-6 h-full flex flex-col">
                  <h2 className="font-body-lg text-body-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">image</span>
                    Cover Media
                  </h2>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                    className={
                      "flex-1 min-h-[200px] border-2 border-dashed rounded-lg bg-surface-container-high/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 group " +
                      (isDragging
                        ? "border-secondary bg-surface-variant/30"
                        : "border-outline-variant/50 hover:border-secondary/50 hover:bg-surface-variant/50")
                    }
                  >
                    {fileName ? (
                      <>
                        <div className="bg-secondary/10 p-3 rounded-full mb-4 shadow-sm text-secondary">
                          <span className="material-symbols-outlined text-3xl">check_circle</span>
                        </div>
                        <p className="font-body-md text-body-md text-secondary mb-1 truncate w-full px-4">
                          {fileName}
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant mb-4">Ready to upload</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetDropZone();
                          }}
                          className="px-4 py-1.5 rounded-lg font-label-mono text-label-mono text-[12px] uppercase tracking-wider bg-surface-container-highest border border-outline-variant/50 text-on-surface hover:text-error hover:border-error/50 transition-colors"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="bg-surface-container-highest p-3 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary text-3xl">
                            cloud_upload
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface mb-1">Drag and drop image here</p>
                        <p className="font-caption text-caption text-on-surface-variant mb-4">
                          or click to browse (PNG, JPG, WebP)
                        </p>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-lg font-label-mono text-label-mono text-[12px] uppercase tracking-wider bg-surface-container-highest border border-outline-variant/50 text-on-surface hover:text-secondary hover:border-secondary/50 transition-colors"
                        >
                          Select File
                        </button>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row (Links & Tech) */}
            <div className="grid grid-cols-1 gap-6">
              {/* URLs Card */}
              <div className="glass-panel rounded-xl p-6">
                <h2 className="font-body-lg text-body-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant">link</span>
                  Resources
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block font-label-mono text-label-mono text-on-surface-variant mb-2 uppercase tracking-widest"
                      htmlFor="project-link"
                    >
                      Live Project URL
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">public</span>
                      </span>
                      <input
                        id="project-link"
                        name="project-link"
                        type="url"
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        placeholder="https://"
                        className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-10 pr-4 py-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors font-body-md text-body-md placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block font-label-mono text-label-mono text-on-surface-variant mb-2 uppercase tracking-widest"
                      htmlFor="github-link"
                    >
                      Repository URL
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">code</span>
                      </span>
                      <input
                        id="github-link"
                        name="github-link"
                        type="url"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-10 pr-4 py-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors font-body-md text-body-md placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-caption text-red-400 text-center">{errorMessage}</p>
            )}

            {/* Mobile Actions (Sticky Bottom) */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full p-4 bg-surface-container-lowest/95 backdrop-blur border-t border-outline-variant/30 z-40 flex gap-4">
              <Link
                href="/dashboard/manage-works"
                className="flex-1 px-4 py-3 rounded-xl font-label-mono text-label-mono uppercase tracking-widest border border-outline-variant text-on-surface hover:bg-surface-variant/50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                form="project-form"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-secondary text-on-secondary-container hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] transition-all text-center flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}