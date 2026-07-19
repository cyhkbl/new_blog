"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const cardClass =
  "rounded-2xl border border-white/60 bg-white/55 shadow-sm backdrop-blur-2xl saturate-180";

const highlights = [
  {
    label: "Current",
    value: "ZJU BME",
    detail: "浙江大学生物医学工程与仪器科学学院 · 2025.09 - 至今",
  },
  {
    label: "GPA",
    value: "4.44 / 5.00",
    detail: "大一阶段课程表现",
  },
  {
    label: "Focus",
    value: "BME x AI x Systems",
    detail: "生理信号、医学 AI、具身智能、金融工程",
  },
];

const researchTimeline = [
  {
    period: "2025.09 - Present",
    title: "本科教育",
    org: "浙江大学 · 生物医学工程专业",
    description:
      "当前就读于浙江大学生物医学工程与仪器科学学院，方向上持续向医学 AI、生理信号处理与系统工程靠拢。",
    tags: ["BME", "Medical AI", "Systems"],
  },
  {
    period: "2026.06 - Present",
    title: "NeuroFM",
    org: "Independent Research Project",
    description:
      "面向 EEG、ECG、EMG 等公开生理信号数据，探索自监督预训练与通用信号表征学习。当前重点是数据管道、可复现 baseline 与下游任务评测。",
    tags: ["Self-supervised learning", "Physiological signals", "Foundation model"],
  },
  {
    period: "2025.12 - 2026.05",
    title: "计算药物设计方向早期科研训练",
    org: "浙江大学侯廷军课题组",
    description:
      "完成蛋白-配体对接、分子描述符与图神经网络虚拟筛选等早期科研训练后，将后续主线转向生物医学工程中的生理信号、医学影像与 AI 交叉方向。",
    tags: ["Research training", "AIDD", "Scientific workflow"],
  },
];

const projectCards = [
  {
    title: "VitalPulse",
    subtitle: "便携式生理信号实时监测系统",
    text: "基于 ESP32 和 MAX30102 的便携式心率/血氧监测系统，覆盖串口 CSV、WiFi Web 热点与 BLE GATT 三种输出模式。",
  },
  {
    title: "MIT-BIH",
    subtitle: "心电信号处理与分析",
    text: "完成 ECG 信号处理流水线，包括 Butterworth 带通滤波、R 峰检测、心率计算与异常心律识别。",
  },
  {
    title: "Meridian",
    subtitle: "A股市场经纪商引擎",
    text: "从零构建 A 股经纪商撮合引擎，覆盖订单生命周期、FIX 4.4、A 股交易规则、风控 DSL 与 TWAP/VWAP 算法订单。",
  },
  {
    title: "RoverMind",
    subtitle: "ROS2 具身智能机器人平台",
    text: "基于 ROS2 Humble + Gazebo Ignition 的机器人平台，包含差速底盘、LiDAR 避障、P 控制与 Claude API 意图解析。",
  },
  {
    title: "MedDistill",
    subtitle: "医学教材知识蒸馏与 RAG",
    text: "将厚重教材蒸馏至核心知识并构建知识图谱，支持文档解析、跨教材语义对齐与混合检索问答。",
  },
  {
    title: "TechPolicyBoard",
    subtitle: "科技政策智能分析仪表盘",
    text: "面向科技政策研究构建交互式分析平台，覆盖政策时间线、产业链视图、市场反应时滞和 Agent 引导式探索。",
  },
  {
    title: "数学建模",
    subtitle: "浙超分组与赛制优化",
    text: "用 CP-SAT、模拟退火、Monte Carlo 和 Bradley-Terry 模型处理 64 支队伍的分组、抽签、场馆选址与赛制比较。",
  },
  {
    title: "Shell Market Protocol",
    subtitle: "P2P 多智能体服务拍卖网络",
    text: "为 AgentNetwork 构建密封反向拍卖、信誉账本、清算协议、争议裁决与 SSE 实时行情推送。",
  },
  {
    title: "行情/公告数据管道",
    subtitle: "AkShare / Streamlit",
    text: "基于 AkShare 建立行情采集、数据质量检查、指标计算与 Streamlit 看板。",
  },
];

const awards = [
  {
    title: "浙江大学优秀团员",
    meta: "2026.06",
    description: "校级团员荣誉。",
  },
  {
    title: "浙江大学求是学院“公益之星”",
    meta: "2026.06",
    description: "公益与志愿服务相关荣誉。",
  },
  {
    title: "浙江大学AI全栈黑客松第6名",
    meta: "2025.05",
    description: "AI 工程实践类竞赛成绩。",
  },
  {
    title: "HPCWEEK 新生奖",
    meta: "2025.11",
    description: "浙江大学第一届高性能计算竞赛新生奖。",
  },
  {
    title: "高中化学奥林匹克竞赛浙江省预赛三等奖",
    meta: "2024.04",
    description: "化学奥赛省预赛奖项。",
  },
  {
    title: "第37届中国化学奥林匹克（初赛）三等奖",
    meta: "2023.11",
    description: "高中阶段化学竞赛奖项。",
  },
];

const activityGroups = [
  {
    title: "Student Work",
    items: ["蓝田学院党员素质发展中心干事", "启真交叉学科创新创业实验室软件团队营员"],
  },
  {
    title: "Service & Practice",
    items: ["志愿服务累计 80+ 小时", "2025-2026 学年新时代“使命担当”铸魂工程社会实践"],
  },
  {
    title: "Social Activities",
    items: [
      "FLUX 南客松 S2",
      "2026 ROS 春季学校",
      "SGLang AI 大模型推理的工程实践全景",
      "Trae Friends Vibe Coding 实战",
    ],
  },
];

const interests = [
  "神经信号处理与脑机接口（BCI）",
  "生理信号基础模型",
  "自监督预训练",
  "具身智能与机器人控制",
  "医学影像 AI",
];

const techStack = [
  "Python",
  "C/C++",
  "TypeScript",
  "PyTorch",
  "FastAPI",
  "SQLAlchemy 2.0",
  "React",
  "ROS2 Humble",
  "MNE-Python",
  "Google OR-Tools",
  "Docker",
  "Kafka",
  "Redis",
  "Linux",
  "Git",
  "LaTeX",
];

export default function ScholarContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-4xl flex-col gap-6"
    >
      <motion.section variants={item} className={`${cardClass} p-8 md:p-10`}>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-black/45">Scholar</p>
            <h1 className="mt-3 text-3xl font-bold text-[var(--text-primary)] md:text-5xl">
              Academic Record
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-black/60 md:text-right">
            这里整理我的学术经历、研究项目、获奖与阶段性方向。主线是以生物医学工程为锚点，向医学 AI、生理信号基础模型与计算系统延展。
          </p>
        </div>
      </motion.section>

      <motion.section variants={item} className="grid gap-4 md:grid-cols-3">
        {highlights.map((highlight) => (
          <div key={highlight.label} className={`${cardClass} p-6`}>
            <p className="text-xs uppercase tracking-[0.24em] text-black/40">{highlight.label}</p>
            <p className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">{highlight.value}</p>
            <p className="mt-2 text-sm leading-6 text-black/55">{highlight.detail}</p>
          </div>
        ))}
      </motion.section>

      <motion.section variants={item} className={`${cardClass} p-6 md:p-8`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Academic Timeline</h2>
          <span className="hidden h-px flex-1 bg-black/10 sm:block" />
        </div>
        <div className="flex flex-col gap-5">
          {researchTimeline.map((entry) => (
            <article key={`${entry.period}-${entry.title}`} className="border-l border-black/10 pl-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <p className="text-sm text-black/45">{entry.period}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">{entry.title}</h3>
                  <p className="text-sm text-black/50">{entry.org}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-black/65">{entry.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/55">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section variants={item}>
        <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">Selected Projects</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {projectCards.map((project) => (
            <article key={project.title} className={`${cardClass} p-6`}>
              <p className="text-sm text-black/45">{project.subtitle}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{project.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/60">{project.text}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section variants={item} className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <div className={`${cardClass} p-6 md:p-8`}>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Awards & Service</h2>
          <div className="mt-5 flex flex-col gap-4">
            {awards.map((award) => (
              <article key={award.title} className="flex flex-col gap-1 border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{award.title}</h3>
                  <span className="text-sm text-black/45">{award.meta}</span>
                </div>
                <p className="text-sm leading-6 text-black/60">{award.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={`${cardClass} p-6 md:p-8`}>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Activities & Practice</h2>
          <div className="mt-5 flex flex-col gap-4">
            {activityGroups.map((group) => (
              <div key={group.title} className="border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{group.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-black/60">
                  {group.items.map((itemText) => (
                    <li key={itemText}>• {itemText}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section variants={item} className={`${cardClass} p-6 md:p-8`}>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Research Interests & Stack</h2>
        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm font-medium text-black/45">Research Interests</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span key={interest} className="rounded-full bg-black/5 px-3 py-1.5 text-sm text-black/60">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-black/45">Technical Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {techStack.map((skill) => (
                <span key={skill} className="rounded-full border border-black/10 bg-white/45 px-3 py-1.5 text-sm text-black/60">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
