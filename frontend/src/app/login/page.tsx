import GlassCard from "@/components/GlassCard";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center">
      <GlassCard className="w-full p-8 md:p-10">
        <div className="mb-8 flex gap-3">
          <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900">登录</button>
          <button className="rounded-full border border-white/15 px-5 py-2 text-sm text-white">注册</button>
        </div>
        <div className="grid gap-4">
          <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none placeholder:text-slate-400" placeholder="用户名" />
          <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none placeholder:text-slate-400" placeholder="密码" type="password" />
          <button className="rounded-2xl bg-[var(--primary)] px-4 py-3 font-medium text-white transition hover:bg-[var(--primary-light)]">继续</button>
        </div>
      </GlassCard>
    </div>
  );
}
