---
title: Android手机连接WiFi不调用系统浏览器的方法
date: 2025-11-02 14:47:00
cover: https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed@main/v2-487cb6cf22441f3552bdf7608ef370f7_1440w.png
---

# Android手机连接WiFi不调用系统浏览器的方法

当你的安卓设备连接到一个需要网页认证的WiFi（比如机场、酒店或校园网）时，系统会自动检测网络状态。如果发现网络被“拦截”并跳转到一个登录页面，系统就会通过一种名为 `android.net.conn.CAPTIVE_PORTAL` 的意图（Intent）来通知设备。

任何应用都可以在清单文件中注册一个 Activity 来捕获这个 Intent。这意味着，当系统检测到 Captive Portal 时，会弹出一个应用选择器，让你决定用哪个应用来处理这个认证页面。如果你选择了另一个浏览器并点击“始终”，那么以后遇到同类认证，系统就会直接调用这个浏览器来完成自动认证。

这种方法的优势在于，它绕过了系统浏览器限制，允许应用直接与认证门户交互，为实现自动登录（例如自动填写账号密码）提供了可能。

下面以我使用的 Iceraven 浏览器为例，介绍如何实现这一功能：

## 插入位置

将 `<activity>` 标签放在 `<application>` 标签内部，通常与其他 `<activity>` 标签并列。不能放在 `<application>` 外面。

## 关键修改

添加 `android:exported="true"`。在 Android 12（API 级别 31）及更高版本中，所有包含 Intent-Filter 的 Activity 必须显式声明 `android:exported` 属性（设置为 true 或 false）。因为你的这个 Activity 需要被系统（其他进程）调用，所以必须设置为 true。

也就是，打开 `AndroidManifest.xml` 后，在 `<activity>` 标签内添加以下代码片段：

```xml
<intent-filter>
    <action android:name="android.net.conn.CAPTIVE_PORTAL" />
    <category android:name="android.intent.category.DEFAULT" />
</intent-filter>
```

## 参考

[如何修改 AndroidManifest.xml 捕获 Captive Portal](https://www.zhihu.com/question/1967393907940778921/answer/1968068839964116840)

---

以上内容由 **Deepseek V3.2** 和 **GitHub Copilot** 协助生成。