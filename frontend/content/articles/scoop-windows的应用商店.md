---
title: scoop-windows的应用商店
date: 2023-11-04 14:19:23
cover: /images/scoop.jpg
---

# scoop-windows的应用商店

虽然Windows最近也推出了自己的软件商店——Microsoft Store，我却本着不把文件放C盘、支持开源等多个理由，在windows上使用最为著名的scoop来对自己的软件进行管理。

首先，需要设置PowerShell执行策略，通过输入以下命令`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`即可。

为了把scoop安装到D盘，需要使用环境变量。输入下列命令：

```pwsh
$env:SCOOP='D:\software\Scoop'
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')
```

接下来，通过以下命令，可以安装scoop：

`Invoke-Expression (New-Object System.Net.WebClient).DownloadString(&#39;https://get.scoop.sh&#39;)`

这样，scoop就安装完成了。

## scoop配置

有时，我们需要通过代理下载一些软件，输入以下命令改变下载时使用的代理（端口号与自己使用的一致）：

`scoop config proxy 127.0.0.1:7890`

或找到Scoop配置文件，路径`C:\Users\username\.config\scoop\config.json`，然后直接修改里面的配置。

下面的命令可以改变scoop全局安装位置：

```pwsh
$env:SCOOP_GLOBAL='D:<dirname>'
[Environment]::SetEnvironmentVariable('SCOOP_GLOBAL', $env:SCOOP_GLOBAL, 'Machine')
```
## scoop命令

Scoop的操作命令基本结构是scoop + 动词 + 对象，比如安装typora，通过输入scoop install typora即可自动完成软件的官网进入+下载+安装等操作。

以下是一些常用的命令说明：

`scoop cleanup *`——删除全部旧版本应用。

`scoop cache rm *`——删除全部缓存。

`scoop search`——搜索仓库中是否有相应软件。

`scoop install`——安装软件。

`scoop uninstall`——卸载软件。

`scoop update`——更新软件。可通过`scoop update *`更新所有已安装软件，或通过`scoop update`更新所有软件仓库资料及Scoop自身而不更新软件。

`scoop hold`——锁定软件阻止其更新。

`scoop info`——查询软件简要信息。

如果忘记了，可通过输入`scoop help`来查询语法，以及更多不怎么常用的操作指导。

## 推荐软件仓库

Scoop添加软件仓库的命令是`scoop bucket add bucketname`(+ url可选)。如添加extras的命令是`scoop bucket add extras`，执行此命令后会在scoop文件夹中的buckets子文件夹中添加extras文件夹。

Scoop官方有一些仓库可供使用：

> main - Default bucket for the most common (mostly CLI) apps
>
> extras - Apps that don’t fit the main bucket’s criteria
>
> games - Open source/freeware games and game-related tools
>
> nerd-fonts - Nerd Fonts
>
> nirsoft - Almost all of the 250+ apps from Nirsoft
>
> java - A collection of Java development kits (JDKs), Java runtime engines (JREs), Java’s virtual machine debugging tools and Java based runtime engines.
>
> nonportable - Non-portable apps (may require UAC)
>
> php - Installers for most versions of PHP
>
> versions - Alternative versions of apps found in other buckets

除了官方的软件仓库，Scoop也支持用户自建仓库并共享，其中dorado仓库里面有许多适合中国用户的软件。添加dorado仓库的命令如下：`scoop bucket add dorado https://github.com/chawyehsu/dorado`。

此外，若多个仓库间的软件名称冲突，可以通过在软件名前添加仓库名的方式避免冲突，如scoop install dorado/appname。

## 使用aria2加快下载速度

```pwsh
scoop install aria2 #安装aria2
scoop config aria2-max-connection-per-server 16 #设置16线程下载
scoop config aria2-split 16 #设置16线程下载分块
scoop config aria2-min-split-size 1M #设置每个分块的最小体积
scoop config aria2-enabled true #启用aira2下载，默认安装好后就是启用的
```

## 创建自己的bucket

bucket 实质上是一个 GitHub 仓库，因此，在自己的 GitHub 帐号下新建一个仓库，就得到了一个 bucket。并且通过以下命令就可以添加到 Scoop 中：

```pwsh
# 添加 bucket（指定名称和 GitHub 仓库地址）
scoop bucket add my-bucket https://github.com/<your-username>/my-bucket
# 查看已添加的 bucket 列表（新添加的 bucket 应该也在其中）
scoop bucket list
```

### 应用清单

bucket 以应用清单的形式提供应用，因此，我们还需要添加应用清单。

可以使用 Scoop 命令创建该文件：

```pwsh
scoop create <url> #url填安装包下载地址
```

在仓库中就出现了以应用为名字的json文件，形式如下：

```json
{
    "version": "1.6.4",
    "description": "GIF encoder based on libimagequant (pngquant).",
    "homepage": "https://gif.ski",
    "license": "AGPL-3.0-or-later",
    "url": "https://gif.ski/gifski-1.6.4.zip",
    "hash": "dc97c92c9685742c4cf3de59ae12bcfcfa6ee08d97dfea26ea88728a388440cb",
    "pre_install": "if (!(Test-Path '$dir\\config')) { New-Item '$dir\\config' }",
    "bin": "gifski.exe",
    "checkver": "For Windows.*?gifski-([\\d.]+)\\.zip",
    "autoupdate": {
        "url": "https://gif.ski/gifski-$version.zip"
    }
}
```

### 自动更新

当应用版本升级时，可以手动维护应用清单，以升级相关信息，主要包括：版本号（version）、下载地址（url）、哈希码（hash）等。

但是，手动维护工作量很大，所以，scoop 提供了自动更新应用清单的功能，只是需要进行相关属性配置即可启用。

需要配置 checkver 和 autoupdate 两个属性，前者用以获取最新版本，后者用以获取更新的下载地址和哈希码等。

#### checkver

对于 GitHub Releases 链接，可以使用 GitHub API：

```json
"checkver": "github"
```

scoop 会自动从 GitHub API 获取最新版本。

#### autoupdate

autoupdate 属性是要自动更新应用清单文件中的一系列版本相关信息，这包括：url、hash、extract_dir等等。

如果应用不区分 32/64 位系统架构，那么，autoupdate.architecture 属性的层次就不是必须的，直接指定 autoupdate.url 属性就好。通常，url 都会使用版本变量或捕获变量，除非下载链接是固定的。

如果 HASH 码的获取无关系统架构，那么，通常独立配置 autoupdate.hash 属性；但是，如果有关，那么通常分别配置 autoupdate.architecture.32bit.hash 和 autoupdate.architecture.64bit.hash。