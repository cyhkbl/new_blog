"use client";

import { motion, useReducedMotion } from "framer-motion";

const links = [
  { label: "Blog", url: "https://cyhkbl.qzz.io/", icon: "https://cdn.simpleicons.org/rss/FF6600" },
  { label: "BiliBili", url: "https://space.bilibili.com/470850381?spm_id_from=333.1007.0.0", icon: "https://cdn.simpleicons.org/bilibili/00A1D6" },
  { label: "Zhihu", url: "https://www.zhihu.com/people/CYH714", icon: "https://cdn.simpleicons.org/zhihu/0084FF" },
  { label: "Telegram", url: "https://t.me/CYH714", icon: "https://cdn.simpleicons.org/telegram/26A5E4" },
  { label: "GitHub", url: "https://github.com/CYH714-github", icon: "https://cdn.simpleicons.org/github/181717" },
  { label: "Facebook", url: "https://www.facebook.com/chenyiheng070104", icon: "https://cdn.simpleicons.org/facebook/1877F2" },
  { label: "Instagram", url: "https://www.instagram.com/chenyiheng070104/", icon: "https://cdn.simpleicons.org/instagram/E4405F" },
  { label: "Twitter", url: "https://www.twitter.com/cyh714_twi/", icon: "https://cdn.simpleicons.org/x/000000" },
  { label: "Spotify", url: "https://open.spotify.com/user/317cbaah45lcw2dw2h4d6to2nsqi?si=989e5fb1c9744e9d", icon: "https://cdn.simpleicons.org/spotify/1DB954" },
  { label: "Reddit", url: "https://www.reddit.com/user/CYH714_reddit", icon: "https://cdn.simpleicons.org/reddit/FF4500" },
  { label: "Discord", url: "https://discordapp.com/users/cyh714#5820", icon: "https://cdn.simpleicons.org/discord/5865F2" },
  { label: "TikTok", url: "https://www.tiktok.com/@cyh714", icon: "https://cdn.simpleicons.org/tiktok/000000" },
  { label: "YouTube", url: "https://www.youtube.com/channel/UCfCCUTX2W--vAziH55_UF9g", icon: "https://cdn.simpleicons.org/youtube/FF0000" },
  { label: "Twitch", url: "https://www.twitch.tv/cyh714", icon: "https://cdn.simpleicons.org/twitch/9146FF" },
  { label: "Pinterest", url: "https://www.pinterest.com/cyh714/", icon: "https://cdn.simpleicons.org/pinterest/BD081C" },
  { label: "LinkedIn", url: "https://www.linkedin.cn/incareer/in/%E9%80%B8%E6%81%92-%E9%99%88-ab16a0247", icon: "https://api.iconify.design/mdi/linkedin.svg?color=0A66C2" },
  { label: "SoundCloud", url: "https://soundcloud.com/chenyiheng070104?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing", icon: "https://cdn.simpleicons.org/soundcloud/FF3300" },
  { label: "Patreon", url: "https://patreon.com/CYH714", icon: "https://cdn.simpleicons.org/patreon/FF424D" },
  { label: "Vimeo", url: "https://vimeo.com/user182052766", icon: "https://cdn.simpleicons.org/vimeo/1AB7EA" },
];

export default function SocialContent() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.02,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-lg flex-col items-center gap-5 py-10"
    >
      <motion.img
        variants={item}
        src="/images/avatar_without_background.png"
        alt="头像"
        className="h-28 w-28 rounded-full object-cover"
      />
      <motion.h1 variants={item} className="text-2xl font-bold text-white/90">
        空白棱
      </motion.h1>
      <motion.p variants={item} className="text-base text-white/60">
        浙江大学 · BME
      </motion.p>

      <div className="mt-6 flex w-full flex-col gap-4">
        {links.map((link) => (
          <motion.a
            key={link.label}
            variants={item}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-4 rounded-2xl border border-white/60 bg-white/55 px-6 py-5 shadow-sm backdrop-blur-2xl saturate-180 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:bg-white/70 hover:shadow-md"
          >
            <img
              src={link.icon}
              alt={`${link.label} logo`}
              className="h-6 w-6 shrink-0"
            />
            <span className="text-base font-medium text-black/80 font-[system-ui,sans-serif]">{link.label}</span>
            <span className="ml-auto text-sm text-black/30 transition font-[system-ui,sans-serif] group-hover:text-black/60">→</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
