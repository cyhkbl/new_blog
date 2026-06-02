"use client";

import { motion, useReducedMotion } from "framer-motion";

const mySites = [
  { name: "CS 学习站", url: "https://cyhkbl.qzz.io/CS-Learning", description: "计算机科学学习笔记与资源汇总", icon: "💻" },
  { name: "金融学习站", url: "https://cyhkbl.qzz.io/Finance-Learning/", description: "金融市场、量化交易学习笔记", icon: "📈" },
  { name: "Life", url: "https://cyhkbl.qzz.io/Life/", description: "生活记录与随笔", icon: "🌿" },
];

interface FriendLink { name: string; url: string; avatar: string; description: string; }
interface LinkCategory { title: string; links: FriendLink[]; }

const friendCategories: LinkCategory[] = [
  {
    title: "了解一个领域 - 从入门到入土",
    links: [
      { name: "freemediaheckyeah", url: "https://fmhy.net/", avatar: "https://fmhy.net/fmhy.ico", description: "盗版" },
      { name: "樱舞导航", url: "https://www.allcc.cc/", avatar: "https://www.allcc.cc/wp-content/uploads/2022/04/favicon.png", description: "樱花轮舞之末" },
      { name: "CS自学指南", url: "https://csdiy.wiki/", avatar: "https://csdiy.wiki/images/title.png", description: "这是一本计算机的自学指南。" },
      { name: "CTF Wiki", url: "https://ctf-wiki.org/", avatar: "https://ctf-wiki.org/static/img/logo.png", description: "Capture The Flag" },
      { name: "OI Wiki", url: "https://oi-wiki.org/", avatar: "https://oi-wiki.org/images/wordArt.webp", description: "一个免费开放且持续更新的编程竞赛知识整合站点。" },
      { name: "泰拉瑞亚 Wiki", url: "https://terraria.wiki.gg/zh/wiki/Terraria_Wiki", avatar: "https://terraria.wiki.gg/images/NewPromoLogo.png?f3ca3f", description: "" },
      { name: "emu wiki", url: "https://www.china-emu.cn/", avatar: "http://www.china-railway.com.cn/images/t_logo.png", description: "记录高速动车组列车及城市轨道交通列车发展历程" },
      { name: "Wotaku", url: "https://wotaku.wiki/", avatar: "https://wotaku.wiki/asset/same.png", description: "" },
      { name: "原神Wiki", url: "https://baike.mihoyo.com/ys/obc/?bbs_presentation_style=no_header&visit_device=pc", avatar: "https://img.moegirl.org.cn/common/thumb/4/49/%E5%8E%9F%E7%A5%9E%E8%B4%BA%E5%9B%BE_2020%E6%B4%BE%E8%92%99%E7%94%9F%E6%97%A5_%E9%98%BF%E6%89%98%E4%BC%8A%E7%8E%9B.png/560px-%E5%8E%9F%E7%A5%9E%E8%B4%BA%E5%9B%BE_2020%E6%B4%BE%E8%92%99%E7%94%9F%E6%97%A5_%E9%98%BF%E6%89%98%E4%BC%8A%E7%8E%9B.png", description: "" },
    ],
  },
  {
    title: "大学规划与学习",
    links: [
      { name: "Ac-Wiki", url: "https://ac-wiki.org/", avatar: "https://ac-wiki.org/assets/logo_clear.png", description: "大学生的百科全书" },
      { name: "SurviveSJTUManual", url: "https://survivesjtu.gitbook.io/", avatar: "https://vi.sjtu.edu.cn/img/base/Logo.png", description: "上海交通大学生存手册" },
      { name: "南方科技大学飞跃手册", url: "https://sustech-application.com/", avatar: "https://www.sustech.edu.cn/uploads/logo1.png", description: "" },
      { name: "浙江大学本科新生指引", url: "https://zjuers.com/welcome/", avatar: "https://www.zju.edu.cn/_upload/tpl/0b/bf/3007/template3007/static/media/logo.e85b920df15a055ad9bc.png", description: "" },
      { name: "浙江大学课程攻略共享计划", url: "https://qsctech.github.io/zju-icicles/", avatar: "https://www.zju.edu.cn/_upload/tpl/0b/bf/3007/template3007/static/media/logo.e85b920df15a055ad9bc.png", description: "" },
      { name: "统计学自学指南", url: "https://xuankaiwang.github.io/", avatar: "https://bkimg.cdn.bcebos.com/pic/14ce36d3d539b600d0924a9ae850352ac65cb7bb?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,h_288", description: "" },
      { name: "清华大学数学课程学习指南", url: "https://mathloveyou.github.io/", avatar: "https://bkimg.cdn.bcebos.com/pic/63d0f703918fa0ec08faacc53fde4eee3d6d54fb6deb?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536", description: "" },
      { name: "THU-CST-Cracker", url: "https://rekcarc-tsc-uht.readthedocs.io/en/latest/index.html#", avatar: "https://bkimg.cdn.bcebos.com/pic/63d0f703918fa0ec08faacc53fde4eee3d6d54fb6deb?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536", description: "" },
      { name: "ZJU CS - All Sum in One!", url: "https://isshikihugh.github.io/zju-cs-asio/", avatar: "https://www.zju.edu.cn/_upload/tpl/0b/bf/3007/template3007/static/media/logo.e85b920df15a055ad9bc.png", description: "" },
    ],
  },
  {
    title: "优质博客",
    links: [
      { name: "Ednovas的小站", url: "https://ednovas.xyz/", avatar: "https://cdn.jsdelivr.net/gh/wdm1732418365/CDN/New%20folder/icon.png", description: "人生不止眼前的苟且，还有诗与远方" },
      { name: "Sabrina的万事屋", url: "https://merlinblog.xyz/", avatar: "https://merlinblog.xyz/usr/uploads/2020/07/1443918516.jpg", description: "干啥啥不行，吃饭第一名。" },
      { name: "Sukka's Blog", url: "https://blog.skk.moe/", avatar: "https://img10.360buyimg.com/ddimg/jfs/t1/214940/28/13992/13695/622039e0E8283ea56/6176b9c35f4d60ab.webp", description: "童话只美在真实却从不续写" },
      { name: "夜法之书", url: "https://blog.17lai.site/", avatar: "https://blog.17lai.site/favicon.webp", description: "~软件驱动世界~" },
      { name: "Tyooe", url: "https://tyooe.com/", avatar: "https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-10-04%20220848.png", description: "互联网黑科技与资源" },
      { name: "梦雨玲音", url: "https://www.rainlain.com/", avatar: "https://www.rainlain.com/wp-content/uploads/2020/06/cropped-123-scaled-1.jpg", description: "专注于ACG和HIFI领域的主观评测BLOG" },
      { name: "心象蜃気楼", url: "https://www.yayoi.love/", avatar: "https://oss.yayoi.love/blog/image/playstore-icon.png", description: "" },
      { name: "Ivon的部落格", url: "https://ivonblog.com/", avatar: "https://ivonblog.com/img/avatar_ivonhuang.png", description: "這裡是分享GNU/Linux情報、自由開源軟體、電腦手機資訊、人文思辨的所在。" },
      { name: "庭说", url: "https://www.tingtalk.me/", avatar: "https://pbs.twimg.com/profile_images/1141698844872212480/TPV1MO4p_400x400.jpg", description: "保持蓬勃的好奇心" },
      { name: "我不是咕咕鸽", url: "https://blog.laoda.de/", avatar: "https://blog.laoda.de/upload/guguge.webp", description: "learn or earn" },
      { name: "胡萝虎的博客", url: "https://www.huluohu.com/", avatar: "https://www.huluohu.com/wp-content/uploads/2024/06/huluohuicon.png", description: "天下皆白，唯我独黑。" },
      { name: "一星残月拂柳丝", url: "https://www.cnblogs.com/hui-tong", avatar: "https://s2.loli.net/2024/03/06/3mRXfc2HZA9JFzD.jpg", description: "" },
      { name: "云原生实验室", url: "https://icloudnative.io/", avatar: "https://icloudnative.io/img/logo.webp", description: "" },
      { name: "okaa.io", url: "https://okaa.io/", avatar: "http://www.okaa.io/wp-content/uploads/2023/10/AI%E6%94%B9%E5%9B%BE-okaa-589x193-1.png", description: "" },
      { name: "TechFen's Blog", url: "https://www.techfens.com/", avatar: "https://techfens.cachefly.net/image/20220320231057.png", description: "" },
      { name: "华梦博客", url: "https://52huameng.com/", avatar: "https://52huameng.com/logo.webp", description: "IT&ACG上的碎碎念与留学小生活" },
      { name: "Paradox's Website", url: "https://zju-paradox.top/", avatar: "https://zju-paradox.top/image/dog.jpg", description: "未知苦处，不信神佛" },
      { name: "椒盐豆豉", url: "https://blog.douchi.space/", avatar: "https://blog.douchi.space/dino.gif", description: "" },
      { name: "TaurusXin 的独立博客", url: "https://www.taurusxin.com/", avatar: "https://www.taurusxin.com/img/avatar_hu_b4b49e37e925c263.png", description: "永远年轻 永远热泪盈眶" },
      { name: "ShouChen's Blog", url: "https://shouchen.blog/", avatar: "https://shouchen.blog/favicon.webp", description: "" },
      { name: "羽翼城个人博客", url: "https://www.dogfight360.com/blog/", avatar: "https://www.dogfight360.com/blog/wp-content/uploads/2024/06/head.png", description: "" },
      { name: "知了", url: "https://zhile.io/", avatar: "", description: "朝闻道，夕可眠矣。" },
      { name: "Wcowin's Blog", url: "https://wcowin.work/", avatar: "https://s1.imagehub.cc/images/2025/12/06/28380affd86b014a6dcaf082fcc97064.png", description: "Hey, I'm Wcowin~" },
      { name: "fengyqf's blog", url: "https://blog.path8.net/", avatar: "https://cdn.path8.net/blog/wp-content/uploads/2025/12/ico_p8_v1.png", description: "这是fengyqf的博客" },
      { name: "Zq.Lucifer.Wall", url: "https://blog.zqlucifer.com/", avatar: "https://blog.zqlucifer.com/favicon.ico", description: "一个对任何事物都浅尝辄止的资深半瓶子醋~" },
      { name: "Xiaomage's Blog", url: "https://blog.xmgspace.me/", avatar: "https://blog.xmgspace.me/favicon.ico", description: "TECH OTAKUS CHANGE THE WORLD." },
      { name: "一只会飞的旺旺", url: "https://www.wangwangit.com/", avatar: "https://www.wangwangit.com/img/favicon.webp", description: "我始终坚信，分享是学习的一部分!" },
      { name: "咸鱼暄的代码空间", url: "https://xuan-insr.github.io/", avatar: "https://xuan-insr.github.io/logo.ico", description: "来看看咸鱼肆吧！" },
      { name: "Joel on Software", url: "https://www.joelonsoftware.com/", avatar: "https://i0.wp.com/www.joelonsoftware.com/wp-content/uploads/2016/12/11969842.jpg?fit=32%2C32&ssl=1", description: "I'm Joel Spolsky, a software developer in New York City." },
      { name: "Paul Graham", url: "http://ycombinator.com/", avatar: "http://ycombinator.com/arc/arc.png", description: "Paul Graham is a programmer, writer, and investor." },
    ],
  },
];


const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0 } },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const cardClass = "group block rounded-2xl border border-white/60 bg-white/55 p-6 shadow-sm backdrop-blur-2xl saturate-180 transition-all duration-300 cursor-pointer hover:bg-white/65 hover:shadow-md";

function FriendAvatar({ src, name }: { src: string; name: string }) {
  if (!src) return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-sm font-bold text-black/40">{name.charAt(0)}</div>;
  return <img src={src} alt={name} className="h-10 w-10 rounded-full object-cover" onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = "none"; const f = document.createElement("div"); f.className = "flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-sm font-bold text-black/40"; f.textContent = name.charAt(0); t.parentNode?.insertBefore(f, t); }} />;
}

export default function SitesContent() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)]">Links</h1>
      <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">我的其它站点</h2>
      <motion.div variants={container} initial="hidden" animate="show" className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mySites.map((site) => (
          <motion.a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" variants={item} className={cardClass}>
            <div className="text-3xl mb-3">{site.icon}</div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-black transition">{site.name}</h3>
            <p className="mt-2 text-sm text-black/50 leading-relaxed">{site.description}</p>
          </motion.a>
        ))}
      </motion.div>
      {friendCategories.map((category) => (
        <div key={category.title} className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">{category.title}</h2>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.links.map((site) => (
              <motion.a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" variants={item} className={cardClass}>
                <div className="mb-3"><FriendAvatar src={site.avatar} name={site.name} /></div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-black transition">{site.name}</h3>
                {site.description && <p className="mt-2 text-sm text-black/50 leading-relaxed">{site.description}</p>}
              </motion.a>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
