# 个人博客重写 Spec v3 — 全栈版

## 概述

用 Next.js + FastAPI + PostgreSQL + Docker Compose 搭建"空白棱的小站"个人博客全栈应用。前端追求**新海诚式色彩、毛玻璃质感、灵动动画**的二次元现代风格；后端提供用户鉴权、评论功能。先本地搭好跑通，部署以后再说——Docker Compose 保证将来随便哪台 Linux 机器 `docker compose up -d` 就能跑。

设计灵感：新海诚动画（天蓝、云白、浅紫的梦幻色调）、《原神》/《明日方舟》的扁平化半透明 UI、Vercel 官网的极简排版。

---

## 技术栈

| 层面 | 选型 | 理由 |
|------|------|------|
| 前端框架 | Next.js 15 (App Router) | SSR + SSG，SEO 友好 |
| 前端样式 | Tailwind CSS v4 + 手写 CSS | 内置 blur/opacity 工具类 |
| 前端动画 | Framer Motion | spring 物理弹性动画 |
| 内容格式 | MDX（`@next/mdx` + `gray-matter`） | 文章内嵌 React 组件 |
| 语法高亮 | Shiki | VS Code 主题级代码高亮 |
| 后端框架 | **FastAPI** (Python, uv) | 异步高性能，自动 OpenAPI 文档 |
| 数据库 | **PostgreSQL 16** | 生产级关系型数据库 |
| ORM | **SQLAlchemy 2.0** + **Alembic** | Python 标准 ORM + 迁移 |
| 鉴权 | **JWT**（access + refresh token） | 无状态鉴权 |
| 容器化 | **Docker Compose** | 一键启动前端+后端+数据库 |
| 包管理 | 前端 pnpm / 后端 uv | |

---

## 项目架构

```
new_blog/
├── frontend/                  # Next.js 前端
│   ├── public/
│   │   └── images/
│   │       ├── wallpaper.jpg          # 首页背景（从旧博客 picture_bed 迁移）
│   │       ├── wallpaper-blur.jpg     # 低饱和模糊版，子页面装饰背景
│   │       ├── avatar.png             # 头像
│   │       └── logo.png               # 无背景头像
│   ├── content/
│   │   └── articles/
│   │       └── hello-world.mdx
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # 首页 landing page
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx           # 文章列表
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # 文章详情 + 评论区
│   │   │   ├── about/
│   │   │   │   └── page.tsx           # 关于我
│   │   │   ├── sites/
│   │   │   │   └── page.tsx           # 我的其它站点
│   │   │   └── login/
│   │   │       └── page.tsx           # 登录/注册
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # 导航栏（毛玻璃 + 登录状态）
│   │   │   ├── ArticleCard.tsx        # 文章卡片
│   │   │   ├── Footer.tsx
│   │   │   ├── GlassCard.tsx          # 通用毛玻璃卡片
│   │   │   ├── StarDust.tsx           # CSS 星尘背景粒子
│   │   │   ├── MouseGlow.tsx          # 鼠标跟随光晕
│   │   │   ├── ProgressBar.tsx        # 阅读进度条
│   │   │   ├── ParallaxBg.tsx         # 视差背景
│   │   │   ├── TagPill.tsx            # 标签 pill
│   │   │   ├── CopyButton.tsx         # 代码块复制
│   │   │   ├── CommentSection.tsx     # 评论区
│   │   │   └── mdx/
│   │   │       ├── InfoCard.tsx
│   │   │       └── ImageGallery.tsx
│   │   └── lib/
│   │       ├── articles.ts            # 读取本地 MDX
│   │       ├── api.ts                 # 后端 API 客户端
│   │       ├── auth.ts                # JWT token 管理
│   │       └── constants.ts
│   ├── mdx-components.tsx
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── Dockerfile
│   └── package.json
│
├── backend/                   # FastAPI 后端
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── comment.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── comment.py
│   │   │   └── common.py
│   │   ├── routers/
│   │   │   ├── auth.py                # POST /login, /register, /refresh
│   │   │   ├── articles.py            # GET /articles
│   │   │   └── comments.py            # CRUD /articles/{slug}/comments
│   │   ├── services/
│   │   ├── dependencies.py
│   │   └── utils/
│   │       └── security.py            # JWT 编解码、密码哈希
│   ├── alembic/
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── tests/
│
├── docker-compose.yml
├── .env.example
└── SPEC.md
```

---

## 站点结构

```
/                  → 首页（全屏背景 + 标题，无导航栏）
/articles          → 文章列表（按时间倒序）
/articles/[slug]   → 文章详情 + 评论区
/about             → 关于我
/sites             → 我的其它站点
/login             → 登录/注册
```

### 导航

首页（`/`）是独立全屏 landing page，**无导航栏**。主站页面有统一顶部导航栏：

- Logo（头像圆形） + "空白棱的小站"
- 链接：文章 | 关于我 | 我的其它站点
- 右侧：未登录 → "登录" 按钮；已登录 → 用户头像 + 下拉菜单（退出）
- 毛玻璃效果，滚动后透明度加深

---

## 数据库设计

### users 表

```sql
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(32) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name  VARCHAR(64),
    avatar_url    VARCHAR(512),
    role          VARCHAR(16) DEFAULT 'user',  -- 'admin' | 'user'
    created_at    TIMESTAMP DEFAULT NOW()
);
```

### comments 表

```sql
CREATE TABLE comments (
    id          SERIAL PRIMARY KEY,
    article_slug VARCHAR(255) NOT NULL,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    parent_id   INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_comments_slug ON comments(article_slug);
```

---

## 后端 API 设计

基础路径：`/api/v1`

### 鉴权

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册（username, email, password） |
| POST | `/auth/login` | 登录，返回 access_token + refresh_token |
| POST | `/auth/refresh` | 刷新 access_token |
| GET  | `/auth/me` | 获取当前用户信息 |

access_token 有效期 30 分钟，refresh_token 7 天。

### 文章（只读，正文由前端 MDX 渲染）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/articles` | 文章列表元数据（title, date, excerpt, slug, tags, comments_count） |
| GET | `/articles/{slug}` | 单篇文章元数据 |

### 评论（需登录）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/articles/{slug}/comments` | 获取评论列表（含用户信息，支持嵌套回复） |
| POST | `/articles/{slug}/comments` | 发表评论 |
| PUT  | `/comments/{id}` | 编辑自己的评论 |
| DELETE | `/comments/{id}` | 删除自己的评论（admin 可删任意） |

---

## 前端页面设计

### 1. 首页 `/`

全屏 landing page，极简但有冲击力：

- **背景**：全屏二次元插画（本地 `wallpaper.jpg`），`background-size: cover`
- **动态叠加**：半透明深色渐变 + CSS 星尘粒子（~20 个白色小圆点缓慢漂浮）
- **中央**：
  - 标题："空白棱的小站"（~5rem，白色，text-shadow 粉紫发光）
  - 副标题："技术 · 金融 · 生活 · 二次元"
  - 向下箭头（Framer Motion bounce）
- **动画**：背景视差 + 鼠标反向位移，标题 spring fade-in
- **无导航栏**

### 2. 文章列表 `/articles`

- 毛玻璃卡片列表，stagger 入场
- 卡片：标题、日期、摘要、封面缩略图、💬 评论数
- hover：`scale(1.02)` + 紫色光晕
- 分页：每页 10 篇

### 3. 文章详情 `/articles/[slug]`

- 768px 居中阅读区，MDX 渲染
- 顶部：标题、日期、阅读时间、tags
- 正文：Noto Serif SC 衬线体，Shiki 代码高亮 + 复制按钮，引用块毛玻璃
- 顶部紫色渐变阅读进度条
- **评论区**（正文下方）：
  - 评论输入框（需登录，未登录显示"登录后评论"链接）
  - 评论列表（按时间正序，支持嵌套回复）
  - 每条评论：头像 + 用户名 + 时间 + 内容 + 回复按钮
- 底部：上/下一篇导航

### 4. 关于我 `/about`

- 居中大卡片，头像 + 渐变旋转光环
- 个人介绍 + 兴趣标签 pill（hover 发光）
- 社交链接（GitHub、Email）

### 5. 我的其它站点 `/sites`

- 3 列卡片网格，hover 3D 倾斜
- CS学习站 / 金融学习站 / Life

### 6. 登录/注册 `/login`

- 毛玻璃居中卡片，登录/注册 tab 切换
- 登录成功后 JWT 存 httpOnly cookie，跳转回上一页

---

## 图片资源

所有图片放在 `frontend/public/images/`，从旧博客 `picture_bed` 仓库手动拷贝，不依赖外部 CDN。

| 文件名 | 说明 |
|--------|------|
| `wallpaper.jpg` | 首页全屏背景（粉发少女坐月牙） |
| `wallpaper-blur.jpg` | 低饱和模糊版，用 ImageMagick 生成：`convert wallpaper.jpg -blur 0x40 -modulate 100,50 wallpaper-blur.jpg` |
| `avatar.png` | 头像 |
| `logo.png` | 无背景头像 |

---

## 视觉设计规范

### 色彩

```css
:root {
  --primary: #7c3aed;
  --primary-light: #a78bfa;
  --accent: #f472b6;
  --accent-light: #fbcfe8;
  --sky-blue: #7dd3fc;
  --bg-dark: #0f0b1a;
  --bg-glass: rgba(255, 255, 255, 0.06);
  --bg-glass-hover: rgba(255, 255, 255, 0.1);
  --bg-glass-strong: rgba(255, 255, 255, 0.15);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-glass: rgba(255, 255, 255, 0.1);
  --border-glow: rgba(124, 58, 237, 0.3);
}
```

### 字体

```css
--font-heading: 'M PLUS Rounded 1c', 'Noto Sans SC', sans-serif;
--font-body: 'Noto Serif SC', 'Georgia', serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 毛玻璃

```css
.glass {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### 动画（Framer Motion）

| 元素 | 动画 |
|------|------|
| 首页标题 | spring fade-in + slide-up |
| 首页背景 | 视差 + 鼠标反向位移 |
| 文章卡片 | stagger 入场 + hover scale + 紫色光晕 |
| 路由切换 | AnimatePresence 淡入淡出 |
| 导航栏 | 滚动后透明度变化 |
| 头像光环 | CSS conic-gradient 旋转 |
| 评论提交 | 成功后 fade-in 新评论 |
| 站点卡片 | 鼠标 3D 倾斜 |

### 微交互

- 点击涟漪效果（CSS `@keyframes ripple`）
- 鼠标光晕（淡紫色 `radial-gradient` 跟随鼠标）
- CSS 星尘粒子背景（纯 CSS，~15 个浮动小圆点）
- Lottie 装饰（loading / 空状态）

---

## Docker Compose（本地开发 + 未来部署）

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: blog
      POSTGRES_USER: blog
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U blog"]
      interval: 5s
      retries: 5

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://blog:${DB_PASSWORD}@postgres:5432/blog
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8000/api/v1
    depends_on:
      - backend
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

### 环境变量（.env.example）

```env
DB_PASSWORD=change_me_in_production
JWT_SECRET=change_me_to_a_random_string
```

### 本地启动

```bash
cp .env.example .env   # 编辑填入密码
docker compose up --build
# 前端: http://localhost:3000
# 后端: http://localhost:8000/docs (Swagger UI)
```

---

## 开发步骤

### Phase 1：后端骨架
1. 初始化 `backend/`，`uv init` + 安装 fastapi, sqlalchemy, alembic, python-jose, passlib, psycopg2
2. 编写 SQLAlchemy 模型（User, Comment）
3. Alembic 初始化 + 生成迁移
4. 实现 `/auth` 路由（注册、登录、JWT）
5. 实现 `/articles/{slug}/comments` CRUD
6. 编写后端 Dockerfile

### Phase 2：前端骨架
7. `pnpx create-next-app@latest frontend` 初始化
8. 安装 framer-motion, @next/mdx, gray-matter, shiki
9. 拷贝图片到 `frontend/public/images/`，用 ImageMagick 生成模糊版壁纸
10. 实现全局装饰（StarDust + MouseGlow）
11. 实现首页 landing page
12. 实现 Navbar（毛玻璃 + 登录状态）

### Phase 3：文章系统
13. 实现 GlassCard + ArticleCard
14. 实现文章列表页（从后端拉取元数据 + 本地 MDX 渲染正文）
15. 实现文章详情页（MDX + Shiki + 阅读进度条）
16. 实现 CommentSection（评论列表 + 发表 + 回复）

### Phase 4：其余页面
17. 实现"关于我"
18. 实现"我的其它站点"
19. 实现登录/注册页

### Phase 5：容器化
20. 编写前端 Dockerfile
21. `docker-compose.yml` 联调三个容器，本地跑通

### Phase 6：打磨
22. 响应式适配 + 汉堡菜单
23. 找 Lottie 动画
24. 写示例 MDX 文章
25. 性能优化 + SEO

---

## 注意事项

- 文章正文由前端 MDX 文件渲染（`content/` 目录），后端只存评论数据
- 后端不需要文章 CRUD——文章是开发者手写 MDX 发布的
- JWT 存 httpOnly cookie（防 XSS）
- CORS 配置：前端域名允许调用后端 API
- Alembic 迁移：`docker compose exec backend alembic upgrade head`
- 前端 `NEXT_PUBLIC_API_URL`：Docker 内用 `http://backend:8000`，本地开发用 `http://localhost:8000`
- 图片用 `<img>` 而非 Next.js `<Image>`（不依赖图片优化服务）
- 中文排版：`line-height: 1.8`，段首不缩进，段间留白
