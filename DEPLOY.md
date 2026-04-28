# 静态博客部署指南

## 方式一：PM2 守护进程

### 1. 服务器准备

```bash
# 安装 Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2
sudo npm install -g pm2
```

### 2. 拉取代码并构建

```bash
git clone <your-repo-url> new_blog
cd new_blog/frontend
npm install
npm run build
```

### 3. 启动

```bash
# PM2 启动 Next.js
pm2 start npm --name "blog" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### 4. Nginx 反代

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. HTTPS（可选但推荐）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 自动获取并配置 SSL
sudo certbot --nginx -d your-domain.com
```

---

## 方式二：纯静态文件（Nginx 直接托管）

如果不需要 SSR，可以导出纯静态 HTML：

### 1. 修改 next.config.ts

```ts
const nextConfig = {
  output: "export",  // 添加这行
  // ...其他配置
};
```

### 2. 构建

```bash
npm run build
# 静态文件生成在 out/ 目录
```

### 3. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/blog/out;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # 缓存静态资源
    location /_next/static/ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /images/ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

```bash
# 拷贝文件
sudo mkdir -p /var/www/blog
sudo cp -r out/* /var/www/blog/

# 重启 nginx
sudo systemctl reload nginx
```

---

## 更新博客

```bash
cd new_blog/frontend
git pull
npm install  # 如果有新依赖
npm run build
pm2 restart blog  # 方式一
# 或重新拷贝 out/ 目录  # 方式二
```

---

## 多服务器部署

每台服务器重复上述步骤即可。推荐用 Git 仓库管理代码：

```bash
# 服务器 A
git clone <repo> && cd new_blog/frontend && npm i && npm run build && pm2 start npm --name "blog" -- start

# 服务器 B
git clone <repo> && cd new_blog/frontend && npm i && npm run build && pm2 start npm --name "blog" -- start
```
