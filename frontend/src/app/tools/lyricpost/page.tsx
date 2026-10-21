import type { Metadata } from "next";

import LyricPost from "@/components/LyricPost";

export const metadata: Metadata = {
  title: "歌词卡片 · 空白棱的小站",
  description: "搜歌、选歌词、调样式，导出一张歌词图片。",
};

export default function LyricPostPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs tracking-[0.2em] text-[var(--text-secondary)]">小工具</p>
        <h1 className="text-2xl font-semibold">歌词卡片</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          歌词和封面都只在你的浏览器里处理，不上传服务器，也不保存记录。改自{" "}
          <a
            href="https://palinkiewicz.github.io/lyricpost/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            LyricPost
          </a>
          。
        </p>
      </header>
      <LyricPost />
    </div>
  );
}
