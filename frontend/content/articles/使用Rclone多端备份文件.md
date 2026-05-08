---
title: 使用Rclone多端备份文件
date: 2026-02-07 13:59:20
cover: /images/rclone.png
---

# 使用Rclone多端备份文件

上大学用电脑的时候越来越多，文件的备份和同步成为一个重要的问题，我曾经遇到过本地blog文件夹误删除，Recuva恢复数据（其实也只恢复了一小部分）的痛苦经历。Rclone就是一个非常不错的选择，它支持多种云存储服务，也支持将文件备份到本地。

## 安装

使用Scoop包管理器可以安装：

```bash
scoop install main/rclone
```

## 配置

### Google Drive

输入：

```nushell
rclone config
```
输入 `n` (New remote)，起个名字，例如：`Google Drive`。

在 `Storage` 列表里找到 **Google Drive**，输入对应的数字。

**Client ID** 和 **Client Secret**建议留空直接回车（使用 Rclone 默认的），或者如果追求极速，可以去 Google Cloud Console 申请自己的 API。

**Scope**：选择 `1` (Full access)。

**Service Account File**：留空回车（服务账号是一个特殊的“机器人”账号，通过一个 JSON 格式的密钥文件来授权，而我们普通用户一般通过浏览器OAuth授权）。

**Advanced config**：选 `n`。

**Use web browser to authenticate**：选 `y`。此时会弹出浏览器，登录你的 Google 账号并授权，注意这里需要在shell中开启梯子，否则报错。

**Configure this as a Shared Drive**：如果你用的是普通个人盘，选 `n`。

最后输入 `y` 确认保存即可。

### TeraBox

由于 TeraBox 的限制，我们需要通过 WebDAV 协议来访问它。由于非常可惜（但同时也恭喜作者）Alist被出售给商业公司了，我们可以在电脑上下载Openlist。

```pwsh
scoop install main/openlist
```

使用 Openlist 挂载 TeraBox 是目前实现 `rclone sync` 最稳定、操作最友好的方式。Openlist 把 TeraBox 私有协议转化成通用的 **WebDAV** 协议。

输入命令启动并查看初始密码：

```cmd
openlist server

```

控制台会显示 `start server @ 0.0.0.0:5244`，同时会随机生成一个 **admin 密码**（记下它）。

打开浏览器，访问 `http://127.0.0.1:5244`。输入用户名 `admin` 和刚才生成的密码登录。

Alist 挂载 TeraBox 需要的是 **Cookie**。在电脑浏览器登录 [TeraBox 官网](https://www.terabox.com/)，按下 `F12` 打开开发者工具，点击 **Network (网络)** 标签，刷新一下网页，在左侧列表中随便找一个请求（比如名称叫 `main` 或 `list` 的），在右侧找到 **Headers (标头)** -> **Request Headers**。找到 **`cookie:`** 这一行，**完整复制**冒号后面的所有内容。

> **提示：** 必须是包含所有字段的长字符串（通常包含 `ndus=...` 等关键项）。

回到 Alist 后台，点击 **管理** -> **存储** -> **添加**。**驱动** 选择 **TeraBox**。**挂载路径：** 输入 `/Terabox` (这决定了你在 Alist 里看到的文件夹名)。**Web 代理：、** 建议勾选。**Cookie：** 粘贴你刚才复制的完整字符串。**根目录 ID：** 如果想挂载根目录，填 `/` 即可。点击 **保存**。如果状态显示 **Work (正常)**，说明挂载成功。如果显示`terabox is not yet available in this area`，需要在Shell里设置Proxy（比如 `set http_proxy=http://127.00.1:7890`）然后再运行`alist server`。

现在 TeraBox 已经变成了一个本地的 WebDAV 服务，地址是 `http://127.0.0.1:5244/dav`。（这个Terabox是你在Alist里设置的名称）。在命令行输入 `rclone config`，新建一个 remote（比如命名为 `Alist Terabox`）。**Type** 选择 `webdav`。**URL:** `http://127.0.0.1:5244/dav/Terabox` (末尾的 `Terabox` 对应刚才在 Alist 设的挂载路径)。**Vendor:** 选择 `other`。**User** 输入 Alist 的登录账号 (`admin`)。**Password** 输入 Alist 的登录密码。

配置完成后，就可以开始备份了，例如：

```bash
rclone sync "D:/sync" "Alist Terabox:/sync" -P --transfers 1
```

### 阿里云盘

* 访问 [OpenList 文档获取 Token 页面](https://doc.oplist.org.cn/guide/drivers/aliyundrive_open)。按照提示扫描二维码或登录，获取`Refresh Token`。
* 登录 AList 管理界面，点击 **存储** -> **添加**。
* **驱动**：选择 **阿里云盘(OAuth2)**。
* **挂载路径**：填写 `/Aliyun`（这是在 AList 内部显示的文件夹名）。
* **刷新令牌**：填入刚才获取的 Refresh Token。
* **移除方式**：选择“回收站”或“直接删除”。
* 点击 **保存**。如果状态显示 `work`，说明挂载成功。

之后与 TeraBox 的操作类似。

* **Referer 限制补丁**：阿里云盘有时会检测 Referer 导致下载/上传失败。在使用 rclone 挂载或同步时，可以尝试添加以下参数：
`--header "Referer: https://www.aliyundrive.com/"`

### 移动云盘

移动云盘同样可以通过 Alist 挂载，方法与 阿里云盘 类似。只需要在 Alist 添加存储时选择 **移动云盘** 驱动，然后输入你的 Cookie 即可。Cookie可以在浏览器登录移动云盘官网后，通过开发者工具-存储-Cookies-authorization获取，就是Basic后面的那一串。

### S3（对象存储）

这里以我白嫖到的 [Hi168](https://hi168.com/) 为例，介绍如何使用 Rclone 连接 S3 对象存储服务。

* **访问令牌 (Access Key)：** 填写获取的 **密钥 ID**，对于这里是Access Key。
* **安全令牌 (Secret Key)：** 填写获取的 **密钥**，对于这里是Secret Key。
* **Endpoint（端点/挂载地址）：** `https://s3.hi168.com/`（告诉软件去哪里找这个服务器）
* **存储桶 (Bucket)：** 填写 **挂载名称**。

### 把Alist设置为开机自启

利用任务计划程序 (Task Scheduler)是最简单、不需要第三方工具的方法。

1. 按下 `Win + R`，输入 `taskschd.msc`。
2. 点击右侧“创建任务”。
3. **常规**：名称填 `Alist自启动`，勾选“不管用户是否登录都要运行”和“使用最高权限”。
4. 新建触发器。
5. 选择“按预定计划”，每天。
6. **操作**：新建 -> 启动程序。
7. **程序或脚本**：输入 `你的Alist安装路径`。
8. **添加参数**：`server`。

### 编写同步脚本

创建一个文件 `backup.nu`，例如:

```nu
# backup.nu
def main [] {
    let source = "D:/sync"
    let target = "Google Drive:/sync"
    
    # 将所有参数放在一个列表里，这样就不需要反引号连接行了
    let rclone_args = [
        "sync"
        $source
        $target
        "--progress"
        "--fast-list"
        "--drive-chunk-size" "64M"
        "--exclude" "$RECYCLE.BIN/**"
        "--exclude" "System Volume Information/**"
        "--ignore-errors"
        "--exclude" "**/.git/**"    # 排除 Git 仓库历史
        "--exclude" "**/.cache/**"  # 排除各种程序的缓存
        "--exclude" "**/node_modules/**" # 如果你有前端项目，这个必带
    ]

    print $"[(date now | format date '%Y-%m-%d %H:%M:%S')] 正在开始镜像同步..."
    
    # 使用 ... 符号将列表展开并传给 rclone
    rclone ...$rclone_args
        
    print "同步完成！"
}
```

### 自动定时同步

1. 按下 `Win + R`，输入 `taskschd.msc`。
2. 点击右侧“创建任务”。
3. **常规**：名称填 `Rclone同步`，勾选“不管用户是否登录都要运行”和“使用最高权限”。
4. 新建触发器。
5. 选择“按预定计划”，每天。
6. **操作**：新建 -> 启动程序。
7. **程序或脚本**：输入 `nu.exe` (如果已经用 scoop 安装了 nushell)。
8. **添加参数**：`C:\你的脚本路径\backup.nu`。