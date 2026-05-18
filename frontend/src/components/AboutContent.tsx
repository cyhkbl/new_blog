"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function AboutContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-4xl justify-center"
    >
      <motion.div variants={item} className="w-full rounded-2xl border border-white/60 bg-white/55 p-8 shadow-sm backdrop-blur-2xl saturate-180 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img src="/images/avatar_without_background.png" alt="头像" className="mx-auto h-36 w-36 rounded-full object-cover" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">空白棱</h1>
            <p className="mt-3 text-base leading-relaxed text-black/70">
              我是空白棱，目前就读于浙江大学。我热爱技术、金融、生活、二次元，并在博客记录和分享上述方面的见解。
            </p>
          </div>
        </div>

        <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          {["Python", "C++", "AI/ML", "金融", "二次元", "硬件"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm text-black/80 transition hover:border-black/20 hover:bg-white/80"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-8 flex justify-center gap-6 md:justify-start">
          <a
            href="https://github.com/cyhkbl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black/60 transition hover:text-black"
          >
            GitHub
          </a>
          <a
            href="mailto:chenyiheng@zju.edu.cn"
            className="text-sm text-black/60 transition hover:text-black"
          >
            Email
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
