---
title: 将Powershell 7作为你的默认shell
date: 2025-11-06 16:32:00
cover: https://cdn.jsdelivr.net/gh/cyhkbl/picture_bed@main/pwsh.png
---

# 将Powershell 7作为你的默认shell

Windows系统自带的Powershell版本为5.1，而Microsoft早已发布了最新的Powershell 7。

<details>
  <summary>PowerShell 7 相比 PowerShell 5 有很多重要的改进和优势。</summary>

**跨平台支持**
- 支持 Windows、Linux 和 macOS
- 统一的脚本体验

**性能大幅提升**

**兼容性改进**
- 兼容 PowerShell Core 6.x
- 更好地与现有 PowerShell 5.1 脚本兼容
- 内置 Windows PowerShell 兼容模块

**新的语言特性**
```powershell
# 三元运算符
$result = $condition ? "True" : "False"

# 管道链运算符
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5

# 空值条件运算符
$value = $object?.Property?.AnotherProperty

# 简化的 for 循环
foreach ($item in $collection) { }
```

**新的 cmdlet 和功能**
```powershell
# 并行处理
ForEach-Object -Parallel {
    # 并行执行脚本块
} -ThrottleLimit 5

# 新的 Get-Error cmdlet，显示详细错误信息
Get-Error

# 改进的 Get-Date 支持
Get-Date -UFormat "%s"  # Unix 时间戳
```

**更好的对象处理**
```powershell
# 改进的 ConvertTo-Json/ConvertFrom-Json
$json = Get-Content data.json | ConvertFrom-Json

# 深度支持
ConvertTo-Json -Depth 10
```

**模块和包管理改进**
```powershell
# PowerShellGet 3.0 更好的性能
Find-Module -Name *Azure*
Install-Module -Name PSReadLine -AllowPrerelease
```

**安全增强**
- 更安全的代码执行策略
- 改进的 JEA (Just Enough Administration)
- 更好的远程处理安全

**开发体验提升**
```powershell
# 改进的调试体验
Set-PSBreakpoint -Script test.ps1 -Line 10

# 更好的智能提示和补全
# 集成现代开发工具
```

**长期支持**
- PowerShell 7 是微软的长期支持版本
- 定期安全更新和功能改进
- 活跃的社区支持
</details>

因此，我们可以将Windows系统的默认shell更换为Powershell 7，下面是具体步骤：

## 用Scoop安装Powershell 7

如果你还没有安装Scoop，可以参考[这篇文章](https://cyhkbl.github.io/2023/11/04/scoop-windows%E7%9A%84%E5%BA%94%E7%94%A8%E5%95%86%E5%BA%97/)进行安装。

然后，使用`scoop install main/pwsh`命令安装Powershell 7。

## 在Windows Terminal中将Powershell 7设置为默认shell

1.  **打开 Windows Terminal**，然后按 `Ctrl + ,` 打开设置。

2.  在设置界面，点击左侧的 **“打开JSON文件”** 按钮。

3.  在`list`中填写以下信息：

```json
{
"commandline": "D:\\software\\Scoop\\apps\\pwsh\\current\\pwsh.exe",
"hidden": false,
"icon": "D:\\software\\Scoop\\apps\\pwsh\\current\\pwsh.exe",
"name": "Powershell 7",
"startingDirectory": "D:\\"
},
```
Windows 能够自动从 .exe 文件中提取图标，所以图标只需要填写.exe 文件路径即可。

## 在VSCode中将Powershell 7设置为默认shell

VSCode 的终端默认使用系统默认的 Shell，但我们可以直接在 VSCode 的设置中覆盖它。

1.  打开 **VSCode**。
2.  使用快捷键 `Ctrl + Shift + P` 打开命令面板。
3.  输入并选择 **“首选项：打开用户设置(JSON)”**。
4.  在打开的 `settings.json` 文件中，添加或修改以下行：

```json
{
    "terminal.integrated.profiles.windows": {
        "PowerShell 7": {
            "path": "D:\\software\\Scoop\\apps\\pwsh\\current\\pwsh.exe",
            "icon": "terminal-powershell"
        }
    },
    "terminal.integrated.defaultProfile.windows": "PowerShell 7"
}
```

5.  保存 `settings.json` 文件。
6.  现在，在 VSCode 中按 `` Ctrl + ` `` 打开集成终端，它应该就是 PowerShell 7 了。

## 验证

输入`$PSVersionTable`，如果显示的版本是7.x.x，则表示你已经成功将Powershell 7设置为默认shell。