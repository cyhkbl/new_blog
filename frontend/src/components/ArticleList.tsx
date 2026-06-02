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
      className="flex flex-col gap-6"
    >
      {articles.map((article) => (
        <motion.div key={article.slug} variants={item} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Link
            href={`/articles/${encodeURIComponent(article.slug)}`}
            className="group block overflow-hidden rounded-2xl border border-white/60 bg-white/55 shadow-sm backdrop-blur-2xl saturate-180 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-lg"
          >
            <div className="flex flex-col sm:flex-row">
              {article.cover && (
                <div className="h-52 w-full shrink-0 overflow-hidden sm:h-64 sm:w-96">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center p-8">
                <p className="text-base text-black/40">{article.date}</p>
                <h2 className="mt-3 text-xl font-semibold leading-snug text-[var(--text-primary)]">{article.title}</h2>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
