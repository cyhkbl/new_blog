---
title: OpenClaw!
date: 2026-02-25 20:12:18
---

# OpenClaw!

现在我平均每天都能看到超过5次的Openclaw的帖子，从Clawdbot到OpenClaw，再到NanoBot、PicoBot、ZeroClaw，这些类似于manus的AI Agent以日更的速度出现。应该说，体验还行，但是入门才是最难的。

## 环境

我选择的Azure Student Subscription的免费额度的虚拟机。本来这个还需要配置Node.js等等环境，现在可以使用一行命令自动安装和配置：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

## 配置

安装完成后`openclaw onboard`，进入引导式配置界面。

`~.openclaw/openclaw.json`是配置文件，里面有很多选项可以调整：

### 当前会话模型

```json
"agents": {
  "defaults": {
    "model": {
      "primary": "github-copilot/gpt-4o"
    }
  }
}
```

`primary`可以修改当前会话使用的模型，修改后，运行`openclaw gateway restart`来应用新的配置。

在Telegram机器人中，使用`/model`命令可以切换当前会话的模型。

### 自定义模型供应商

例如：

```json
"models": {
  "mode": "merge",
    "providers": {
      "<provider-name>": {
        "baseUrl": "<your-provider-url>",
        "apiKey": "<your-api-key>",
        "api": "openai-completions",
        "models": [
          {
            "id": "gpt-5.3-codex",
            "name": "GPT-5.3 Codex"
          }
        ]
      }
    }
}
```

实际上`.openclaw/agent/models.json`才是模型供应商的配置文件，但是一般`openclaw.json`中的配置会覆盖`models.json`中的配置，我们只需要修改`openclaw.json`就行。

### 模型供应auth

`.openclaw/agent/auth-profiles.json`和`.openclaw/agent/auth.json`文件中需要配置不同供应商的认证信息：

```json
{
  "profiles": {
    "thatapi:default": {
      "type": "api_key",
      "provider": "thatapi",
      "key": "<your-api-key>"
    }
  }
}
```

和

```json
{
  "361888": {
    "type": "api_key",
    "key": "<your-api-key>",
  }
}
```

### blockStreaming — AI 边想边发

AI 回复很长的时候（比如写一段代码或一篇分析），你要等它全部生成完才能看到。如果回复有 2000 字，可能要等 30 秒才能看到第一个字。开启 blockStreaming，AI 会把回复分成多个块，边生成边发送。你几秒内就能看到第一块内容。

```json
{
  "agents": {
    "defaults": {
      "blockStreamingDefault": "on",
      "blockStreamingBreak": "text_end",
      "blockStreamingChunk": { 
        "minChars": 200, 
        "maxChars": 1500 
      }
    }
  }
}
```

## 人格

`~.openclaw/workspace`目录下有三个文件：

```plaintext
SOUL.md — 它是谁，怎么说话
IDENTITY.md — 名字、形象、emoji
USER.md — 你是谁，它怎么称呼你
```

可以修改这些文件来定制AI Agent的人格特征和交互方式。

## 记忆

OpenClaw 默认有个 MEMORY.md，但大多数人要么不写，要么把什么都往里塞，最后变成一坨没人看的流水账。

我的做法是分层记忆：

```plaintext
MEMORY.md          ← 索引层：只放最核心的信息和指向其他文件的索引
memory/projects.md ← 项目层：每个项目的当前状态和待办
memory/infra.md    ← 基础设施层：服务器配置、API地址等速查信息
memory/lessons.md  ← 教训层：踩过的坑，按严重程度分级
memory/YYYY-MM-DD.md ← 日志层：每天发生了什么
```

memory/YYYY-MM-DD.md 需要AI主动写。每次 session 启动时会自动读今天+昨天，人不说，AI就不会写。两种方式产生记忆：

• 手动："记住 XXX"，AI写入 MEMORY.md
• 自动：compaction.memoryFlush — 当上下文快满时，OpenClaw 会静默提醒AI写记忆，防止重要信息丢失

heartbeat 不用管记忆。memoryFlush 会在合适的时机自动触发。

memorySearch 的配置只要在 `openclaw.json` 里加上：

```json
"memorySearch": {
  "enabled": true,
  "provider": "openai",
  "remote": {
    "baseUrl": "https://api.siliconflow.cn/v1/",
    "apiKey": "<your-api-key>"
  },
  "model": "BAAI/bge-m3"
},
"compaction": {
  "mode": "safeguard",
  "memoryFlush": {
    "enabled": true,
    "softThresholdTokens": 4000,
    "prompt": "Write durable notes to memory/YYYY-MM-DD.md and update MEMORY.md indexes when needed. Reply NO_REPLY if nothing to store.",
    "systemPrompt": "Session nearing compaction. Store durable memories now."
  }
}
```

## HEARTBEAT

OpenClaw 有个心跳机制：每隔一段时间（默认 30 分钟），系统会 ping 一下 AI，问它有没有什么要做的。

默认情况下，AI 收到心跳就回个 HEARTBEAT_OK，啥也不干。

但你可以写一个 HEARTBEAT.md，告诉它心跳时该检查什么。

这样你的 AI 就变成了一个 7x24 的值班员。你睡觉的时候它在巡检，你醒来就能看到报告。

心跳适合"顺便检查一下"的轻量任务，可以批量执行；cron 适合精确定时的独立任务（比如"每周一早上 9 点发周报"）。

配置HEARTBEAT时间：

```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "30m",
        "target": "last",
        "activeHours": { 
          "start": "08:00", 
          "end": "23:00" 
        }
      }
    }
  }
}
```

## AGENTS.md

AGENTS.md 放在 workspace 根目录（跟 SOUL.md 同级），OpenClaw 每次新 session 都会自动加载它。

AI 每次新 session 都是"失忆"状态——它不记得上次聊了什么。所以你需要告诉它：醒来之后，按什么顺序读文件来恢复记忆。

还可以在 AGENTS.md 里定义子Agent让主脑调用。

## Cron

Cron可以精确到分钟（cron 表达式），可以开独立 session，可以指定不同模型，适合精确定时、独立任务。

### 模式一：Main Session（systemEvent）

往主 session 注入一条系统消息。AI 在下次活跃时会看到这条消息并处理。

适合：提醒、通知类任务。

```json
{
  "name": "开会提醒",
  "schedule": { "kind": "at", "at": "2026-02-23T09:50:00+08:00" },
  "payload": { 
    "kind": "systemEvent", 
    "text": "提醒：10 分钟后有产品评审会议" 
  },
  "sessionTarget": "main"
}
```

### 模式二：Isolated Session（agentTurn）

开一个全新的独立 session，AI 在里面执行任务，完成后把结果发回给你。

适合：需要执行操作的任务（搜索、生成报告、检查服务）。

```json
{
  "name": "每日早报",
  "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "Asia/Shanghai" },
  "payload": { 
    "kind": "agentTurn", 
    "message": "搜索今天的科技新闻热点，整理成 5 条简报发给我。",
    "model": "haiku"
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "announce" }
}
```

注意 `delivery: { "mode": "announce" }` ——这告诉 OpenClaw 把执行结果发送到你的聊天渠道。如果不设 delivery，任务会静默执行（结果不会发给你）。

`sessionTarget: "main"` 只能搭配 `payload.kind: "systemEvent"`，`sessionTarget: "isolated"` 只能搭配 `payload.kind: "agentTurn"`。搞混了会报错。

at — 一次性定时：在指定时间点执行一次，执行完自动删除。

```json
"schedule": { "kind": "at", "at": "2026-02-23T16:00:00+08:00" }
```

every — 固定间隔循环：每隔 N 毫秒执行一次。

```json
"schedule": { "kind": "every", "everyMs": 3600000 }
```

cron — cron 表达式：最灵活，支持标准 cron 表达式。

```json
"schedule": { "kind": "cron", "expr": "0 9 * * 1", "tz": "Asia/Shanghai" }
```

一定要设 tz（时区）！ 不设的话默认 UTC，你以为设的早上 9 点其实是下午 5 点（UTC+8）。

查看执行历史：

```bash
openclaw cron runs --id <任务ID>
```

## SKILL

Skill 就是一份给 AI 看的操作手册。把"怎么做某件事"写成一个 Markdown 文件，AI 在需要的时候自动读取并按照里面的步骤执行。

OpenClaw 从三个地方加载 Skill，优先级从高到低：

1. <workspace>/skills/     ← 你的 workspace 里的 skill（最高优先级）
2. ~/.openclaw/skills/     ← 全局 skill
3. 内置 skill              ← OpenClaw 自带的（最低优先级）

## 诊断

如果遇到问题，可以使用`openclaw doctor`命令来检查环境和配置是否正确。

`openclaw logs --follow`可以查看实时日志输出，帮助诊断问题。