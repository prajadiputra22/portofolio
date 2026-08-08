import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Ambil daftar nama skill dari FormData. Frontend mengirim field "skills"
 * berupa string JSON, misal: '["Next.js", "Tailwind"]'.
 */
export function parseSkillNames(formData: FormData): string[] {
  const raw = formData.get("skills");
  if (typeof raw !== "string" || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return Array.from(
        new Set(
          parsed
            .filter((item): item is string => typeof item === "string")
            .map((name) => name.trim())
            .filter(Boolean)
        )
      );
    }
  } catch {
    // formatnya tidak valid, anggap tidak ada skill
  }

  return [];
}

/**
 * Get-or-create tiap skill by name (upsert berdasarkan kolom unique "name"),
 * lalu hubungkan semuanya ke satu work lewat tabel work_skills.
 */
export async function linkSkillsToWork(workId: string, skillNames: string[]) {
  if (skillNames.length === 0) return;

  const { data: skillRows, error: upsertError } = await supabaseAdmin
    .from("skills")
    .upsert(
      skillNames.map((name) => ({ name })),
      { onConflict: "name" }
    )
    .select("id, name");

  if (upsertError || !skillRows) {
    throw new Error(upsertError?.message ?? "Gagal menyimpan skill.");
  }

  const links = skillRows.map((skill) => ({ work_id: workId, skill_id: skill.id }));

  const { error: linkError } = await supabaseAdmin.from("work_skills").insert(links);
  if (linkError) {
    throw new Error(linkError.message);
  }
}

/**
 * Hapus semua relasi skill lama milik satu work. Dipakai sebelum
 * menghubungkan ulang skill baru saat update (strategi replace-all).
 */
export async function unlinkAllSkillsFromWork(workId: string) {
  const { error } = await supabaseAdmin.from("work_skills").delete().eq("work_id", workId);
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Ambil daftar skill (id, name) milik satu work — dipakai untuk pre-fill
 * form edit dan untuk ditampilkan sebagai badge di halaman Manage Works.
 */
export async function getSkillsForWork(
  workId: string
): Promise<{ id: string; name: string; icon_url: string | null }[]> {
  const { data, error } = await supabaseAdmin
    .from("work_skills")
    .select("skills(id, name, icon_url)")
    .eq("work_id", workId);

  if (error || !data) return [];

  type RawRow = {
    skills:
      | { id: string; name: string; icon_url: string | null }
      | { id: string; name: string; icon_url: string | null }[]
      | null;
  };

  return (data as unknown as RawRow[])
    .map((row) => (Array.isArray(row.skills) ? row.skills[0] : row.skills))
    .filter(
      (skill): skill is { id: string; name: string; icon_url: string | null } =>
        Boolean(skill)
    );
}