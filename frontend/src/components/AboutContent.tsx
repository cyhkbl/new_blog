"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
      className="mx-auto flex w-full max-w-4xl flex-col gap-6"
    >
      {/* Main card */}
      <motion.div variants={item} className="rounded-2xl border border-white/60 bg-white/55 p-8 shadow-sm backdrop-blur-2xl saturate-180 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img src="/images/avatar_without_background.png" alt="头像" className="mx-auto h-36 w-36 rounded-full object-cover" />
          <div className="text-center md:text-left">
            <p className="mt-1 text-base leading-relaxed text-black/70">
              我是一个学生，目前在浙江大学读BME。我的爱好是薅羊毛、Linux美化、羽毛球、狂吃。未来我打算学习和研究量化金融、自然语言处理和天文学。期待认识你！
            </p>
          </div>
        </div>
      </motion.div>

      {/* LinkTree card */}
      <motion.div variants={item}>
        <Link href="/social">
          <div className="group cursor-pointer rounded-2xl border border-white/60 bg-white/55 p-6 shadow-sm backdrop-blur-2xl saturate-180 transition hover:border-black/10 hover:bg-white/70 md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5 text-2xl">🔗</div>
              <h2 className="text-lg font-semibold text-black/80">LinkTree</h2>
              <span className="ml-auto text-black/30 transition group-hover:text-black/60">→</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Moments card */}
      <motion.div variants={item}>
        <div className="rounded-2xl border border-white/60 bg-white/55 p-6 shadow-sm backdrop-blur-2xl saturate-180 md:p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">📷</span>
            <h2 className="text-lg font-semibold text-black/80">我的瞬间</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <img src="/images/ROS春季学校.jpg" alt="" className="w-full rounded-xl object-cover" />
              <p className="text-center text-sm text-black/50">ROS春季学校</p>
            </div>
            <div className="flex flex-col gap-2">
              <img src="/images/南客松S2.jpg" alt="" className="w-full rounded-xl object-cover" />
              <p className="text-center text-sm text-black/50">南客松S2</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
