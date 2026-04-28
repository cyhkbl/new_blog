"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import type { ArticleMeta } from "@/lib/articles";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function ArticleList({
  articles,
}: {
  articles: ArticleMeta[];
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {articles.map((article) => (
        <motion.div key={article.slug} variants={item}>
          <Link
            href={`/articles/${encodeURIComponent(article.slug)}`}
            className="glass group block overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex flex-col sm:flex-row">
              {article.cover && (
                <div className="h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-44">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex-1 p-5">
                <p className="text-sm text-black/40">
                  {article.date}
                </p>
                <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--text-primary)]">
                  {article.title}
                </h2>
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {article.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-white/60 px-2.5 py-0.5 text-xs text-black/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2.5 text-sm leading-relaxed text-black/50 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
