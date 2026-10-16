"use client";

import { useMemo, useState } from "react";
import type { Skill } from "@/types/skill";
import { AppIcon } from "@/components/AppIcon";

const EMPTY_FORM = { name: "", icon_url: "" };

function SkillIcon({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <AppIcon name="deployed_code" className="text-on-surface-variant text-[22px]" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-6 h-6 object-contain"
      onError={() => setErrored(true)}
    />
  );
}

export default function ManageSkillsClient({
  initialSkills,
}: {
  initialSkills: Skill[];
}) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter((s) => s.name.toLowerCase().includes(q));
  }, [skills, search]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.icon_url.trim()) {
      setError("Nama skill dan URL logo wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = editingId ? `/api/skills/${editingId}` : "/api/skills";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Gagal menyimpan skill.");
      }

      if (editingId) {
        setSkills((prev) =>
          prev.map((s) => (s.id === editingId ? (json.skill as Skill) : s))
        );
      } else {
        setSkills((prev) => [...prev, json.skill as Skill]);
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      icon_url: skill.icon_url,
    });
    setError(null);
  };

  const handleDelete = async (skill: Skill) => {
    if (!window.confirm(`Hapus skill "${skill.name}"?`)) return;

    try {
      const res = await fetch(`/api/skills/${skill.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Gagal menghapus skill.");
      }

      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      if (editingId === skill.id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  };

  return (
    <div className="md:py-2 px-margin-mobile md:px-gutter max-w-6xl mx-auto w-full flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-on-surface text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Manage Skills
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-body-lg text-body-lg">
            Add, update, or remove technical skills, tools, and logos
            displayed on your portfolio.
          </p>
        </div>
      </div>

      {/* Add / Edit form */}
      <div className="glass-panel rounded-xl p-6 border border-outline-variant/30 mb-10">
        <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/20 pb-4">
          <AppIcon
            name={editingId ? "edit" : "add_circle"}
            className="text-secondary text-[24px]"
          />
          <h2 className="font-headline-md text-[20px] font-bold text-on-surface">
            {editingId ? "Edit Skill" : "Add New Skill"}
          </h2>
        </div>

        {error && (
          <p className="mb-4 text-caption text-red-400 font-caption">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="font-label-mono text-xs uppercase tracking-widest text-on-surface-variant font-medium">
              Skill Name
            </label>
            <input
              className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0 focus:border-secondary transition-colors text-body-md"
              placeholder="e.g. React, TypeScript, Docker"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="md:col-span-7 flex flex-col gap-2">
            <label className="font-label-mono text-xs uppercase tracking-widest text-on-surface-variant font-medium">
              Logo URL / Icon Link
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 pr-10 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0 focus:border-secondary transition-colors text-body-md"
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/..."
                  type="text"
                  value={form.icon_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, icon_url: e.target.value }))
                  }
                />
                <AppIcon name="link" className="text-on-surface-variant absolute right-3 top-3.5 text-[18px]" />
              </div>
              <div
                className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center p-2 shrink-0"
                title="Logo Preview"
              >
                <SkillIcon src={form.icon_url} alt={form.name || "preview"} />
              </div>
            </div>
          </div>

          <div className="md:col-span-12 flex justify-end gap-3 pt-2 border-t border-outline-variant/20">
            <button
              className="px-6 py-2.5 rounded-lg border border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 font-medium transition-colors cursor-pointer"
              type="button"
              onClick={resetForm}
            >
              Clear / Cancel
            </button>
            <button
              className="flex items-center gap-2 bg-secondary text-on-secondary-container px-6 py-2.5 rounded-lg font-bold transition-all hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              <AppIcon name={editingId ? "save" : "add"} className="text-[20px]" />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Update Skill"
                  : "Add Skill"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* List header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-headline-md text-[20px] font-bold text-on-surface">
            Active Skills List
          </h2>
          <span className="px-2.5 py-0.5 bg-secondary/10 text-secondary border border-secondary/30 rounded-full font-label-mono text-xs font-semibold">
            {skills.length} Skills
          </span>
        </div>
        <div className="glass-panel px-3 py-1.5 rounded-lg flex items-center gap-2 w-full md:w-72">
          <AppIcon name="search" className="text-on-surface-variant text-[18px]" />
          <input
            className="bg-transparent border-none text-on-surface w-full focus:ring-0 placeholder:text-on-surface-variant/50 font-body-md text-xs focus:outline-none"
            placeholder="Search skills..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/50">
                <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                  Skill / Logo
                </th>
                <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                  Icon Source URL
                </th>
                <th className="px-6 py-4 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="row-hover transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center p-2">
                        <SkillIcon src={skill.icon_url} alt={skill.name} />
                      </div>
                      <span className="font-headline-md text-body-lg font-bold text-on-surface">
                        {skill.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      className="font-label-mono text-xs text-on-surface-variant hover:text-secondary flex items-center gap-1.5 transition-colors"
                      href={skill.icon_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="truncate max-w-[320px]">
                        {skill.icon_url}
                      </span>
                      <AppIcon name="open_in_new" className="text-[14px]" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="p-2 rounded hover:bg-secondary/20 text-secondary transition-colors"
                        title="Edit Skill"
                        onClick={() => handleEdit(skill)}
                      >
                        <AppIcon name="edit" className="text-[20px]" />
                      </button>
                      <button
                        className="p-2 rounded hover:bg-error/20 text-error transition-colors"
                        title="Delete Skill"
                        onClick={() => handleDelete(skill)}
                      >
                        <AppIcon name="delete" className="text-[20px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSkills.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-on-surface-variant font-body-md"
                  >
                    Tidak ada skill yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/30">
          <span className="text-caption font-caption text-on-surface-variant">
            Showing {filteredSkills.length} of {skills.length} skills
          </span>
        </div>
      </div>
    </div>
  );
}