import { notFound } from "next/navigation";

import { getArticleBySlug } from "@/lib/articles";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl">
      <header className="mb-8">
        <p className="text-sm text-black/40">{article.date}</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
          {article.title}
        </h1>
        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-black/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="md-prose text-black/80">
        <div
          dangerouslySetInnerHTML={{
            __html: simpleMarkdownToHtml(article.content),
          }}
        />
      </div>
    </article>
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInline(text: string): string {
  return escapeHtml(text)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(trimmed);
}

function renderTable(lines: string[]): string {
  const rows = lines.map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  const [header, , ...body] = rows;
  const headHtml = `<thead><tr>${header.map((cell) => `<th>${formatInline(cell)}</th>`).join("")}</tr></thead>`;
  const bodyHtml = body.length
    ? `<tbody>${body
        .map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`)
        .join("")}</tbody>`
    : "";
  return `<table>${headHtml}${bodyHtml}</table>`;
}

const CODE_PREVIEW_LINES = 6;

function renderCodeBlock(codeLines: string[], language: string): string {
  const langAttr = language ? ` class="language-${escapeHtml(language)}"` : "";
  const langText = language ? escapeHtml(language) : "code";

  if (codeLines.length <= CODE_PREVIEW_LINES) {
    const summary = `<summary><span class="code-lang">${langText}</span></summary>`;
    const code = `<pre><code${langAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`;
    return `<details class="code-block" open>${summary}${code}</details>`;
  }

  const summary = `<summary><span class="code-lang">${langText}</span><span class="code-hint">${codeLines.length} lines</span></summary>`;
  const previewLines = codeLines.slice(0, CODE_PREVIEW_LINES);
  const preview = `<div class="code-preview">${escapeHtml(previewLines.join("\n"))}<span class="code-fade"></span></div>`;
  const fullCode = `<pre><code${langAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`;
  return `<details class="code-block">${summary}${preview}${fullCode}</details>`;
}

function simpleMarkdownToHtml(md: string): string {
  const content = md.replace(/^---[\s\S]*?---\n*/m, "").replace(/\r\n/g, "\n");
  const lines = content.split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const block: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        block.push(lines[i]);
        i += 1;
      }
      i += 1;
      html.push(renderCodeBlock(block, language));
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      const level = trimmed.match(/^#+/)?.[0].length ?? 1;
      html.push(`<h${level}>${formatInline(trimmed.slice(level).trim())}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^([-*_])\1{2,}$/.test(trimmed)) {
      html.push("<hr />");
      i += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const block: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        block.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      html.push(`<blockquote>${block.map((entry) => `<p>${formatInline(entry)}</p>`).join("")}</blockquote>`);
      continue;
    }

    if (trimmed.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const tableLines = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].trim().includes("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      html.push(renderTable(tableLines));
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(`<li>${formatInline(lines[i].trim().replace(/^[-*+]\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${formatInline(lines[i].trim().replace(/^\d+\.\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // Paragraph
    const paragraph: string[] = [trimmed];
    i += 1;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        !next ||
        next.startsWith("```") ||
        /^#{1,6}\s+/.test(next) ||
        /^([-*_])\1{2,}$/.test(next) ||
        next.startsWith(">") ||
        /^[-*+]\s+/.test(next) ||
        /^\d+\.\s+/.test(next) ||
        (next.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
      ) {
        break;
      }
      paragraph.push(next);
      i += 1;
    }
    html.push(`<p>${formatInline(paragraph.join("\n"))}</p>`);
  }

  return html.join("\n");
}
