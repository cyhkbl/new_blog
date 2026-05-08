---
title: 使用Zensical管理你的Docs
date: 2025-12-06 12:04:46
cover: /images/zensical.png
---

# 使用Zensical管理你的Docs

> Zensical 是一个现代静态网站生成器，旨在简化项目文档的构建和维护。它由 Material for MkDocs 的创建者开发，并共享相同的核心设计原则和理念——开箱即用，易于使用，并提供强大的定制选项。

这里我以自己的CS Learning Notes为例，介绍如何使用Zensical来管理和发布文档网站。

## 在项目文件夹里创建虚拟环境

```powershell
cd "D:\projects\Blank's CS Learning"
python -m venv .venv
```

然后激活（PowerShell）：

```powershell
.\.venv\Scripts\Activate.ps1
```

如果你第一次在 PowerShell 里激活失败，通常是执行策略限制。你可以（只改当前用户）：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

然后重新执行激活命令。激活成功后命令行前面一般会出现 (.venv)。

之后每次使用都要先激活环境，否则会找不到 zensical 命令。

## 在虚拟环境里安装 Zensical

```powershell
pip install zensical
```

## 创建新项目

安装完 Zensical 后，你可以使用 `zensical` 可执行文件来启动你的项目文档。前往项目所在的目录并输入：

```powershell
zensical new .
```

## 常用命令

`zensical serve`：在本地启动一个开发服务器，实时预览你的文档网站。链接是<http://localhost:8000/>

`zensical build`：生成静态网站文件，准备部署到生产环境。

## 使用GitHub Actions自动化部署

在仓库根目录下，创建一个新的 GitHub Actions 工作流，例如`.github/workflows/docs.yml`，并将以下内容粘贴：

```yaml
name: Documentation
on:
  push:
    branches:
      - master
      - main
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/configure-pages@v5
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: pip install zensical
      - run: zensical build --clean
      - uses: actions/upload-pages-artifact@v4
        with:
          path: site
      - uses: actions/deploy-pages@v4
        id: deployment
```

注意，workflow 里写的是：

```yaml
- uses: actions/upload-pages-artifact@v4
  with:
    path: site
```

所以 zensical.toml 的配置里必须确保最终输出目录就是 site/（也就是 site_dir = "site" ）。

否则就会上传空目录，Pages 会是空白/404。

这个 workflow 是 Pages 官方 Actions 流水线（artifact → deploy），不是 mkdocs gh-deploy 那种推 gh-pages 分支的方式。

当向的远程仓库推送新的提交时，静态站点将自动构建和部署。这样，就不需要手动运行构建和部署命令了。

## 创建GitHub Pages站点

首先，创建一个仓库（例如 `cs-learning`），然后在仓库的设置中启用 GitHub Pages，选择部署来源为 `GitHub Actions` 。

![启用 GitHub Pages](/images/pages.png)

完成后，GitHub 会为你提供一个站点 URL，例如 `https://cyhkbl.github.io/CS-learning/` 。

然后，把本地的整个项目推送到远程仓库即可。

## 参考

- [Zensical 官方文档](https://zensical.org/)

- [Zensical 中文教程](https://wcowin.github.io/Zensical-Chinese-Tutorial/)