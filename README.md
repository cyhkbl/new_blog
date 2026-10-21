# 空白棱的小站 — 博客使用完全指南

**技术栈:** Next.js + Tailwind CSS + Markdown (gray-matter)
**服务器:** Azure VM (debian), Tailscale IP: `100.82.250.96`
**项目路径:** `~/new_blog/frontend/`

---

## 一、核心概念（对比 Hexo）

| Hexo | 你的新博客 (Next.js) |
|---|---|
| `hexo new "标题"` | 手动创建 `.md` 文件 |
| `_posts/` | `content/articles/` |
| `scaffolds/` | 无模板，直接写 frontmatter |
| `hexo g && hexo d` | `pnpm build`（自动部署） |
| `hexo s` | `pnpm dev`（本地预览） |
| `_config.yml` | `src/lib/constants.ts` + `src/lib/articles.ts` |

---

## 二、发表新文章（最常用）

### 步骤 1：SSH 登录服务器

```bash
ssh 100.82.250.96
```

### 步骤 2：创建文章文件

```bash
cd ~/new_blog/frontend/content/articles/
nano "你的文章标题.md"    # 或用 vim
```

### 步骤 3：写入内容，格式如下

```markdown
---
title: 文章标题
date: 2026-05-17 15:30:00
cover: /images/封面图.jpg   # 可选
tags: [标签1, 标签2]        # 可选
excerpt: 摘要文字            # 可选，不写会自动截取前150字
---

# 正文标题

正文内容，支持标准 Markdown 语法...

![图片描述](/images/xxx.jpg)
```

### 步骤 4：重新构建并重启

```bash
cd ~/new_blog/frontend
pnpm build
# 重启 blog 服务（视你部署方式）
sudo systemctl restart blog    # 如果是 systemd 服务
# 或 pm2 restart blog          # 如果用 pm2
```

---

## 三、修改"关于我"页面

"关于我"不是 Markdown，是 React 组件，编辑这个文件：

```
~/new_blog/frontend/src/components/AboutContent.tsx
```

修改内容说明：

| 要改什么 | 怎么改 |
|---|---|
| 头像 | 改 `<img src="/images/avatar.png">` 换头像 |
| 名字 | 改 `"空白棱"` 那行 |
| 简介 | 改 `"我是空白棱..."` 那段文字 |
| 标签 | 改 `["Python", "C++", "AI/ML", ...]` 数组 |
| GitHub/邮箱链接 | 改 `href=""` 里的地址 |

改完后同样需要 `pnpm build` + 重启服务。

---

## 四、修改 Scholar 页面

Scholar 页面记录学术经历、研究项目、获奖和技术栈，外观参考 `https://mem.ac/` 的学术主页布局，页面地址：

```
https://cyhkbl.qzz.io/Scholar
```

主要编辑这个文件：

```
~/new_blog/frontend/src/components/ScholarAcademicContent.tsx
```

路由文件在：

```
~/new_blog/frontend/src/app/Scholar/page.tsx
```

`/Scholar` 使用独立的全屏学术主页外壳，不套博客默认背景图和顶栏。相关特判在：

```
~/new_blog/frontend/src/components/SiteFrame.tsx
```

常见修改位置：

| 要改什么 | 怎么改 |
|---|---|
| 学术概览 | 改 `highlights` 数组 |
| 个人链接 | 改 `profileLinks` 数组 |
| 教育经历 | 改 `educationTimeline` 数组 |
| 研究经历时间线 | 改 `researchTimeline` 数组 |
| 项目经历 | 改 `projectCards` 数组 |
| 获奖/服务 | 改 `awards` 数组 |
| 活动/实践 | 改 `activityGroups` 数组 |
| 研究方向 | 改 `interests` 数组 |
| 技术栈 | 改 `techStack` 数组 |

改完后执行：

```bash
cd ~/new_blog/frontend
pnpm build
sudo systemctl restart blog.service
```

---

## 五、修改网站名称和导航

网站标题和描述在：

```
~/new_blog/frontend/src/lib/constants.ts
```

```typescript
export const siteConfig = {
  name: "空白棱的小站",            // ← 网站标题
  description: "技术 · 金融 · 生活 · 二次元",  // ← 副标题
};
```

顶部导航实际在：

```
~/new_blog/frontend/src/components/Navbar.tsx
```

修改 `navLinks` 数组即可：

```typescript
const navLinks = [
  { href: "/articles", label: "文章" },
  { href: "/Scholar", label: "Scholar" },
  { href: "/about", label: "关于我" },
  { href: "/sites", label: "Links" },
];
```

内页背景图映射在：

```
~/new_blog/frontend/src/components/SiteFrame.tsx
```

---

## 六、上传图片

图片统一放在：`~/new_blog/frontend/public/images/`

上传方式：

```bash
scp 本地图片.jpg 100.82.250.96:~/new_blog/frontend/public/images/
```

在文章中引用：

```markdown
![描述](/images/图片.jpg)
```

封面图同理：

```markdown
---
cover: /images/封面.jpg
---
```

---

## 七、删除文章

直接删除 `content/articles/` 下的 `.md` 文件即可：

```bash
rm ~/new_blog/frontend/content/articles/"要删的文章.md"
cd ~/new_blog/frontend && pnpm build && sudo systemctl restart blog.service
```

---

## 八、本地预览（可选）

如果你想在本地改完预览再部署：

```bash
# 在 WSL 里
cd ~/new_blog/frontend
pnpm dev
# 浏览器打开 http://localhost:3000
```

---

## 九、常用命令速查

```bash
# SSH 登录
ssh 100.82.250.96

# 进入博客目录
cd ~/new_blog/frontend

# 新建文章
nano content/articles/"标题.md"

# 重新构建
pnpm build

# 重启服务（视你部署方式）
sudo systemctl restart blog.service
# 或 pm2 restart blog
# 或 pnpm start

# 查看服务状态
sudo systemctl status blog.service
```

---

## 十、文章 frontmatter 完整字段

```yaml
---
title: 必填，文章标题
date: 2026-05-17 15:30:00    # 必填，发布时间
cover: /images/xxx.jpg        # 可选，列表页封面图
tags: [标签1, 标签2]          # 可选，标签数组
excerpt: 自定义摘要           # 可选，不写自动截取
---
```

---

---

---

---

---

## 十一、小工具（/tools）

顶栏「小工具」是入口页，目前挂了一个：歌词卡片，地址是 `/lyricpost/`。

这个工具基于 [palinkiewicz/lyricpost](https://github.com/palinkiewicz/lyricpost)（MIT，上游提交 `36bd234`），
源码在 `frontend/public/lyricpost/`。UI 保持原样，数据源和出错路径换成了参考站
[lijianxiong.blog/spotify](https://lijianxiong.blog/spotify/) 的做法。

nginx 给它单独开了一段（服务器上的 `/etc/nginx/sites-available/cyhkbl.qzz.io`）：

```nginx
# LyricPost 小工具（原版静态应用，palinkiewicz/lyricpost，MIT）
location = /lyricpost { return 301 /lyricpost/; }
location /lyricpost/ {
    alias /home/henry/new_blog/frontend/public/lyricpost/;
    index index.html;
}
```

改完执行：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 数据源

| 用途 | 接口 | 说明 |
|---|---|---|
| 搜歌 | iTunes Search API（`itunes.apple.com/search`，`country=HK`） | 不需要 key，每条结果自带 `artworkUrl100`，换成 `600x600bb` 当封面 |
| 歌词 | LRCLIB（`lrclib.net/api/search`） | 免费、不需要 key |

搜歌原来走 Last.fm，问题是它的公共 demo key 会限流，而且大量中文歌的 `album` 是 `[unknown]`、
`image` 全是空串或默认星星占位图，`track.getInfo` 也补不出封面。换成 iTunes 之后这两个问题一起没了。

查询会同时用简体和港繁（OpenCC）各搜一遍，复选歌手精确命中的结果，再补曲名命中的结果。
OpenCC 的脚本从 jsdelivr 加载，加载失败会退化成只用原查询，不影响搜索。

### 本地改动的文件

| 文件 | 改了什么 |
|---|---|
| `classes/DataFetcher.js` | 搜歌整体换成 iTunes（简繁双查、去重、曲名/歌手匹配，全部落空时再来一次不限字段的普通搜索）；歌词请求失败（503/429/非 JSON）不再抛异常，返回 null 走原有的「没找到歌词」界面，失败重试一次，artist 是一整句描述时退一步只按歌名再查 |
| `classes/data/Song.js` | 封面取最大的一档并跳过 Last.fm 的星星占位图（iTunes 数据下就等于直接取 600×600） |
| `classes/constants.js` | 新增 `TRANSPARENT_PIXEL`、`LASTFM_PLACEHOLDER_COVER` 两个常量 |
| `classes/SongImageController.js` | 平台标签选「无」时，把 `img.src` 设成透明像素而不是空字符串 |
| `index.html` | 引入 opencc-js；四处 `<img src="">` 换成 1×1 透明像素 |
| `sw.js` | `CACHE_NAME` 从 `v4` 提到 `v9` |

空字符串的 `src` 会被浏览器解析成当前页面地址，界面上是破图图标，html2canvas 导出时也会报 `Error loading image`，
所以统一换成透明像素，排版和 CSS 里的占位背景都不变。

### 跟进上游新版

```bash
cd ~/new_blog/frontend/public
rm -rf lyricpost
git clone --depth 1 https://github.com/palinkiewicz/lyricpost.git lyricpost
rm -rf lyricpost/.git lyricpost/.screenshots
# 重新套用上表里的补丁
cd ~/new_blog && git add -A && git commit -m "chore: bump lyricpost" && git push
```

注意：重新克隆会覆盖补丁，改完要把 `sw.js` 的 `CACHE_NAME` 再提一个版本，否则老访客继续用缓存里的旧文件。

### 其它

- 它是独立的静态页面，不在 Next.js 路由里，所以入口页用的是普通 `<a href="/lyricpost/">`，不是 `next/link`。
- 导出用 html2canvas 截 DOM，全部在浏览器里跑，不经过本站后端。
- 图标字体来自 Google Fonts，opencc-js 来自 jsdelivr，网络到不了的话分别会退化成文字和原查询。

---

## 十二、静态子站（zensical）

`/Finance-Learning/`、`/CS-Learning/`、`/Life/` 三个站是 zensical 生成的静态页面，
源码在 `~/zensical-sites/<名字>/`，nginx 直接把 `alias` 指到各自的 `site/` 目录。

zensical 装在独立 venv 里（系统 Python 是 3.11，别用系统 pip 装）：

```bash
python3 -m venv ~/zensical-venv
~/zensical-venv/bin/pip install -U zensical
```

重建某个站：

```bash
cd ~/zensical-sites/CS-Learning
git pull
~/zensical-venv/bin/zensical build --clean
```

三个一起重建：

```bash
for s in Finance-Learning CS-Learning Life; do
  cd ~/zensical-sites/$s && ~/zensical-venv/bin/zensical build --clean
done
```

重建完不用重启任何服务，nginx 直接读文件。CS-Learning 仓库另外配了 GitHub Actions
（`.github/workflows/docs.yml`），推送到 main 会自动发布到 GitHub Pages，但**不会**更新服务器上这份副本。

---

## 十三、Cloudflare 隧道

隧道 `f47c455e-1f2b-404d-a578-3a796e8579e9`（名字 `blog`）跑在服务器上，
**实际生效的是 Cloudflare 后台的远程配置**，`~/.cloudflared/config.yml` 里的 ingress 不生效，
改域名要么在 Zero Trust 后台改，要么调 API：

```
PUT /accounts/<account_id>/cfd_tunnel/<tunnel_id>/configurations
```

当前对外只保留两条路由：

| 主机名 | 后端 |
|---|---|
| `cyhkbl.qzz.io` | `http://localhost:80`（nginx） |
| `proxy.cyhkbl.qzz.io` | `http://localhost:10000`（本机 xray） |

`proxy2.cyhkbl.qzz.io` 走的是另一条隧道 `fb68c832-…`（跑在 Ubuntu 上，同样是 xray 的 10000 端口）。
