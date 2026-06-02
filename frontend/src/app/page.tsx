"use client";

import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* 封面图占满全屏 */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-[fadeIn_1.5s_ease-out]"
        style={{ backgroundImage: "url('/images/wallpaper.jpg')" }}
      />
      {/* 淡淡的黑色遮罩 */}
      <div className="absolute inset-0 bg-black/20" />
      {/* 顶栏叠加在封面图上方 */}
      <div className="absolute inset-x-0 top-0 z-30">
        <Navbar />
      </div>
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex h-full items-center justify-center"
      >
        <h1 className="text-3xl font-bold tracking-[0.35em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-5xl">
          空白棱的小站
        </h1>
      </motion.div>
    </main>
  );
}
