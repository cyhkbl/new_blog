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
    detail: "浙江大学生物医学工程",
  },
  {
    label: "GPA",
    value: "4.53 / 5.00",
    detail: "大一阶段课程表现",
  },
  {
    label: "Focus",
    value: "BME x AI",
    detail: "生理信号、医学 AI、基础模型",
  },
];

const researchTimeline = [
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
      "完成早期科研训练后，将后续主线转向生物医学工程中的生理信号、医学影像与 AI 交叉方向。",
    tags: ["Research training", "AIDD", "Scientific workflow"],
  },
  {
    period: "2025 - Present",
    title: "Biomedical Engineering",
    org: "Zhejiang University",
    description:
      "当前就读于浙江大学生物医学工程与仪器科学学院生物医学工程专业，长期关注 BME 与计算机科学的交叉。",
    tags: ["Biomedical engineering", "Medical AI", "Neuroengineering"],
  },
];

const projectCards = [
  {
    title: "生理信号基础模型",
    subtitle: "NeuroFM",
    text: "参考 masked modeling 与 Transformer 表征学习路线，目标是在睡眠分期、运动想象、心律异常等任务上形成统一的生理信号建模框架。",
  },
  {
    title: "ECG 信号处理",
    subtitle: "MIT-BIH",
    text: "围绕 MIT-BIH 心电数据做滤波、预处理与分类 baseline，为后续多模态生理信号项目积累工程基础。",
  },
  {
    title: "端侧生理信号采集",
    subtitle: "ESP32 / MAX30102",
    text: "基于嵌入式硬件做生理信号采集与端侧 demo 探索，补足 BME 项目中从数据到设备的工程闭环。",
  },
];

const awards = [
  {
    title: "HPCWEEK 新生奖",
    meta: "浙江大学",
    description: "本科早期获得的计算与工程相关奖项。",
  },
  {
    title: "志愿服务 80h+",
    meta: "Campus Service",
    description: "持续参与校内志愿服务与公共事务。",
  },
];

const coursework = [
  "Biomedical Engineering",
  "UC Berkeley CS61A",
  "Embodied Intelligence",
  "Finance minor coursework",
  "Linux / Systems practice",
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
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Research Timeline</h2>
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
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Coursework & Skills</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {coursework.map((course) => (
              <span key={course} className="rounded-full border border-black/10 bg-white/45 px-3 py-1.5 text-sm text-black/60">
                {course}
              </span>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
