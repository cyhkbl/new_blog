---
title: Hexoの千层套路
date: 2023-08-08 21:35:30
cover: /images/hexo.png
---

# Hexoの千层套路

最开始，我想用jekyll搭建博客，然而由于看不懂Github上的英文文档，“轻松”放弃；之后，我听说hugo的速度很快，但是不知道怎么回事，主题一直配置不好，最后决定再也不搞博客了（嘿嘿）。发现hexo不错是在搜索Spotify电脑破解版时，发现了一个非常优质的博客“Ednovas的小站”。这个站就是借助hexo生成的，我的兴趣马上就来了。

不过事情并非那么简单，当我开始用hexo时，发现这个东西也没比hugo简单多少……

## 下载与配置

首先安装[Node.js](https://nodejs.org/)和[Git](https://git-scm.com/download/win)

在Git Bash中配置自己的用户名和邮箱：

```sh
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub注册邮箱"
```

并生成SSH Key：
`ssh-keygen -t rsa -C "你的GitHub注册邮箱"`

找到生成的.ssh的文件夹中的id_rsa.pub密钥，将内容全部复制

然后使用winget安装hexo：`$ npm install -g hexo-cli`

在自己想存放博客文件夹的位置，输入`hexo init 博客名称`

## 网站配置

这里我直接使用了Github Pages的网站托管。先在Github新建一个仓库，注意名字必须是“你的Github用户名.github.io”。

打开Github设置中的“SSH and GPG keys”页面，新建一个SSH Key并把id_rsa.pub密钥内容粘贴上去：

![ssh_key](/images/b9dDaT1h8juqB3R.png)

在你的博客文件夹内，找到根目录下的_config.yml文件，修改deploy中的内容：

```yml
deploy:
type: git
repo: 这里填入你之前在GitHub上创建仓库的完整路径，记得加上 .git
branch: main
```

## 更换主题

这里我使用的是[Butterfly](https://butterfly.js.org/)主题。

在博客主题（theme）目录里，输入以下代码并删去.git文件即可：
`git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly`

接下来，把根目录下的_config.yml文件中的theme改为butterfly即可：

`theme: butterfly`

## 开始写作吧！

之后的配置因人而异，一般可以根据官方文档修改博客根目录下的_config.yml和theme目录下的_config.yml以自定义你的博客。

下面列出hexo的常用命令：

新建文章：`hexo new "（文章标题）"`

清除public文件夹中的内容：`hexo clean`

生成public文件夹的内容：`hexo generate`

部署到仓库：`hexo deploy`

在本地预览博客：`hexo server`

## Butterfly主题的配置覆盖

在 hexo 的根目录创建一个文件 _config.butterfly.yml，Hexo 会自动合并主题中的 _config.yml 和 _config.butterfly.yml 里的配置，如果存在同名配置，会使用 _config.butterfly.yml 的配置，其优先度较高。

（25.11更新：我就是在“不小心”删除了整个博客文件夹后，找回了这个文件，大大减少了配置的工作量）

## 为你的博客创建一个友情链接吧！

> 友情链接页文件名不一定是 link, 例子中的 link 只是一个示例。记得添加 type: “link”

- 前往你的 Hexo 的根目录

- 输入 hexo new page link

- 你会找到 source/link/index.md 这个文件

- 修改这个文件，格式如下：

```md
---
title: 友情链接
date: 2022-06-07 22:17:49
type: 'link'
---
```

在 Hexo 根目录中的 source/_data（如果没有 _data 文件夹，请自行创建），创建一个文件 link.yml，并修改内容（下面是示例）：

```yml
- class_name: 友情链接
  class_desc: 那些人，那些事
  link_list:
    - name: Hexo
      link: https://hexo.io/zh-tw/
      avatar: https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg
      descr: 快速、简单且强大的网志框架

- class_name: 网站
  class_desc: 值得推荐的网站
  link_list:
    - name: Youtube
      link: https://www.youtube.com/
      avatar: https://i.loli.net/2020/05/14/9ZkGg8v3azHJfM1.png
      descr: 视频网站
    - name: Weibo
      link: https://www.weibo.com/
      avatar: https://i.loli.net/2020/05/14/TLJBum386vcnI1P.png
      descr: 中国最大社交分享平台
    - name: Twitter
      link: https://twitter.com/
      avatar: https://i.loli.net/2020/05/14/5VyHPQqR6LWF39a.png
      descr: 社交分享平台
```

## 不要忘记安装依赖

对于较新的butterfly版本，需要安装依赖才能编译出HTML文件：

```pwsh
# 进入博客根目录
cd your-blog-folder

# 安装缺失的依赖
npm install

# 如果使用特定主题，确保主题依赖也安装了
cd themes/your-theme-name
npm install
```

同时可能要安装Pug渲染器：

```pwsh
# 进入博客根目录
cd your-blog-folder

# 安装 Pug 和 Stylus 渲染器
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

## 用HTML优化博客文章显示

标准的、纯粹的 Markdown 语法本身**不支持**设置文字的折叠和展开状态。Markdown 的设计初衷是生成静态的、语义化的文档结构，而不是交互式元素。

但是，有几种方法可以用HTML优化博客文章显示，让一段文字可以被折叠和展开。它们都依赖于将 Markdown 与 HTML 和/或 JavaScript 结合使用。

### 方法一：使用 HTML 的 `<details>` 和 `<summary>` 标签（最推荐）

这是最简单、最现代且无需 JavaScript 的解决方案。绝大多数现代浏览器都支持这个标签。

**语法：**

```html
<details>
  <summary>点击这里展开查看详情</summary>

  这里是折叠起来的内容。
  你可以在这里写 **Markdown** 或者 HTML。
  因为它在 HTML 标签内，所以需要看你的 Markdown 处理器是否支持。
  通常，像 GitHub Pages, Docsify, VitePress 等工具都支持。

  - 列表项 1
  - 列表项 2

  `甚至可以写代码块`
</details>
```

**效果：**
默认情况下，内容会是折叠状态。

<details>
  <summary>点击这里展开查看详情</summary>
  这里是折叠起来的内容。
  你可以在这里写 <strong>Markdown</strong> 或者 HTML。
  因为它在 HTML 标签内，所以需要看你的 Markdown 处理器是否支持。
  通常，像 GitHub Pages, Docsify, VitePress 等工具都支持。
  <ul>
    <li>列表项 1</li>
    <li>列表项 2</li>
  </ul>
  <code>甚至可以写代码块</code>
</details>

**设置默认展开状态**

如果你希望它默认是**展开**的，可以使用 `open` 属性。

```html
<details open>
  <summary>这个部分默认是展开的</summary>
  这些内容一开始就是可见的。
</details>
```

**效果：**

<details open>
  <summary>这个部分默认是展开的</summary>
  这些内容一开始就是可见的。
</details>

## 开启博客字数统计功能

首先在博客根目录运行`npm install hexo-wordcount --save`安装字数统计插件。

然后在butterfly主题的_config.butterfly.yml中找到以下配置并修改：

```yml
# Need to install the hexo-wordcount plugin
wordcount:
  enable: true
  # Display the word count of the article in post meta
  post_wordcount: true
  # Display the time to read the article in post meta
  min2read: true
  # Display the total word count of the website in aside's webinfo
  total_wordcount: true
```

## 为博客添加RSS订阅链接

在博客根目录下，输入`$ npm install hexo-generator-feed --save`

修改博客根目录下的_config.yml下feed中的内容，详情见官方[README](https://github.com/hexojs/hexo-generator-feed#options)文件。

在主题_config.yml添加以下代码：`rss: /atom.xml`

## 为博客添加网站地图

网站地图就是网站的“内容清单”，把它提交给搜索引擎，可以帮助搜索引擎更好地理解网站结构，从而提高网站在搜索结果中的可见性。

### 使用 Hexo 官方插件 `hexo-generator-sitemap`

#### 步骤 1：安装插件

在你的 Hexo 博客根目录下，打开终端或命令行，运行以下命令：

```bash
npm install hexo-generator-sitemap --save
```

#### 步骤 2：配置 `_config.yml`

打开你的 Hexo 主配置文件 `_config.yml`，在任意位置添加以下配置：

```yaml
# 网站地图 Sitemap
sitemap:
  path: sitemap.xml
  rel: false
  tags: true
  categories: true
```

- `path：` sitemap.xml 文件的输出路径，默认为 `sitemap.xml`，通常不需要修改。
- `rel：` 是否为文章生成关联链接（如上一篇、下一篇），通常不需要，设为 `false`。
- `tags：` 是否将标签页列入站点地图。如果你的标签页内容有价值，建议设为 `true`。
- `categories：` 是否将分类页列入站点地图。同样，如果分类页内容有价值，建议设为 `true`。

#### 步骤 3：生成和部署

完成以上两步后，每次你执行 `hexo generate` 或 `hexo deploy` 时，插件都会自动在 `public` 目录下生成一个 `sitemap.xml` 文件。

- **本地预览：** 执行 `hexo clean && hexo g && hexo s`，然后在浏览器中访问 `http://localhost:4000/sitemap.xml` 就能看到生成的网站地图。
- **部署：** 像平常一样部署你的博客（例如 `hexo d`），`sitemap.xml` 文件会被一并上传到的服务器。

### 向搜索引擎提交你的网站地图

生成了网站地图后，你需要主动告诉搜索引擎它的存在。

#### 向 Google 提交

1.  打开 [Google Search Console](https://search.google.com/search-console/)。
2.  选择你的网站资源。
3.  在左侧菜单中，点击 **“网站地图”**。
4.  在 “新网站地图” 框中，输入 `sitemap.xml`（如果你使用方法一）。
5.  点击 **“提交”**。

#### 向 Bing 提交

1.  打开 [Bing Webmaster Tools](https://www.bing.com/webmasters)。
2.  流程与 Google 类似，找到网站地图提交区域，提交 `sitemap.xml`。

### 额外提示：在网页中声明网站地图

虽然不是必须，但可以通过在 `source` 目录下创建一个 `robots.txt` 文件来声明网站地图。

1.  在 Hexo 博客的 `source` 目录下，创建 `robots.txt` 文件。
2.  在文件中添加以下内容：

```
User-agent: *
Allow: /

Sitemap: https://你的域名/sitemap.xml
Sitemap: https://你的域名/baidusitemap.xml
```

这样，搜索引擎爬虫在访问你的 `robots.txt` 时就会知道网站地图的位置。

参考资料：

1.[https://zhuanlan.zhihu.com/p/26625249](https://zhuanlan.zhihu.com/p/26625249)
2.[https://hexo.io/zh-cn/](https://hexo.io/zh-cn/)
3.[https://butterfly.js.org/](https://butterfly.js.org/)