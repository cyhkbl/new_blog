---
title: Cloudflare故障和给我们带来的启示
date: 2025-11-19 12:59:00
cover: https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed@main/CF_logo.png
---

# Cloudflare故障和给我们带来的启示

就在昨天（2025年11月18日），全球知名的CDN和网络安全服务提供商Cloudflare经历了一次大规模的服务中断，影响了大量网站的正常访问。我是在打开butterfly主题的某张图片时发现无法加载才注意到这个问题的，后来发现linux.do也无法访问了。当然，此次事故影响较大的是X和ChatGPT等网站。

Cloudflare 官方的复盘报告可以查看[这里](https://blog.cloudflare.com/zh-cn/18-november-2025-outage/)。概括起来有以下几点：

1. **数据库权限变更**：为提升ClickHouse集群安全性，将隐式权限改为显式权限。
2. **查询返回数据翻倍**：变更后，生成Bot Management（机器人管理）特征文件的SQL查询不再只返回default数据库的列，而是把底层r0数据库的列也重复返回，导致特征文件行数/大小暴增一倍以上。
3. **特征文件超限崩溃**：全球Edge服务器加载这个超大特征文件时，Bot Management模块触发硬编码的特征数量上限（200个），代码直接panic，导致核心代理进程崩溃，返回大量500/5xx错误。
4. **影响扩散**：Bot Management是核心代理的必经模块，几乎所有流量都受影响；Workers KV、Access、Turnstile、Dashboard登录等依赖核心代理的服务也连带故障。

一次本意提升数据库安全性的权限变更，意外让Bot Management特征文件大小翻倍，超出Edge代码硬编码上限，导致全球核心代理崩溃，是典型的配置变更引发的连锁故障，而非攻击。  

这次事件是 Cloudflare 自 2019 年以来最严重的一次服务中断。我们可以感受到，互联网基础设施的瘫痪给我们的日常生活的巨大灾难。问题就在于，Agent的大量使用是不是隐形地增加了这些错误出现的概率？Agent对未来的影响，还难以确定。