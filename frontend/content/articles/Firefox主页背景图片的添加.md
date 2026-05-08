---
title: Firefox主页背景图片的添加
date: 2022-08-04 16:18:28
cover: /images/firefox.png
---

# Firefox主页背景图片的添加

> 2025年7月31日注：Firefox在新版本已经支持通过图形化界面更改主页壁纸

## 添加流程

1. 访问`about:profiles`

2. 打开默认配置文件的**根目录**

3. 新建一个文件夹，重命名为`chrome`

4. 将图片放入文件夹中，重命名为`img.jpg`

5. 新建文本文件，重命名为`userContent.css`

6. 修改这个css文件

```css
@-moz-document url(about:home), url(about:newtab), url(about:privatebrowsing) {
    .top-site-button .title, .context-menu-button {
        color: #fff !important ;
        text-shadow: 2px 2px 2px #222 !important ;
    }

    .logo-and-wordmark {
        display: none !important;
    }

    body {
        --newtab-topsites-outer-card-hover:rgba(255, 255, 255, 0.4) !important;
        --newtab-element-hover-color: rgba(255, 255, 255, 0.3) !important;
    }

    body::before {
        content: "" ;
        z-index: -1 ;
        position: fixed ;
        top: 0 ;
        left: 0 ;
        background:no-repeat url(img.jpg) center ;
        background-size: cover ;
        width: 100vw ;
        height: 100vh ;
    }
}
```
7. 访问`about:config`，搜索`toolkit.legacyUserProfileCustomizations.stylesheets`并将其改为 `true`

8. 重启Firefox

### css的解释

```css
.top-site-button .title, .context-menu-button {
    color: #fff !important ;
    text-shadow: 2px 2px 2px #222 !important ;
}
```

这一段用来将字体颜色改为白色

```css
.logo-and-wordmark {
    display: none !important;
}
```

这一段用来移除logo

```css
body {
    --newtab-topsites-outer-card-hover:rgba(255, 255, 255, 0.4) !important;
    --newtab-element-hover-color: rgba(255, 255, 255, 0.3) !important;
}
```

这一段修改了当鼠标移动到网页图标上时显示的方框的颜色

```css
body::before {
    content: "" ;
    z-index: -1 ;
    position: fixed ;
    top: 0 ;
    left: 0 ;
    background:radial-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.75)), no-repeat url(img.jpg) center ;
    background-size: cover ;
    width: 100vw ;
    height: 100vh ;
}
```

这一段是修改背景图

`radial-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.75))`在图片上叠加了一个中心渐变，使其变黑。可以删除，上面的代码中已删除。