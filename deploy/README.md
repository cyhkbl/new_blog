# 部署配置备份

这里是服务器上实际生效的配置文件，放进来只为了有备份，改动后记得两边一起更新。

| 文件 | 服务器位置 |
|---|---|
| `nginx-cyhkbl.qzz.io.conf` | `/etc/nginx/sites-available/cyhkbl.qzz.io`（软链到 `sites-enabled/`） |
| `blog.service` | `/etc/systemd/system/blog.service` |
| `cloudflared-config.yml` | `~/.cloudflared/config.yml` |

生效方式：

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl daemon-reload && sudo systemctl restart blog
sudo systemctl restart cloudflared
```

注意 `cloudflared` 用的是 Cloudflare 后台的**远程配置**，这个本地文件里的 ingress 实际不生效，
改域名要改 Zero Trust 后台或调 `PUT /accounts/<account>/cfd_tunnel/<id>/configurations`。
