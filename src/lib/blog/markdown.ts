/** Renderer markdown kecil untuk preview editor (tanpa dependensi, HTML di-escape). */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function inline(raw: string) {
  let s = esc(raw);
  s = s.replace(
    /`([^`]+)`/g,
    '<code class="blog-inline-code">$1</code>'
  );
  s = s.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    '<img alt="$1" src="$2" class="blog-content-image" />'
  );
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-secondary underline">$1</a>'
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return s;
}

export type MarkdownHeading = {
  id: string;
  text: string;
  level: number;
};

function headingText(raw: string) {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

export function extractMarkdownHeadings(md: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const usedIds = new Map<string, number>();
  let inCodeBlock = false;

  for (const line of md.replace(/\r\n/g, "\n").split("\n")) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{1,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const text = headingText(match[2]);
    const baseId =
      text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    const count = (usedIds.get(baseId) ?? 0) + 1;
    usedIds.set(baseId, count);
    headings.push({
      id: count === 1 ? baseId : `${baseId}-${count}`,
      text,
      level: match[1].length,
    });
  }

  return headings;
}

export function renderMarkdown(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  const headings = extractMarkdownHeadings(md);
  let headingIndex = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = esc(line.slice(3).trim());
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      if (i < lines.length) i++;
      out.push(
        `<div class="blog-code-block">` +
          `<div class="blog-code-header"><span class="blog-code-lights" aria-hidden="true"><i></i><i></i><i></i></span>` +
          `<span>${lang || "Code snippet"}</span></div>` +
          `<pre><code>${esc(code.join("\n"))}</code></pre></div>`
      );
      continue;
    }

    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const heading = headings[headingIndex++];
      out.push(`<h${level} id="${heading.id}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) q.push(lines[i++].slice(2));
      out.push(`<blockquote class="border-l-2 border-secondary pl-4 text-on-surface-variant italic">${inline(q.join(" "))}</blockquote>`);
      continue;
    }

    if (/^([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }

    if (
      /^\|.*\|$/.test(line) &&
      i + 1 < lines.length &&
      /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[i + 1])
    ) {
      const cells = (row: string) => row.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      const headers = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && /^\|.*\|$/.test(lines[i])) {
        rows.push(cells(lines[i++]));
      }
      out.push(
        `<div class="blog-table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${inline(cell)}</th>`).join("")}</tr></thead>` +
          `<tbody>${rows.map((row) => `<tr>${headers.map((_, index) => `<td>${inline(row[index] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ""));
      out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\d+[.)]\s+/, ""));
      }
      out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ol>`);
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const p: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !lines[i].startsWith("> ") &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+[.)]\s+/.test(lines[i]) &&
      !/^([-*_])(?:\s*\1){2,}\s*$/.test(lines[i]) &&
      !(
        /^\|.*\|$/.test(lines[i]) &&
        i + 1 < lines.length &&
        /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[i + 1])
      )
    ) {
      p.push(lines[i++]);
    }
    out.push(`<p class="text-on-surface-variant">${inline(p.join(" "))}</p>`);
  }

  return out.join("\n");
}
