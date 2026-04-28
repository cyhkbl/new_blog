import Link from "next/link";

import type { ArticleMeta } from "@/lib/articles";

export default function ArticleNav({
  prev,
  next,
}: {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border-glass)] pt-8 sm:flex-row sm:justify-between">
      {prev ? (
        <Link
          href={`/articles/${encodeURIComponent(prev.slug)}`}
          className="glass glass-hover group flex-1 p-4 transition-all hover:-translate-y-0.5"
        >
          <p className="text-xs text-[var(--text-secondary)]">← 上一篇</p>
          <p className="mt-1 text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/articles/${encodeURIComponent(next.slug)}`}
          className="glass glass-hover group flex-1 p-4 text-right transition-all hover:-translate-y-0.5"
        >
          <p className="text-xs text-[var(--text-secondary)]">下一篇 →</p>
          <p className="mt-1 text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition">
            {next.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
