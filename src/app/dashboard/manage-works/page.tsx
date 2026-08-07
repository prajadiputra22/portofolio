import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Work = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  project_url: string | null;
  repo_url: string | null;
  created_at: string;
};

async function getWorks(): Promise<Work[]> {
  const { data, error } = await supabaseAdmin
    .from("works")
    .select("id, title, description, cover_image_url, project_url, repo_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data works:", error.message);
    return [];
  }

  return data ?? [];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ManageWorks() {
  const works = await getWorks();

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
          <Link
            className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-colors"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="font-body-md">Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-colors"
            href="/dashboard/manage-profile"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span className="font-body-md">Manage Profile</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-6 py-3 sidebar-link-active transition-colors"
            href="/dashboard/manage-works"
          >
            <span className="material-symbols-outlined text-[20px]">deployed_code</span>
            <span className="font-body-md font-semibold">Manage Works</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-colors"
            href="/dashboard/manage-skills"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <span className="font-body-md">Manage Skills</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-colors"
            href="/dashboard/manage-blog"
          >
            <span className="material-symbols-outlined text-[20px]">article</span>
            <span className="font-body-md">Manage Blog</span>
          </Link>
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

        <div className="pt-12 md:pt-20 pb-24 px-margin-mobile md:px-gutter max-w-6xl mx-auto w-full flex-1">
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display-lg text-headline-lg md:text-display-lg mb-2 text-on-surface">
                Manage Works
              </h1>
              <p className="text-on-surface-variant max-w-2xl font-body-lg text-body-lg">
                Oversee and organize portfolio projects.
              </p>
            </div>
            <Link
              href="/dashboard/manage-works/add-project"
              className="flex items-center gap-2 bg-secondary text-on-secondary-container px-6 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add New Project</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="glass-panel p-2 rounded-lg flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-on-surface-variant ml-3">search</span>
            <input
              className="bg-transparent border-none text-on-surface w-full focus:ring-0 placeholder:text-on-surface-variant/50 font-body-md focus:outline-none"
              placeholder="Search projects by name..."
              type="text"
            />
          </div>

          {/* Table */}
          <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/30">
            {works.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-4">
                  deployed_code
                </span>
                <p className="font-body-lg text-body-lg text-on-surface font-bold mb-1">
                  Belum ada project
                </p>
                <p className="text-on-surface-variant text-body-md mb-6">
                  Tambahkan project pertamamu untuk ditampilkan di sini.
                </p>
                <Link
                  href="/dashboard/manage-works/add-project"
                  className="flex items-center gap-2 bg-secondary text-on-secondary-container px-6 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] active:scale-95"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span>Add New Project</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-high border-b border-outline-variant/50">
                        <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                          Project
                        </th>
                        <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                          Links
                        </th>
                        <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                          Created
                        </th>
                        <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {works.map((work) => (
                        <tr key={work.id} className="row-hover transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded bg-surface-container-highest overflow-hidden border border-outline-variant/30 flex items-center justify-center shrink-0">
                                {work.cover_image_url ? (
                                  <img
                                    className="w-full h-full object-cover"
                                    alt={`${work.title} thumbnail`}
                                    src={work.cover_image_url}
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-outline-variant text-[24px]">
                                    image
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="font-headline-md text-body-lg font-bold text-on-surface">
                                  {work.title}
                                </div>
                                <div className="text-caption font-caption text-on-surface-variant">
                                  {work.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              {work.project_url && (
                                <a
                                  href={work.project_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-on-surface-variant hover:text-secondary transition-colors"
                                  title="Live Project"
                                >
                                  <span className="material-symbols-outlined text-[20px]">public</span>
                                </a>
                              )}
                              {work.repo_url && (
                                <a
                                  href={work.repo_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-on-surface-variant hover:text-secondary transition-colors"
                                  title="Repository"
                                >
                                  <span className="material-symbols-outlined text-[20px]">code</span>
                                </a>
                              )}
                              {!work.project_url && !work.repo_url && (
                                <span className="text-on-surface-variant/50 text-caption">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-on-surface-variant text-body-md">
                              {formatDate(work.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-3">
                              <Link
                                href={`/dashboard/manage-works/edit-project/${work.id}`}
                                className="p-2 rounded hover:bg-secondary/20 text-secondary transition-colors"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </Link>
                              <button
                                className="p-2 rounded hover:bg-error/20 text-error transition-colors"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/30">
                  <span className="text-caption font-caption text-on-surface-variant">
                    Showing {works.length} project{works.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-12 border-t border-outline-variant/20 bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-gutter max-w-max-width mx-auto gap-gutter w-full">
            <div className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface">
              © 2024 Architect.Dev — Engineered with Precision
            </div>
            <div className="flex gap-8">
              <a
                className="font-caption text-caption text-on-surface-variant hover:text-secondary transition-colors hover:underline decoration-secondary underline-offset-4"
                href="#"
              >
                Github
              </a>
              <a
                className="font-caption text-caption text-on-surface-variant hover:text-secondary transition-colors hover:underline decoration-secondary underline-offset-4"
                href="#"
              >
                LinkedIn
              </a>
              <a
                className="font-caption text-caption text-on-surface-variant hover:text-secondary transition-colors hover:underline decoration-secondary underline-offset-4"
                href="#"
              >
                Twitter
              </a>
              <a
                className="font-caption text-caption text-on-surface-variant hover:text-secondary transition-colors hover:underline decoration-secondary underline-offset-4"
                href="#"
              >
                Stack Overflow
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* FAB for mobile add action */}
      <Link
        href="/dashboard/manage-works/add-project"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-secondary text-on-secondary-container rounded-full shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined">add</span>
      </Link>
    </div>
  );
}