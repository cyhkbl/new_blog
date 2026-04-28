import GlassCard from "@/components/GlassCard";

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl justify-center">
      <GlassCard className="w-full p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative mx-auto h-36 w-36 rounded-full bg-[conic-gradient(from_90deg,rgba(244,114,182,0.95),rgba(125,211,252,0.85),rgba(167,139,250,0.95),rgba(244,114,182,0.95))] p-[3px]">
            <div className="h-full w-full rounded-full bg-white p-2">
              <img src="/images/avatar.png" alt="头像" className="h-full w-full rounded-full object-cover" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">空白棱</h1>
            <p className="mt-3 text-base leading-relaxed text-black/70">
              我是空白棱，目前就读于浙江大学。我热爱技术、金融、生活、二次元，并在博客记录和分享上述方面的见解。
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          {["Python", "C++", "AI/ML", "金融", "二次元", "硬件"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm text-black/80 transition hover:border-black/20 hover:bg-white/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-6 md:justify-start">
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
        </div>
      </GlassCard>
    </div>
  );
}
