---
title: mpv的使用
date: 2024-04-21 11:09:02
cover: /images/mpv-logo.webp
---

# mpv的使用

mpv这个播放器我已经使用好几年了，非常简洁，比较适合我“洁癖”的性格。由于需要借助快捷键和配置使用，这里简单介绍一下mpv的使用。更详细的介绍可以在mpv的[官方文档](https://mpv.io/manual/stable/)或[Wiki](https://github.com/mpv-player/mpv/wiki)上查看。

## 配置

在 mpv.exe 的旁边新建一个 portable_config 的文件夹。该目录具有最高级的优先级，一旦存在此文件夹，其它所有的设置目录都会被忽略。在 /portable_config/ 内新建一个 mpv.conf 的空文本，确保文本编码为 UTF-8。

在 mpv.conf 中写入以下基本参数：

```conf
hwdec=auto                              # 优先使用硬解（原生模式）
#log-file="~~desktop/mpv.log"            # 输出log日志在桌面
keep-open=yes                           # 播放列表中的最后一个条目播放完毕后暂停
save-position-on-quit=yes               # 退出时保存当前的播放状态
watch-later-options=start,vid,aid,sid   # 指定保存播放状态的属性列表（示例表示：播放位置、视频 音频 字幕轨号）
audio-file-auto=fuzzy                   # 自动加载近似名的外置音轨
sub-auto=fuzzy                          # 自动加载近似名的外置字幕
#profile=high-quality                    # 使用一个内置的画质方案预设
screenshot-dir="~~desktop/"             # 截图的输出路径在桌面
```

## 快捷键

`RIGHT`前进5秒

`LEFT`后退5秒

`UP`前进60秒

`DOWN`后退60秒

`[` `]`倍速播放

`{`0.5倍速播放

`}`2.0 倍速播放

`Backspace`还原到 1.0 倍速

`Space`播放/暂停

`.`下一帧

`,`上一帧

`1` `2`调整对比度

`3` `4`调整亮度

`5` `6`调整伽玛

`7` `8`调整饱和度

`9` `0`调整音量

`s` 按源分辨率截屏

`i` 显示有关当前播放文件的统计信息

### 参考资料

[https://hooke007.github.io/unofficial/mpv_start.html#id1](https://hooke007.github.io/unofficial/mpv_start.html#id1)