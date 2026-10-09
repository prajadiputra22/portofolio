"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/AppIcon";
import { renderMarkdown } from "@/lib/blog/markdown";
import type { BlogCategory, BlogPostRow, PostStatus } from "@/types/blog";

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function BlogForm({ postId }: { postId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(postId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState<null | "save" | "publish" | "unpublish" | "delete">(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryBusy, setCategoryBusy] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState(false);

  const [status, setStatus] = useState<PostStatus>("draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [views, setViews] = useState(0);

  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Muat data saat mode edit
  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/blog/${postId}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal memuat post.");
        if (cancelled) return;
        const p: BlogPostRow = json.post;
        setTitle(p.title);
        setSlug(p.slug);
        setSlugTouched(true);
        setExcerpt(p.excerpt);
        setContent(p.content);
        setCategoryId(p.category_id);
        setTags(p.tags ?? []);
        setFeatured(p.featured);
        setStatus(p.status);
        setPublishedAt(p.published_at);
        setUpdatedAt(p.updated_at);
        setViews(p.views);
        setCoverUrl(p.cover_image_url);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Gagal memuat post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  // Muat daftar kategori
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/blog/categories", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal memuat kategori.");
        setCategories(json.categories);
        if (!postId && json.categories.length) setCategoryId((cur) => cur || json.categories[0].id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat kategori.");
      }
    })();
  }, [postId]);

  async function createCategory() {
    const name = newCategory.trim();
    if (!name) return setAddingCategory(false);
    setCategoryBusy(true);
    try {
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal membuat kategori.");
      const created: BlogCategory = json.category;
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryId(created.id);
      setNewCategory("");
      setAddingCategory(false);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat kategori.");
    } finally {
      setCategoryBusy(false);
    }
  }

  // Slug otomatis dari judul selama belum diedit manual
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  // Bersihkan object URL preview cover
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const words = useMemo(() => (content.trim() ? content.trim().split(/\s+/).length : 0), [content]);
  const readMin = Math.max(1, Math.ceil(words / 200));
  const html = useMemo(() => (showPreview ? renderMarkdown(content) : ""), [showPreview, content]);
  const shownCover = coverPreview ?? (removeCover ? null : coverUrl);
  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${slug || "..."}`;

  // ---------- Toolbar markdown ----------
  function applyEdit(fn: (sel: string) => { text: string; select?: [number, number] }) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const { text, select } = fn(content.slice(s, e));
    const next = content.slice(0, s) + text + content.slice(e);
    setContent(next);
    setShowPreview(false);
    requestAnimationFrame(() => {
      el.focus();
      const [a, b] = select ?? [s + text.length, s + text.length];
      el.setSelectionRange(s + a, s + b);
    });
  }

  const wrap = (before: string, after: string, placeholder: string) =>
    applyEdit((sel) => {
      const body = sel || placeholder;
      return { text: before + body + after, select: [before.length, before.length + body.length] };
    });

  const linePrefix = (prefix: string, placeholder: string) =>
    applyEdit((sel) => {
      const body = (sel || placeholder).split("\n").map((l) => prefix + l).join("\n");
      return { text: (content && !content.endsWith("\n") ? "\n" : "") + body };
    });

  const codeBlock = () =>
    applyEdit((sel) => {
      const body = sel || "// code here";
      return { text: "\n```ts\n" + body + "\n```\n" };
    });

  const toolbar: { title: string; icon?: string; label?: string; run: () => void; active?: boolean }[] = [
    { title: "Bold", icon: "format_bold", run: () => wrap("**", "**", "bold text") },
    { title: "Italic", icon: "format_italic", run: () => wrap("*", "*", "italic text") },
    { title: "Heading 1", label: "H1", run: () => linePrefix("# ", "Heading") },
    { title: "Heading 2", label: "H2", run: () => linePrefix("## ", "Heading") },
    { title: "Heading 3", label: "H3", run: () => linePrefix("### ", "Heading") },
    { title: "Code Block", icon: "code_blocks", run: codeBlock },
    { title: "Blockquote", icon: "format_quote", run: () => linePrefix("> ", "Quote") },
    { title: "Bullet List", icon: "format_list_bulleted", run: () => linePrefix("- ", "List item") },
    { title: "Link", icon: "link", run: () => wrap("[", "](https://)", "link text") },
    { title: "Insert Image", icon: "image", run: () => wrap("![", "](https://)", "alt text") },
  ];

  // ---------- Tags ----------
  function addTag() {
    const t = tagInput.trim().replace(/,$/, "");
    if (!t || tags.some((x) => x.toLowerCase() === t.toLowerCase()) || tags.length >= 10) {
      setTagInput("");
      return;
    }
    setTags([...tags, t]);
    setTagInput("");
  }

  // ---------- Cover ----------
  function onPickCover(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Cover harus berupa gambar.");
    if (file.size > 5 * 1024 * 1024) return setError("Ukuran cover maksimal 5 MB.");
    setError("");
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setRemoveCover(false);
  }

  function onRemoveCover() {
    setCoverFile(null);
    setCoverPreview(null);
    setRemoveCover(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ---------- Submit ----------
  async function submit(nextStatus: PostStatus, action: "save" | "publish" | "unpublish") {
    setError("");
    if (!title.trim()) return setError("Judul wajib diisi.");
    if (!categoryId) return setError("Kategori wajib dipilih.");
    if (excerpt.length > 250) return setError("Excerpt maksimal 250 karakter.");
    if (nextStatus === "published" && !content.trim()) return setError("Konten wajib diisi sebelum dipublikasikan.");

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("slug", slug);
    fd.set("excerpt", excerpt);
    fd.set("content", content);
    fd.set("category_id", categoryId);
    fd.set("tags", JSON.stringify(tags));
    fd.set("featured", String(featured));
    fd.set("status", nextStatus);
    fd.set("remove_cover", String(removeCover));
    if (coverFile) fd.set("cover", coverFile);

    setSaving(action);
    try {
      const res = await fetch(isEdit ? `/api/blog/${postId}` : "/api/blog", {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan post.");
      router.push("/dashboard/blog");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan post.");
      setSaving(null);
    }
  }

  async function handleDelete() {
    if (!postId || !confirm("Hapus post ini secara permanen?")) return;
    setSaving("delete");
    const res = await fetch(`/api/blog/${postId}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Gagal menghapus post.");
      setSaving(null);
      return;
    }
    router.push("/dashboard/blog");
    router.refresh();
  }

  const busy = saving !== null;
  const published = status === "published";

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-on-surface-variant font-label-mono text-label-mono py-24 justify-center">
        <AppIcon name="progress_activity" className="animate-spin" />
        LOADING POST...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard/blog"
            className="inline-flex items-center gap-1.5 font-label-mono text-label-mono text-secondary hover:text-secondary-fixed transition-colors w-fit"
          >
            <AppIcon name="arrow_back" className="text-[18px] size-[18px]" />
            Back to Blog Posts
          </Link>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {isEdit ? "Edit Blog Post" : "New Blog Post"}
            </h1>
            {isEdit && postId && (
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-mono text-caption uppercase tracking-wider">
                ID: {postId.slice(0, 8)}
              </span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isEdit
              ? "Update article content, metadata, and publishing settings."
              : "Write a new article, then save it as a draft or publish it."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            disabled={busy}
            onClick={() => router.push("/dashboard/blog")}
            className="px-3.5 py-2 rounded bg-surface-container text-error hover:bg-error-container hover:text-on-error-container transition-colors text-caption uppercase tracking-wider font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <AppIcon name="close" className="size-[18px]" />
            Discard Changes
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => submit(status, "save")}
            className="px-4 py-2 rounded bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors text-caption uppercase tracking-wider font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <AppIcon name={saving === "save" ? "progress_activity" : "save"} className={`size-[18px] ${saving === "save" ? "animate-spin" : ""}`} />
            {published ? "Save Changes" : "Save Draft"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => submit("published", "publish")}
            className="px-5 py-2 rounded bg-secondary text-on-secondary-fixed text-caption uppercase tracking-wider font-bold hover:bg-secondary-fixed transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <AppIcon name={saving === "publish" ? "progress_activity" : "publish"} className={`size-[18px] ${saving === "publish" ? "animate-spin" : ""}`} />
            {isEdit && published ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex items-center gap-2 rounded bg-error-container text-on-error-container px-4 py-3 text-sm">
          <AppIcon name="warning" className="size-[18px] shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: editor */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-6 shadow-sm">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="post-title" className="font-label-mono text-caption text-secondary uppercase tracking-wider flex items-center justify-between">
                <span>Post Title</span>
                <span className="text-on-surface-variant lowercase">required</span>
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Write a clear, specific title..."
                className="w-full bg-surface-container text-on-surface font-headline-md text-headline-md px-4 py-3 rounded outline-none focus:bg-surface-container-high transition-colors"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-surface-container rounded">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <AppIcon name="link" className="text-secondary size-[18px] shrink-0" />
                <span className="font-label-mono text-caption text-on-surface-variant shrink-0">SLUG:</span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  aria-label="Slug"
                  className="font-label-mono text-caption text-secondary bg-transparent outline-none min-w-0 flex-1 truncate"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-mono text-caption">
                  <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-secondary" : "bg-outline"}`} />
                  {published ? "LIVE" : "DRAFT"}
                </span>
                <button
                  type="button"
                  title="Copy URL"
                  onClick={() => navigator.clipboard?.writeText(publicUrl)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
                >
                  <AppIcon name="content_copy" className="size-[18px]" />
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="post-excerpt" className="font-label-mono text-caption text-secondary uppercase tracking-wider">
                  Short Excerpt / Summary
                </label>
                <span className={`font-label-mono text-caption ${excerpt.length > 250 ? "text-error" : "text-on-surface-variant"}`}>
                  {excerpt.length} / 250
                </span>
              </div>
              <textarea
                id="post-excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-surface-container text-on-surface font-body-md text-body-md p-3 rounded outline-none focus:bg-surface-container-high transition-colors resize-none"
              />
            </div>

            {/* Editor */}
            <div className="flex flex-col rounded bg-surface-container overflow-hidden">
              <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-container-high text-on-surface-variant font-label-mono">
                {toolbar.map((t, i) => (
                  <span key={t.title} className="contents">
                    {(i === 2 || i === 5 || i === 8) && <div className="w-px h-5 bg-surface-container mx-1" />}
                    <button
                      type="button"
                      title={t.title}
                      onClick={t.run}
                      disabled={showPreview}
                      className="w-8 h-8 rounded hover:bg-surface-bright hover:text-on-surface flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                      {t.icon ? (
                        <AppIcon name={t.icon as never} className="size-[18px]" />
                      ) : (
                        <span className="font-label-mono text-[13px] font-bold">{t.label}</span>
                      )}
                    </button>
                  </span>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-caption font-label-mono text-on-surface-variant pr-2 hidden sm:inline">MARKDOWN SUPPORTED</span>
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className="px-2.5 py-1 rounded bg-surface-container text-caption font-label-mono text-secondary hover:bg-surface-bright flex items-center gap-1 transition-colors"
                  >
                    <AppIcon name={showPreview ? "edit" : "visibility"} className="size-4" />
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div
                  className="p-6 flex flex-col gap-4 font-body-md text-body-md text-on-surface leading-relaxed min-h-[380px]"
                  dangerouslySetInnerHTML={{
                    __html: html || '<p class="text-on-surface-variant italic">Nothing to preview yet.</p>',
                  }}
                />
              ) : (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing in Markdown..."
                  spellCheck
                  className="p-6 bg-transparent text-on-surface font-label-mono text-[14px] leading-relaxed min-h-[380px] outline-none resize-y w-full"
                />
              )}

              <div className="p-3 bg-surface-container-low flex flex-wrap items-center justify-between gap-2 text-caption font-label-mono text-on-surface-variant">
                <div className="flex items-center gap-3">
                  <span>{words.toLocaleString()} words</span>
                  <span>•</span>
                  <span>{readMin} min read</span>
                </div>
                {isEdit && updatedAt && (
                  <div className="flex items-center gap-1.5">
                    <AppIcon name="check_circle" className="size-[15px] text-secondary" />
                    <span>Last saved {fmtDate(updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Cover */}
          <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-caption uppercase tracking-wider text-secondary font-semibold">Cover Image</h2>
              <span className="font-label-mono text-caption text-on-surface-variant">16:9 RATIO</span>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPickCover(e.target.files?.[0])}
            />

            {shownCover ? (
              <div className="relative group rounded-lg overflow-hidden bg-surface-container h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shownCover} alt="Cover preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-surface-dim/70 backdrop-blur-xs flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-1.5 rounded bg-secondary text-on-secondary-fixed font-label-mono text-caption font-semibold flex items-center gap-1.5 hover:bg-secondary-fixed transition-colors"
                  >
                    <AppIcon name="swap_horiz" className="size-4" />
                    Change Image
                  </button>
                  <button
                    type="button"
                    title="Remove Cover"
                    onClick={onRemoveCover}
                    className="p-1.5 rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"
                  >
                    <AppIcon name="delete" className="size-[18px]" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="h-44 rounded-lg bg-surface-container border border-dashed border-outline-variant hover:border-secondary hover:text-secondary text-on-surface-variant flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <AppIcon name="cloud_upload" className="size-6" />
                <span className="font-label-mono text-caption">UPLOAD COVER IMAGE</span>
              </button>
            )}

            <div className="flex items-center justify-between text-caption font-label-mono text-on-surface-variant px-1">
              <span className="truncate">{coverFile ? coverFile.name : shownCover ? "current cover" : "no image selected"}</span>
              {coverFile && <span>{Math.round(coverFile.size / 1024)} KB</span>}
            </div>
          </div>

          {/* Taxonomy */}
          <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-5 shadow-sm">
            <h2 className="text-caption uppercase tracking-wider text-secondary font-semibold">Organization &amp; Taxonomy</h2>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="post-category" className="font-label-mono text-caption text-on-surface-variant">CATEGORY</label>
                <button
                  type="button"
                  onClick={() => setAddingCategory((v) => !v)}
                  className="font-label-mono text-caption text-secondary hover:text-secondary-fixed transition-colors"
                >
                  {addingCategory ? "CANCEL" : "+ NEW"}
                </button>
              </div>
              {addingCategory ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        createCategory();
                      }
                    }}
                    maxLength={80}
                    placeholder="Category name..."
                    className="flex-1 min-w-0 bg-surface-container text-on-surface text-caption py-2.5 px-3 rounded outline-none focus:bg-surface-container-high"
                  />
                  <button
                    type="button"
                    disabled={categoryBusy}
                    onClick={createCategory}
                    className="px-3 rounded bg-secondary text-on-secondary-fixed font-label-mono text-caption font-semibold hover:bg-secondary-fixed transition-colors disabled:opacity-50"
                  >
                    {categoryBusy ? "..." : "ADD"}
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    id="post-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-surface-container text-on-surface text-caption py-2.5 px-3 rounded appearance-none outline-none focus:bg-surface-container-high cursor-pointer"
                  >
                    {categories.length === 0 && <option value="">No categories yet</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-surface-container-lowest">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <AppIcon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none size-[18px]" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="post-tag" className="font-label-mono text-caption text-on-surface-variant">TAGS</label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded bg-surface-container min-h-[46px] items-center">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-secondary font-label-mono text-caption">
                    {t}
                    <button type="button" aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-error transition-colors flex items-center">
                      <AppIcon name="close" className="size-[14px]" />
                    </button>
                  </span>
                ))}
                <input
                  id="post-tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    } else if (e.key === "Backspace" && !tagInput && tags.length) {
                      setTags(tags.slice(0, -1));
                    }
                  }}
                  onBlur={addTag}
                  placeholder="+ add tag..."
                  className="bg-transparent text-caption font-label-mono text-on-surface outline-none px-2 py-0.5 w-24 placeholder:text-on-surface-variant"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-surface-container">
              <div className="flex flex-col">
                <span className="text-caption uppercase text-on-surface font-semibold">Featured Post</span>
                <span className="text-[11px] text-on-surface-variant">Promote on homepage showcase</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                aria-label="Featured post"
                onClick={() => setFeatured((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${featured ? "bg-secondary" : "bg-surface-container-highest"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all ${
                    featured ? "right-1 bg-on-secondary-fixed" : "left-1 bg-outline"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4 shadow-sm">
            <h2 className="text-caption uppercase tracking-wider text-secondary font-semibold">Publication Status &amp; Stats</h2>
            <div className="flex flex-col gap-3 text-caption">
              <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-mono font-semibold">
                  <span className={`w-2 h-2 rounded-full ${published ? "bg-secondary" : "bg-outline"}`} />
                  {published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Published Date</span>
                <span className="font-label-mono text-on-surface">{fmtDate(publishedAt)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Total Views</span>
                <div className="flex items-center gap-1 font-label-mono text-secondary font-semibold">
                  <AppIcon name="visibility" className="size-4" />
                  {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views} views
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Author</span>
                <span className="font-label-mono text-on-surface">Darmawan</span>
              </div>
            </div>

            {isEdit && published && (
              <button
                type="button"
                disabled={busy}
                onClick={() => submit("draft", "unpublish")}
                className="mt-2 w-full py-2.5 rounded bg-surface-container text-on-surface-variant hover:text-error hover:bg-surface-container-high font-label-mono text-caption uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <AppIcon name="unpublish" className="size-4" />
                Unpublish to Draft
              </button>
            )}
            {isEdit && (
              <button
                type="button"
                disabled={busy}
                onClick={handleDelete}
                className="w-full py-2.5 rounded bg-surface-container text-error hover:bg-error-container hover:text-on-error-container font-label-mono text-caption uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <AppIcon name="delete" className="size-4" />
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
