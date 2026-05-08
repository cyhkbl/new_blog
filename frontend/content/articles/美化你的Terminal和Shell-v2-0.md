---
title: 美化你的Terminal和Shell v2.0
date: 2026-02-01 22:35:25
cover: /images/beautify.png
---

# 美化你的Terminal和Shell v2.0

3年前，我写过一篇文章，介绍了如何美化Windows Terminal和Shell（[链接](https://cyhkbl.github.io/2023/11/04/%E7%BE%8E%E5%8C%96%E4%BD%A0%E7%9A%84Terminal%E5%92%8CShell/)）。现在，我想系统性更新一下我在整个可视界面的美化方案。

## 终端模拟器(Terminal Emulator)

我选择了WezTerm作为我的终端模拟器。WezTerm是一个跨平台的终端模拟器，支持Windows、macOS和Linux。它具有高度可定制性和丰富的功能，非常适合喜欢个性化设置的用户。

使用Scoop安装WezTerm：

```powershell
scoop install wezterm
```

WezTerm的配置文件是一个Lua脚本，位于`%USERPROFILE%\.wezterm.lua`。可以提出要求让AI帮你生成一个基础配置文件，然后根据个人喜好进行修改。例如我目前的配置：

```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- --------------------------------------------------------------------
-- Shell 选择
-- --------------------------------------------------------------------

-- 1. 环境判断
local is_windows = wezterm.target_triple:find("windows") ~= nil

-- 2. 设置默认启动 Shell (打开 WezTerm 直接进入 Nushell)
-- Windows 下通常是 "nu.exe"，Linux 下是 "nu"
if is_windows then
    config.default_prog = { "nu", "-l" }
else
    config.default_prog = { "nu", "-l" }
end

-- 3. 定义启动菜单 (仅在你按下快捷键时显示)
local launch_menu = {}

if is_windows then
    table.insert(launch_menu, { label = "Nushell", args = {"nu", "-l"} })
    table.insert(launch_menu, { label = "Pwsh", args = {"pwsh.exe", "-NoLogo"} })
    table.insert(launch_menu, { label = "CMD", args = {"cmd.exe"} })
    table.insert(launch_menu, { label = "WSL: Fedora", args = {"wsl.exe", "-d", "fedora"} })
else
    table.insert(launch_menu, { label = "Nushell", args = {"nu", "-l"} })
    table.insert(launch_menu, { label = "Zsh", args = {"zsh", "-l"} })
    table.insert(launch_menu, { label = "Bash", args = {"bash", "-l"} })
    table.insert(launch_menu, { label = "Fish", args = {"fish", "-l"} })
end

-- 通用 SSH 项
table.insert(launch_menu, { label = "SSH: Server", args = {"ssh", "user@ip"} })

config.launch_menu = launch_menu

-- --------------------------------------------------------------------
-- 外观
-- --------------------------------------------------------------------

-- 日夜切换
-- 监听配置重载或系统主题切换
wezterm.on('window-config-reloaded', function(window, pane)
  local overrides = window:get_config_overrides() or {}
  local appearance = window:get_appearance()
  local is_dark = appearance:find("Dark")
  
  if is_dark then
    overrides.colors = { background = '#000000' }
    overrides.color_scheme = 'Catppuccin Mocha'
  else
    overrides.colors = { background = '#f8f8f8' }
    overrides.color_scheme = 'Catppuccin Latte'
  end
  window:set_config_overrides(overrides)
end)

-- 透明度
config.window_background_opacity = 0.5

-- 初始状态：无标签栏，无按钮，无滚动条，仅保留调整大小边缘
config.enable_tab_bar = false
config.window_decorations = "RESIZE" 
config.window_padding = { left = 15, right = 15, top = 15, bottom = 10 }
config.enable_scroll_bar = false
-- 光标样式：呼吸感
config.default_cursor_style = 'BlinkingBar'
-- 光标闪烁频率
config.cursor_blink_rate = 1000
-- 光标进入时的平滑曲线
config.cursor_blink_ease_in = 'EaseIn'
-- 光标消失时的平滑曲线
config.cursor_blink_ease_out = 'EaseOut'
-- 光标动画帧率
config.animation_fps = 165
-- 光标粗细
config.cursor_thickness = '2pt'
-- 画面高帧率
config.max_fps = 165
-- 滚动缓冲区行数20000
config.scrollback_lines = 20000

-- --------------------------------------------------------------------
-- 字体
-- --------------------------------------------------------------------

config.font = wezterm.font_with_fallback({
  { family = 'JetBrainsMono Nerd Font', weight = 'Medium', harfbuzz_features = { 'calt', 'liga', 'clig' } },
  { family = 'FiraCode Nerd Font', weight = 'Medium' },
  { family = 'Microsoft YaHei', weight = 'Regular' },
  { family = 'Noto Sans SC', weight = 'Regular' },
})
config.font_size = 12.0

-- --------------------------------------------------------------------
-- 动态切换
-- --------------------------------------------------------------------
wezterm.on('toggle-all-controls', function(window, pane)
  local overrides = window:get_config_overrides() or {}
  if not overrides.enable_tab_bar then
    -- 激活模式：显示标签栏 + 显示集成按钮
    overrides.enable_tab_bar = true
    overrides.window_decorations = "INTEGRATED_BUTTONS|RESIZE"
  else
    -- 隐藏模式：回到纯净状态
    overrides.enable_tab_bar = false
    overrides.window_decorations = "RESIZE"
  end
  window:set_config_overrides(overrides)
end)

-- 自动识别超链接
config.hyperlink_rules = wezterm.default_hyperlink_rules()

-- --------------------------------------------------------------------
-- 强制居中
-- --------------------------------------------------------------------
-- 1. 首先，在 config 声明下方设置初始尺寸（字符数）
config.initial_cols = 80
config.initial_rows = 20

-- 2. 使用 gui-startup 事件实现居中
wezterm.on('gui-startup', function(cmd)
  local screen = wezterm.gui.screens().main
  -- 这里的 10 和 20 是基于 JetBrains Mono 12pt 的大致像素估算
  -- 宽度 = 120列 * 10像素 = 1200px
  -- 高度 = 30行 * 20像素 = 600px
  local width = 1200
  local height = 600
  
  local _, _, window = wezterm.mux.spawn_window(cmd or {})
  local gui_window = window:gui_window()
  
  -- 计算居中坐标
  local x = (screen.width - width) / 2
  local y = (screen.height - height) / 2
  
  -- 强制设置位置
  gui_window:set_position(x, y)
end)

-- --------------------------------------------------------------------
-- 快捷键
-- --------------------------------------------------------------------
-- 禁用所有默认快捷键，重新定义
config.disable_default_key_bindings = true
config.keys = {
  -- 复制粘贴快捷键
  {
    key = 'C',
    mods = 'CTRL',
    action = wezterm.action_callback(function(window, pane)
      local selection = window:get_selection_text_for_pane(pane)
      if selection == "" then
        window:perform_action(wezterm.action.SendKey{key='c', mods='CTRL'}, pane)
      else
        window:perform_action(wezterm.action.CopyTo 'Clipboard', pane)
      end
    end),
  },
  { key = 'V', mods = 'CTRL|SHIFT', action = wezterm.action.PasteFrom 'Clipboard' },
  -- 打开命令面板
  { key = 'P', mods = 'CTRL|SHIFT', action = wezterm.action.ActivateCommandPalette },
  -- 绑定一键切换：标签栏、拖动、按钮同时出现/消失
  { key = 'B', mods = 'CTRL|SHIFT', action = wezterm.action.EmitEvent 'toggle-all-controls' },
  -- 分屏快捷键
  { key = 's', mods = 'ALT', action = wezterm.action.SplitVertical { domain = 'CurrentPaneDomain' } },
  { key = 'v', mods = 'ALT', action = wezterm.action.SplitHorizontal { domain = 'CurrentPaneDomain' } },
  -- 搜索快捷键
  { key = 'F', mods = 'CTRL|SHIFT', action = wezterm.action.Search { CaseInSensitiveString = "" } },
  -- 按下 Alt + S (Switch) 呼出Shell选择菜单
  { key = 's', mods = 'ALT', action = wezterm.action.ShowLauncherArgs { flags = 'LAUNCH_MENU_ITEMS' } },
}

-- 自动重载配置文件
config.automatically_reload_config = true

return config
```

- 字体：JetBrainsMono Nerd Font
- 颜色方案：Catppuccin Latte/Mocha

## Shell

我选择了Nushell作为我的主要Shell。Nushell是一个现代化的Shell，具有强大的数据处理能力和友好的用户界面。

输入`code $nu.env-path`打开启动变量，将VSCode设置为Nushell的默认编辑器，删除右侧提示符：

```nushell
$env.EDITOR = "code"
$env.PROMPT_COMMAND_RIGHT = ""
```

使用`config nu`命令可以查看和修改Nushell的配置文件`config.nu`。将启动横幅关闭以保持界面简洁，启用颜色支持和关闭OSC133集成（WezTerm专有问题）以避免与终端冲突：

```nushell
$env.config = {
    show_banner: false
    ls: {
        use_ls_colors: true
    }
    shell_integration: {
        osc133: false //Nushell会频繁发送终端位置标记，WezTerm可能过度响应这些标记，导致终端不断重绘显示区域
    }
}
```

- 命令提示符：Starship

Starship是一个跨Shell的命令提示符，可以与Nushell无缝集成。安装Starship后，编辑Nushell的配置文件`config.nu`，添加以下内容以启用Starship：

```nushell
mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor/autoload/starship.nu")
```

对于PowerShell用户，可以运行`code $PROFILE`打开PowerShell配置文件，添加以下内容以启用Starship：

```powershell
Invoke-Expression (&starship init powershell)
```

- Starship预设：[Catppuccin Powerline](https://starship.rs/presets/catppuccin-powerline)