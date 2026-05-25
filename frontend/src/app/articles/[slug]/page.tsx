import { notFound } from "next/navigation";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import ini from "highlight.js/lib/languages/ini";
import diff from "highlight.js/lib/languages/diff";

import katex from "katex";
import "katex/dist/katex.min.css";
import { getArticleBySlug } from "@/lib/articles";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("md", markdown);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c++", cpp);
hljs.registerLanguage("java", java);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("diff", diff);

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
    <article className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-white/60 bg-white/55 p-8 shadow-sm backdrop-blur-2xl saturate-180 md:p-12">
        <header className="mb-8">
          <p className="text-sm text-black/40">{article.date}</p>
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
      </div>
    </article>
  );
}

const MATH_BLOCK_PH = "\u0000MATHBLOCK";
const MATH_INLINE_PH = "\u0000MATHINLINE";

function extractMathBlocks(md: string): { processed: string; blocks: string[] } {
  const blocks: string[] = [];
  // Extract $$...$$ block math
  let processed = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    blocks.push(math.trim());
    return `${MATH_BLOCK_PH}${blocks.length - 1}\u0000`;
  });
  // Extract $...$ inline math (not preceded/followed by $)
  processed = processed.replace(/(?<!\$)\$(?!\$)([^\n$]+?)\$(?!\$)/g, (_, math) => {
    blocks.push(math.trim());
    return `${MATH_INLINE_PH}${blocks.length - 1}\u0000`;
  });
  return { processed, blocks };
}

function renderMathBlocks(html: string, blocks: string[]): string {
  return html.replace(
    new RegExp(`${MATH_BLOCK_PH}(\\d+)\u0000`, "g"),
    (_, i) => {
      try {
        return `<div class="math-block">${katex.renderToString(blocks[parseInt(i)], { displayMode: true, throwOnError: false })}</div>`;
      } catch { return blocks[parseInt(i)]; }
    }
  ).replace(
    new RegExp(`${MATH_INLINE_PH}(\\d+)\u0000`, "g"),
    (_, i) => {
      try {
        return `<span class="math-inline">${katex.renderToString(blocks[parseInt(i)], { displayMode: false, throwOnError: false })}</span>`;
      } catch { return blocks[parseInt(i)]; }
    }
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

const CODE_PH = "\u0000CODE";

function formatInline(text: string): string {
  const codeSnippets: string[] = [];
  let result = escapeHtml(text);

  // 1. Extract inline code into placeholders (highest priority)
  result = result.replace(/`([^`]+)`/g, (_, code) => {
    codeSnippets.push(`<code>${code}</code>`);
    return `${CODE_PH}${codeSnippets.length - 1}\u0000`;
  });

  // 2. Process images, links, bold, italic on the remaining text
  result = result
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // 3. Restore code placeholders
  result = result.replace(new RegExp(`${CODE_PH}(\\d+)\u0000`, "g"), (_, i) => codeSnippets[parseInt(i)]);

  return result;
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(trimmed);
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

function highlightCode(code: string, language: string): string {
  // Skip markdown — hljs strips frontmatter (---) from code blocks, leaving empty output
  if (language === "md" || language === "markdown") return escapeHtml(code);
  if (language && hljs.getLanguage(language)) {
    try {
      const result = hljs.highlight(code, { language }).value;
      if (result.trim()) return result;
    } catch {
      // fall through
    }
  }
  return escapeHtml(code);
}

function renderCodeBlock(codeLines: string[], language: string): string {
  const langText = language ? escapeHtml(language) : "code";
  const rawCode = codeLines.join("\n");
  const highlighted = highlightCode(rawCode, language);
  const langAttr = language ? ` class="language-${escapeHtml(language)} hljs"` : ' class="hljs"';
  const copyBtn = `<button class="code-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('code').textContent).then(()=>{this.textContent='Copied!';setTimeout(()=>{this.textContent='Copy'},1500)})">Copy</button>`;

  if (codeLines.length <= CODE_PREVIEW_LINES) {
    const summary = `<summary><span class="code-lang">${langText}</span>${copyBtn}</summary>`;
    const code = `<pre><code${langAttr}>${highlighted}</code></pre>`;
    return `<details class="code-block" open>${summary}${code}</details>`;
  }

  const summary = `<summary><span class="code-lang">${langText}</span><span class="code-hint">${codeLines.length} lines</span>${copyBtn}</summary>`;
  const previewLines = codeLines.slice(0, CODE_PREVIEW_LINES);
  const preview = `<div class="code-preview">${escapeHtml(previewLines.join("\n"))}<span class="code-fade"></span></div>`;
  const fullCode = `<pre><code${langAttr}>${highlighted}</code></pre>`;
  return `<details class="code-block">${summary}${preview}${fullCode}</details>`;
}

function simpleMarkdownToHtml(md: string): string {
  const { processed: mdExtracted, blocks: mathBlocks } = extractMathBlocks(md);
  const content = mdExtracted.replace(/\r\n/g, "\n");
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
      while (i < lines.length) {
        const ln = lines[i].trim();
        if (!ln) { i += 1; continue; }
        if (!/^[-*+]\s+/.test(ln)) break;
        items.push(`<li>${formatInline(ln.replace(/^[-*+]\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const ln = lines[i].trim();
        if (!ln) { i += 1; continue; }
        if (!/^\d+\.\s+/.test(ln)) break;
        items.push(`<li>${formatInline(ln.replace(/^\d+\.\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // Raw HTML block tags (details, summary, div, table, etc.) — pass through as-is
    if (/^<(details|summary|div|table|section|article|aside|nav|header|footer|figure|figcaption|iframe)\b/i.test(trimmed)) {
      const tag = trimmed.match(/^<(\w+)/)?.[1]?.toLowerCase() || "";
      const block: string[] = [lines[i]];
      const closeTag = `</${tag}>`;
      const isSelfClosing = trimmed.endsWith("/>") || /^<(br|hr|img|input)\b/i.test(trimmed);
      i += 1;
      if (!isSelfClosing) {
        let depth = 1;
        while (i < lines.length && depth > 0) {
          const cur = lines[i].trim();
          if (new RegExp(`^<${tag}\\b`, "i").test(cur)) depth++;
          if (cur.toLowerCase().startsWith(closeTag)) depth--;
          block.push(lines[i]);
          if (depth === 0) break;
          i += 1;
        }
      }
      i += 1;
      html.push(block.join("\n"));
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

  return renderMathBlocks(html.join("\n"), mathBlocks);
}
