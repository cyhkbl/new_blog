---
title: Picgo教程
date: 2025-07-25 18:31:00
cover: https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed@main/picgo.png
---

# Picgo教程

> 2025年11月11日更新：我目前已不再使用Picgo管理图片。实际上，用jsDelivr加速的Github图片链接为<https://cdn.jsdelivr.net/gh/your_user_name/your_repo_name@main/your_file_name>，例如我的一张图片链接为<https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed@main/picgo.png>

本文仅介绍使用Picgo作为本地配置软件，使用Github作为“白嫖”图床（严防个人信息泄露！），并使用[jsDelivr](https://zhida.zhihu.com/search?content_id=229958711&content_type=Article&match_order=1&q=jsDelivr&zhida_source=entity)对Github上图片进行CDN加速。

## 配置Github

在Github创建repo，访问 [https://github.com/settings/tokens](https://github.com/settings/tokens) 创建token，勾选所有选项框给予picgo权限。（时限可以给无限期）

![](https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed@main/v2-e34d517e923c3dead0ea82c0c933b688_1440w.jpg)

## 配置Picgo

下载Picgo后，点击“图床设置”。具体配置见下表：

| 配置项       | 值                                   |
|--------------|-------------------------------------|
| 仓库名       | username/reponame                   |
| 分支名       | main                                |
| Token        | 刚刚生成的Token                     |
| 自定义域名   | [https://cdn.jsdelivr.net/gh/username/reponame](https://cdn.jsdelivr.net/gh/username/reponame) |

![](https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed@main/v2-783cab87ea32f34c3ec56b44f97554c6_1440w.jpg)

最后，开始上传吧！