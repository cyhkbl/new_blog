"use client";

import { motion } from "framer-motion";

const links = [
  { label: "GitHub", url: "https://github.com/cyhkbl", icon: "🐙" },
  { label: "博客", url: "/", icon: "📝" },
  // 添加更多链接：
  // { label: "Twitter", url: "https://x.com/xxx", icon: "🐦" },
  // { label: "Telegram", url: "https://t.me/xxx", icon: "✈️" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function SocialContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-8"
    >
      <motion.img
        variants={item}
        src="/images/avatar_without_background.png"
        alt="头像"
        className="h-24 w-24 rounded-full object-cover"
      />
      <motion.h1 variants={item} className="text-xl font-bold text-black/80">
        空白棱
      </motion.h1>
      <motion.p variants={item} className="text-sm text-black/50">
        浙江大学 · BME
      </motion.p>

      <div className="mt-4 flex w-full flex-col gap-3">
        {links.map((link) => (
          <motion.a
            key={link.label}
            variants={item}
            href={link.url}
            target={link.url.startsWith("/") ? undefined : "_blank"}
            rel={link.url.startsWith("/") ? undefined : "noopener noreferrer"}
            className="flex w-full items-center gap-3 rounded-xl border border-white/60 bg-white/55 px-5 py-3.5 shadow-sm backdrop-blur-2xl saturate-180 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:bg-white/70 hover:shadow-md"
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-sm font-medium text-black/80">{link.label}</span>
            <span className="ml-auto text-xs text-black/30">→</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
