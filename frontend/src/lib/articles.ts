import fs from "fs";
import path from "path";

import matter from "gray-matter";

const articlesDir = path.join(process.cwd(), "content", "articles");

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  tags?: string[];
}

function normalizeSlug(value: string): string {
  return decodeURIComponent(value)
    .normalize("NFKC")
    .replace(/\.[^/.]+$/, "")
    .replace(/[（）]/g, (char) => (char === "（" ? "(" : ")"))
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function getArticleFiles(): string[] {
  if (!fs.existsSync(articlesDir)) return [];
  return fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

export function getAllArticles(): ArticleMeta[] {
  const files = getArticleFiles();

  const articles: (ArticleMeta & { _sortKey: string })[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const excerpt = data.excerpt || content.replace(/[#*`\[\]]/g, "").trim().slice(0, 150) + "...";

    const rawDate = data.date ? new Date(data.date) : null;

    return {
      slug,
      title: data.title || slug,
      date: rawDate ? rawDate.toISOString().split("T")[0] : "未知日期",
      _sortKey: rawDate ? rawDate.toISOString() : "",
      excerpt,
      cover: typeof data.cover === "string" && data.cover.trim() ? data.cover.trim() : undefined,
      tags: data.tags || undefined,
    };
  });

  return articles
    .sort((a, b) => (b as any)._sortKey.localeCompare((a as any)._sortKey))
    .map(({ _sortKey, ...rest }) => rest);
}

export function getArticleBySlug(slug: string) {
  const target = normalizeSlug(slug);
  const filename = getArticleFiles().find((file) => normalizeSlug(file) === target);
  if (!filename) return null;

  const actualPath = path.join(articlesDir, filename);
  const fileContent = fs.readFileSync(actualPath, "utf-8");
  const { data, content } = matter(fileContent);
  const fileSlug = filename.replace(/\.mdx?$/, "");

  return {
    slug: fileSlug,
    title: data.title || fileSlug,
    date: data.date ? new Date(data.date).toISOString().split("T")[0] : "未知日期",
    tags: data.tags || [],
    cover: typeof data.cover === "string" && data.cover.trim() ? data.cover.trim() : undefined,
    content,
  };
}
