import type { Metadata } from "next";

import ToolsContent from "@/components/ToolsContent";

export const metadata: Metadata = {
  title: "小工具 · 空白棱的小站",
  description: "自己写着玩的几个小工具，第一个是歌词卡片生成器。",
};

export default function ToolsPage() {
  return <ToolsContent />;
}
