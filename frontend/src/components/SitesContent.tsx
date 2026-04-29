"use client";

import { motion } from "framer-motion";

const sites = [
  {
    name: "CS 学习站",
    url: "https://cyhkbl.github.io/CS-Learning/",
    description: "计算机科学学习笔记与资源汇总",
    icon: "💻",
  },
  {
    name: "金融学习站",
    url: "https://cyhkbl.github.io/Finance-Learning/",
    description: "金融市场、量化交易学习笔记",
    icon: "📈",
  },
  {
    name: "Life",
    url: "https://cyhkbl.github.io/Life/",
    description: "生活记录与随笔",
    icon: "🌿",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function SitesContent() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)]">
        我的其它站点
      </h1>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sites.map((site) => (
          <motion.a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={item}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.2 },
            }}
            className="glass group block p-6 transition-all cursor-pointer hover:shadow-lg"
          >
            <div className="text-3xl mb-3">{site.icon}</div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-black transition">
              {site.name}
            </h2>
            <p className="mt-2 text-sm text-black/50 leading-relaxed">
              {site.description}
            </p>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
