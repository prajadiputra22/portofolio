"use client";

import { useEffect, useState } from "react";

type Skill = { id: string; name: string; icon_url: string | null };

type SkillsInputProps = {
  initialSkills?: string[];
  onChange: (skills: string[]) => void;
};

export default function SkillsInput({ initialSkills = [], onChange }: SkillsInputProps) {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<string[]>(initialSkills);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => setAvailableSkills(data.skills ?? []))
      .catch(() => setAvailableSkills([]));
  }, []);

  useEffect(() => {
    onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Cari data lengkap (termasuk icon) dari nama skill yang sedang dipilih.
  // Kalau skill-nya baru diketik manual (belum ada di master), icon-nya null.
  function findSkillData(name: string): Skill | undefined {
    return availableSkills.find((s) => s.name.toLowerCase() === name.toLowerCase());
  }

  function addSkill(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSelected((prev) => {
      const alreadyAdded = prev.some((s) => s.toLowerCase() === trimmed.toLowerCase());
      return alreadyAdded ? prev : [...prev, trimmed];
    });
    setInputValue("");
  }

  function removeSkill(name: string) {
    setSelected((prev) => prev.filter((s) => s !== name));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      removeSkill(selected[selected.length - 1]);
    }
  }

  const suggestions = availableSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selected.some((sel) => sel.toLowerCase() === s.name.toLowerCase())
  ).slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map((name) => {
          const skillData = findSkillData(name);
          return (
            <span
              key={name}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm"
            >
              {skillData?.icon_url && (
                <img src={skillData.icon_url} alt="" className="w-4 h-4" />
              )}
              {name}
              <button
                type="button"
                onClick={() => removeSkill(name)}
                className="hover:text-error transition-colors"
                aria-label={`Remove ${name}`}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </span>
          );
        })}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik skill lalu Enter (e.g. Next.js)"
          className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors font-body-md text-body-md placeholder:text-on-surface-variant/50"
        />

        {inputValue && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-surface-container-highest border border-outline-variant/50 rounded-lg overflow-hidden shadow-lg">
            {suggestions.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => addSkill(skill.name)}
                className="w-full flex items-center gap-2 text-left px-4 py-2 text-on-surface hover:bg-secondary/10 hover:text-secondary transition-colors text-body-md"
              >
                {skill.icon_url && <img src={skill.icon_url} alt="" className="w-4 h-4" />}
                {skill.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="font-caption text-caption text-on-surface-variant mt-2">
        Tekan Enter atau koma untuk menambah. Bisa pilih dari saran atau ketik skill baru.
      </p>
    </div>
  );
}