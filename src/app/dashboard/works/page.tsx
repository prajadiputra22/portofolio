import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import DashboardShell from "@/components/Dashboardshell";

type Skill = {
  id: string;
  name: string;
  icon_url: string | null;
};

type Work = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  project_url: string | null;
  repo_url: string | null;
  created_at: string;
  skills: Skill[];
};

async function getWorks(): Promise<Work[]> {
  const { data, error } = await supabaseAdmin
    .from("works")
    .select(
      "id, title, description, cover_image_url, project_url, repo_url, created_at, work_skills(skills(id, name, icon_url))"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data works:", error.message);
    return [];
  }

  type RawSkillRelation = Skill | Skill[] | null;
  type RawRow = Omit<Work, "skills"> & {
    work_skills: { skills: RawSkillRelation }[] | null;
  };

  return ((data ?? []) as unknown as RawRow[]).map((row) => ({
    ...row,
    skills: (row.work_skills ?? [])
      .map((ws) => (Array.isArray(ws.skills) ? ws.skills[0] : ws.skills))
      .filter((skill): skill is Skill => Boolean(skill)),
  }));
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
    <DashboardShell title="Manage Works">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-on-surface text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Manage Works
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-body-lg text-body-lg">
            Oversee and organize portfolio projects.
          </p>
        </div>
        <Link
          href="/dashboard/works/add"
          className="flex items-center gap-2 bg-secondary text-on-secondary-container px-6 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-2 rounded-lg flex items-center gap-2">
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
              href="/dashboard/works/add"
              className="flex items-center gap-2 bg-secondary text-on-secondary-container px-6 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add New Project</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                      Project
                    </th>
                    <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                      Skills
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
                              // eslint-disable-next-line @next/next/no-img-element
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
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {work.skills.length === 0 ? (
                            <span className="text-on-surface-variant/50 text-caption">—</span>
                          ) : (
                            work.skills.map((skill) => (
                              <span
                                key={skill.id}
                                className="flex items-center gap-1 px-2 py-1 bg-surface-container-high text-on-surface-variant text-label-mono rounded text-xs border border-outline-variant/30"
                              >
                                {skill.icon_url && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={skill.icon_url} alt="" className="w-3 h-3" />
                                )}
                                {skill.name}
                              </span>
                            ))
                          )}
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
                            href={`/dashboard/works/edit/${work.id}`}
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

      {/* FAB for mobile add action */}
      <Link
        href="/dashboard/works/add"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-secondary text-on-secondary-container rounded-full shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined">add</span>
      </Link>
    </DashboardShell>
  );
}