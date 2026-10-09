import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/AppIcon";
import {
  ArticleReadingProgress,
  ArticleShareActions,
} from "@/components/blog/ArticleControls";
import HomeFooter from "@/components/portfolio/HomeFooter";
import HomeHeader from "@/components/portfolio/HomeHeader";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { renderMarkdown } from "@/lib/blog/markdown";

export const revalidate = 60;

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type RecommendedBlog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  published_at: string | null;
  category: { name: string } | { name: string }[] | null;
};

function formatDate(date: string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const [
    { data: post, error: postError },
    { data: profile, error: profileError },
    { data: recentData, error: recentError },
  ] =
    await Promise.all([
      supabaseAdmin
        .from("blog_posts")
        .select(
          "title, slug, excerpt, content, cover_image_url, published_at, views, category:blog_categories(name)"
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle(),
      supabaseAdmin
        .from("profile")
        .select(
          "full_name, role_title, avatar_url, resume_url, linkedin_url, github_url, instagram_url"
        )
        .eq("id", 1)
        .maybeSingle(),
      supabaseAdmin
        .from("blog_posts")
        .select(
          "id, title, slug, excerpt, cover_image_url, published_at, category:blog_categories(name)"
        )
        .eq("status", "published")
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(4),
    ]);

  if (postError) {
    throw new Error(`Gagal memuat artikel blog: ${postError.message}`);
  }
  if (profileError) {
    throw new Error(`Gagal memuat profil penulis: ${profileError.message}`);
  }
  if (recentError) {
    throw new Error(`Gagal memuat rekomendasi blog: ${recentError.message}`);
  }
  if (!post) {
    notFound();
  }

  const category = Array.isArray(post.category) ? post.category[0] : post.category;
  const recentBlogs = (recentData ?? []) as unknown as RecommendedBlog[];
  const contentHtml = renderMarkdown(post.content);
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const authorName = profile?.full_name || "Darmawan Suka Prajadiputra";
  const publishedDate = formatDate(post.published_at);
  const avatarUrl = profile?.avatar_url || "/pictures/me.png";

  return (
    <>
      <HomeHeader fullName={authorName} />

      <ArticleReadingProgress />

      <main className="min-h-screen bg-surface pt-16 text-on-surface">
        <div className="mx-auto w-full max-w-max-width px-margin-mobile py-8 md:px-margin-desktop md:py-12">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 font-label-mono text-caption text-outline"
            >
              <Link className="transition-colors hover:text-secondary" href="/">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link className="transition-colors hover:text-secondary" href="/#blog">
                Blog
              </Link>
              {category?.name && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className="text-secondary">{category.name}</span>
                </>
              )}
            </nav>
            <Link
              className="inline-flex items-center gap-2 self-start rounded-lg bg-surface-container px-3 py-1.5 font-label-mono text-caption uppercase text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary"
              href="/#blog"
            >
              <AppIcon name="arrow_back" className="size-4" />
              Back to all articles
            </Link>
          </div>

          <header className="mx-auto mb-12 flex max-w-4xl flex-col gap-5">
            <h1 className="font-display-lg-mobile text-3xl leading-tight tracking-tight text-on-surface md:text-display-lg">
              {post.title}
            </h1>

            <div className="flex flex-col justify-between gap-5 border-y border-outline-variant/30 py-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Image
                  alt={`${authorName} profile`}
                  className="size-11 rounded-full object-cover ring-2 ring-secondary/20"
                  height={44}
                  src={avatarUrl}
                  width={44}
                />
                <div>
                  <p className="font-headline-md text-body-md font-semibold text-on-surface">
                    {authorName}
                  </p>
                  <p className="font-label-mono text-caption text-outline">
                    {profile?.role_title || "Author"}
                    {publishedDate ? ` · ${publishedDate}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 font-label-mono text-caption text-outline sm:justify-end">
                <span className="inline-flex items-center gap-1.5">
                  <AppIcon name="schedule" className="size-4 text-secondary" />
                  {readingMinutes} min read
                </span>
                <ArticleShareActions title={post.title} />
              </div>
            </div>
          </header>

          <div className="relative mx-auto mb-14 max-w-5xl overflow-hidden rounded-xl bg-surface-container-low shadow-xl">
            <div className="relative aspect-[16/9] w-full">
              {post.cover_image_url ? (
                <Image
                  alt={post.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  src={post.cover_image_url}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest">
                  <AppIcon
                    name="article"
                    className="size-16 text-secondary/50 md:size-24"
                  />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-container-lowest/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 rounded bg-surface-container-lowest/80 px-3 py-1 font-label-mono text-caption text-tertiary backdrop-blur-md md:bottom-6 md:left-6">
                {category?.name || "INSIGHT"} / {publishedDate || "ARTICLE"}
              </span>
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <article
              className="blog-prose min-w-0 lg:col-span-8"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            <aside className="min-w-0 lg:sticky lg:top-24 lg:col-span-4">
              <h2 className="mb-5 border-b border-outline-variant/30 pb-3 font-headline-md text-lg text-on-surface">
                Artikel Terbaru
              </h2>
              {recentBlogs.length > 0 ? (
                <div className="space-y-4">
                  {recentBlogs.map((blog) => {
                    const blogCategory = Array.isArray(blog.category)
                      ? blog.category[0]
                      : blog.category;

                    return (
                      <Link
                        key={blog.id}
                        className="group flex gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-3 transition-colors hover:border-secondary/50"
                        href={`/blog/${blog.slug}`}
                      >
                        <div className="relative aspect-square size-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                          {blog.cover_image_url ? (
                            <Image
                              alt=""
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              fill
                              sizes="80px"
                              src={blog.cover_image_url}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <AppIcon
                                name="article"
                                className="size-6 text-outline"
                              />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          {blogCategory?.name && (
                            <p className="mb-1 font-label-mono text-[10px] uppercase tracking-wider text-secondary">
                              {blogCategory.name}
                            </p>
                          )}
                          <h3 className="line-clamp-2 font-headline-md text-sm leading-snug text-on-surface transition-colors group-hover:text-secondary">
                            {blog.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                            {blog.excerpt}
                          </p>
                          {blog.published_at && (
                            <time
                              className="mt-2 block font-label-mono text-[10px] text-outline"
                              dateTime={blog.published_at}
                            >
                              {formatDate(blog.published_at)}
                            </time>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 text-sm text-on-surface-variant">
                  Belum ada artikel lain yang dipublikasikan.
                </p>
              )}
            </aside>
          </div>
        </div>
      </main>

      <HomeFooter
        profile={{
          full_name: authorName,
          linkedin_url: profile?.linkedin_url ?? null,
          github_url: profile?.github_url ?? null,
          instagram_url: profile?.instagram_url ?? null,
        }}
      />
    </>
  );
}
