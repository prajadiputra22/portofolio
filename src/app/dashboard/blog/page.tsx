"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/Dashboardshell"; 

type PostStatus = "published" | "draft";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: "secondary" | "tertiary" | "outline";
  date: string; // display string; empty for drafts
  status: PostStatus;
  views: number;
};

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "p1",
    title: "The Future of Concurrent Rendering in React",
    excerpt: "Exploring the architectural implications of non-blocking UI updates...",
    category: "Frontend",
    categoryColor: "secondary",
    date: "Oct 24, 2024",
    status: "published",
    views: 4210,
  },
  {
    id: "p2",
    title: "Microservices vs. Monoliths: A Practical Guide",
    excerpt: "When to abstract and when to consolidate for maximum velocity...",
    category: "Backend",
    categoryColor: "tertiary",
    date: "Oct 18, 2024",
    status: "published",
    views: 3860,
  },
  {
    id: "p3",
    title: "Optimizing WebGL Shaders for Performance",
    excerpt: "Deep dive into math-based optimizations for browser graphics...",
    category: "Graphics",
    categoryColor: "outline",
    date: "",
    status: "draft",
    views: 0,
  },
  {
    id: "p4",
    title: "Securing Auth Workflows with JWT",
    excerpt: "Best practices for token storage and rotation in modern apps...",
    category: "Security",
    categoryColor: "tertiary",
    date: "Oct 12, 2024",
    status: "published",
    views: 5920,
  },
  {
    id: "p5",
    title: "Design Systems for Scale",
    excerpt: "How we built a token-based architecture for multi-platform consistency...",
    category: "UX Engineering",
    categoryColor: "secondary",
    date: "Sep 30, 2024",
    status: "published",
    views: 2470,
  },
  {
    id: "p6",
    title: "A Practical Guide to Edge Caching",
    excerpt: "Cutting TTFB with smarter cache boundaries at the CDN layer...",
    category: "Backend",
    categoryColor: "tertiary",
    date: "Sep 22, 2024",
    status: "published",
    views: 1890,
  },
  {
    id: "p7",
    title: "Type-Safe Forms Without the Boilerplate",
    excerpt: "A lighter pattern for schema-driven forms in TypeScript...",
    category: "Frontend",
    categoryColor: "secondary",
    date: "",
    status: "draft",
    views: 0,
  },
];

const CATEGORY_CLASSES: Record<BlogPost["categoryColor"], string> = {
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
  outline: "bg-outline/10 text-outline",
};

const PAGE_SIZE = 5;

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "secondary" | "tertiary" }) {
  const valueTone =
    tone === "secondary" ? "text-secondary" : tone === "tertiary" ? "text-tertiary" : "text-on-surface";
  return (
    <div className="bg-surface-container-low/40 backdrop-blur-md border border-outline-variant/10 p-6 rounded-xl">
      <div className="text-on-surface-variant font-label-mono text-caption uppercase mb-2">{label}</div>
      <div className={`font-headline-lg text-headline-lg ${valueTone}`}>{value}</div>
    </div>
  );
}

export default function ManageBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = posts.filter((post) => {
      const matchesQuery =
        q.length === 0 ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return sortDir === "desc" ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [posts, query, statusFilter, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  function togglePublish(id: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              status: post.status === "published" ? "draft" : "published",
              date:
                post.status === "published"
                  ? ""
                  : post.date ||
                    new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            }
          : post
      )
    );
  }

  return (
    <DashboardShell title="Manage Blog">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="material-symbols-outlined text-secondary text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
            <span className="font-label-mono text-label-mono text-secondary tracking-widest uppercase">
              Admin Console
            </span>
          </div>
          <h1 className="font-display-lg text-headline-lg md:text-display-lg text-on-surface">
            Manage Blog Posts
          </h1>
          <p className="text-on-surface-variant mt-2 max-w-2xl">
            Create, refine, and monitor your engineering insights and architectural thoughts.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] transition-all duration-300 active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          New Post
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Posts" value={String(totalPosts)} />
        <StatCard label="Published" value={String(publishedCount)} tone="secondary" />
        <StatCard label="Drafts" value={String(draftCount)} tone="tertiary" />
        <StatCard label="Total Views" value={`${(totalViews / 1000).toFixed(1)}k`} />
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search entries..."
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-secondary transition-colors text-on-surface placeholder:text-outline/50"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | PostStatus);
              setPage(1);
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-outline-variant/30 bg-transparent px-4 py-3 rounded-lg hover:bg-surface-variant/30 transition-colors text-on-surface text-sm focus:outline-none"
          >
            <option className="bg-surface-container-lowest" value="all">
              All statuses
            </option>
            <option className="bg-surface-container-lowest" value="published">
              Published
            </option>
            <option className="bg-surface-container-lowest" value="draft">
              Draft
            </option>
          </select>
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-outline-variant/30 px-4 py-3 rounded-lg hover:bg-surface-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-body-md">sort</span>
            <span className="font-body-md text-body-md">{sortDir === "desc" ? "Newest" : "Oldest"}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden border border-outline-variant/20 rounded-xl bg-surface-container-lowest">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container/50 border-b border-outline-variant/20">
              <tr>
                <th className="py-5 px-6 font-label-mono text-caption text-outline uppercase tracking-widest">
                  Title &amp; Excerpt
                </th>
                <th className="py-5 px-6 font-label-mono text-caption text-outline uppercase tracking-widest">
                  Category
                </th>
                <th className="py-5 px-6 font-label-mono text-caption text-outline uppercase tracking-widest">
                  Publication Date
                </th>
                <th className="py-5 px-6 font-label-mono text-caption text-outline uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="py-5 px-6 font-label-mono text-caption text-outline uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 px-6 text-center text-on-surface-variant">
                    No posts match your search.
                  </td>
                </tr>
              )}
              {paginated.map((post) => (
                <tr key={post.id} className="hover:bg-surface-variant/10 transition-colors group">
                  <td className="py-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-headline-md text-body-lg text-on-surface mb-1 group-hover:text-secondary transition-colors cursor-pointer">
                        {post.title}
                      </span>
                      <span className="text-caption text-on-surface-variant line-clamp-1">{post.excerpt}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span
                      className={`px-2 py-1 font-label-mono text-caption rounded ${CATEGORY_CLASSES[post.categoryColor]}`}
                    >
                      {post.category}
                    </span>
                  </td>
                  <td className="py-6 px-6 font-body-md">
                    {post.status === "draft" ? (
                      <span className="text-outline italic">Draft</span>
                    ) : (
                      <span className="text-on-surface-variant">{post.date}</span>
                    )}
                  </td>
                  <td className="py-6 px-6 text-center">
                    {post.status === "published" ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span className="font-label-mono text-caption">Published</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-variant/50 text-on-surface-variant border border-outline-variant/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                        <span className="font-label-mono text-caption">Draft</span>
                      </div>
                    )}
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="View"
                        className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded transition-all"
                      >
                        <span className="material-symbols-outlined text-body-md">visibility</span>
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded transition-all"
                      >
                        <span className="material-symbols-outlined text-body-md">edit</span>
                      </button>
                      <button
                        type="button"
                        title={post.status === "published" ? "Unpublish" : "Publish"}
                        onClick={() => togglePublish(post.id)}
                        className={
                          post.status === "published"
                            ? "p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-all"
                            : "p-2 text-on-surface-variant hover:text-secondary-container hover:bg-secondary-container/10 rounded transition-all"
                        }
                      >
                        <span className="material-symbols-outlined text-body-md">
                          {post.status === "published" ? "unpublished" : "publish"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container/30 border-t border-outline-variant/10 flex items-center justify-between">
          <span className="text-caption text-on-surface-variant font-body-md">
            {filtered.length === 0
              ? "Showing 0 entries"
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(
                  currentPage * PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length} entries`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded border border-outline-variant/30 hover:bg-surface-variant/30 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-body-md">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={
                  n === currentPage
                    ? "px-4 py-1 rounded bg-secondary text-on-secondary font-label-mono text-caption"
                    : "px-4 py-1 rounded border border-outline-variant/30 hover:bg-surface-variant/30 font-label-mono text-caption transition-colors"
                }
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded border border-outline-variant/30 hover:bg-surface-variant/30 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-body-md">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}