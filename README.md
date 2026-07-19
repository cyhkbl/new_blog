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

Scholar 页面记录学术经历、研究项目、获奖和课程技能，页面地址：

```
https://cyhkbl.qzz.io/Scholar
```

主要编辑这个文件：

```
~/new_blog/frontend/src/components/ScholarContent.tsx
```

路由文件在：

```
~/new_blog/frontend/src/app/Scholar/page.tsx
```

常见修改位置：

| 要改什么 | 怎么改 |
|---|---|
| 学术概览 | 改 `highlights` 数组 |
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
