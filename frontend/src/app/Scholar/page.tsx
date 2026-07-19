import type { Metadata } from "next";

import ScholarContent from "@/components/ScholarContent";

export const metadata: Metadata = {
  title: "Scholar | 空白棱的小站",
  description: "学术经历、研究项目、获奖与阶段性方向",
};

export default function ScholarPage() {
  return <ScholarContent />;
}
