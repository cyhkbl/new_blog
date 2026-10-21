const tools = [
  {
    href: "/lyricpost/",
    title: "歌词卡片",
    description:
      "整站移植的 LyricPost：搜歌、挑歌词句子，调配色、字体、圆角、模糊和平台标志，最后导出图片。",
    tag: "图片",
  },
];

export default function ToolsContent() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs tracking-[0.2em] text-[var(--text-secondary)]">TOOLS</p>
        <h1 className="text-2xl font-semibold">小工具</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          几个自用的小东西，纯前端跑，不需要登录。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            className="glass group flex flex-col gap-2 p-5 transition">
            <span className="flex items-center justify-between">
              <span className="text-base font-semibold">{tool.title}</span>
              <span className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                {tool.tag}
              </span>
            </span>
            <span className="text-sm leading-6 text-[var(--text-secondary)]">
              {tool.description}
            </span>
            <span className="mt-1 text-xs text-[var(--text-secondary)] underline underline-offset-4">
              打开
            </span>
          </a>
        ))}
      </div>

      <p className="text-xs text-[var(--text-secondary)]">
        歌词卡片来自{" "}
        <a
          href="https://github.com/palinkiewicz/lyricpost"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4">
          palinkiewicz/lyricpost
        </a>
        （MIT），整个站点原样搬过来跑，没有改动。
      </p>
    </div>
  );
}
