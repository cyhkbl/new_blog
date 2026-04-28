export const siteConfig = {
  name: "空白棱的小站",
  description: "技术 · 金融 · 生活 · 二次元",
  navItems: [
    { href: "/", label: "首页" },
    { href: "/articles", label: "文章" },
    { href: "/about", label: "关于我" },
    { href: "/sites", label: "我的其它站点" },
  ],
} as const;

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
