"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { id: "about", label: "Profile" },
  { id: "education", label: "Education" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "awards", label: "Honors" },
  { id: "activities", label: "Activities" },
];

const profileLinks = [
  { label: "GitHub", href: "https://github.com/cyhkbl" },
  { label: "Blog", href: "/" },
  { label: "Email", href: "mailto:chenyiheng@zju.edu.cn" },
];

const highlights = [
  { label: "Current", value: "ZJU BME" },
  { label: "GPA", value: "4.44 / 5.00" },
  { label: "Focus", value: "BME x AI x Systems" },
];

const aboutParagraphs = [
  "I am an undergraduate student in Biomedical Engineering at Zhejiang University. My current work sits around physiological signals, medical AI, and systems engineering.",
  "I am building toward foundation models for multi-channel biosignals, with an engineering bias toward reproducible data pipelines, baselines, and deployable research tools.",
];

const educationTimeline = [
  {
    date: "2025.09 - Present",
    title: "Zhejiang University",
    org: "Biomedical Engineering and Instrument Science",
    detail: "Biomedical Engineering, Class of 2025. GPA 4.44 / 5.00.",
    mark: "ZJU",
  },
  {
    date: "2022.09 - 2025.09",
    title: "Hangzhou No.2 High School",
    org: "Zhejiang Province",
    detail: "High school education before entering Zhejiang University.",
    mark: "HZ2",
  },
];

const researchTimeline = [
  {
    date: "2026.06 - Present",
    title: "NeuroFM",
    org: "Independent Research Project",
    detail:
      "A self-supervised foundation model project for EEG, ECG, EMG and fNIRS signals, using masked autoencoding and Transformer encoders for transferable biosignal representations.",
    mark: "NF",
  },
  {
    date: "2025.12 - 2026.05",
    title: "Early Research Training in Computational Drug Design",
    org: "Prof. Tingjun Hou's group, Zhejiang University",
    detail:
      "Worked with protein-ligand docking, molecular descriptors, graph neural network based virtual screening, and literature reproduction for drug-target interaction prediction.",
    mark: "CDD",
  },
];

const projectCards = [
  {
    title: "VitalPulse",
    subtitle: "Portable physiological signal monitoring",
    text: "ESP32 and MAX30102 based heart-rate / SpO2 monitor with serial CSV, WiFi SSE dashboard, BLE GATT, 100 Hz sampling, filtering, peak detection and host-side tests.",
    mark: "VP",
  },
  {
    title: "MIT-BIH ECG Signal Processing",
    subtitle: "ECG pipeline and arrhythmia analysis",
    text: "Implemented Butterworth band-pass denoising, R-peak detection, heart-rate calculation, arrhythmia recognition and quantitative evaluation against expert annotations.",
    mark: "ECG",
  },
  {
    title: "Meridian",
    subtitle: "A-share broker matching engine",
    text: "A production-style broker engine with FIFO price-time matching, FIX 4.4 gateway, Chinese market rules, Risk DSL, TWAP/VWAP slicing and event-sourced audit trails.",
    mark: "MKT",
  },
  {
    title: "RoverMind",
    subtitle: "ROS2 embodied-intelligence platform",
    text: "ROS2 Humble and Gazebo Ignition robot platform with differential drive, LiDAR avoidance, odometry navigation, action primitives and LLM-based task planning.",
    mark: "ROS",
  },
  {
    title: "MedDistill",
    subtitle: "Medical textbook distillation and RAG",
    text: "Condenses medical textbooks into core knowledge graphs, supports multi-format parsing, semantic alignment, hybrid retrieval and citation-grounded QA.",
    mark: "RAG",
  },
  {
    title: "TechPolicyBoard",
    subtitle: "Technology-policy intelligence dashboard",
    text: "Interactive policy research dashboard with timelines, industrial-chain views, market lag analysis and agent-guided exploration.",
    mark: "TPB",
  },
  {
    title: "ZJU Mathematical Modeling",
    subtitle: "Zhejiang Super League grouping",
    text: "Optimized grouping, lottery, venue selection and competition formats using CP-SAT, simulated annealing, Monte Carlo and Bradley-Terry modeling.",
    mark: "MM",
  },
  {
    title: "Shell Market Protocol",
    subtitle: "P2P multi-agent service auction network",
    text: "Built sealed reverse auctions, global reputation ledger, clearing protocol, dispute resolution and SSE market feeds for AgentNetwork.",
    mark: "SMP",
  },
  {
    title: "Market / Announcement Data Pipeline",
    subtitle: "AkShare and Streamlit",
    text: "A data pipeline for market collection, quality checks, indicator computation and lightweight dashboards.",
    mark: "DATA",
  },
];

const awards = [
  { date: "2026.06", title: "Zhejiang University Outstanding League Member", org: "University-level honor" },
  { date: "2026.06", title: "Qiushi College Public Welfare Star", org: "Volunteer-service honor" },
  { date: "2025.05", title: "ZJU AI Full-stack Hackathon, 6th Place", org: "AI engineering competition" },
  { date: "2025.11", title: "HPCWEEK Freshman Award", org: "The 1st Zhejiang University High Performance Computing Contest" },
  { date: "2024.04", title: "Zhejiang Provincial Chemistry Olympiad Preliminary, Third Prize", org: "High-school chemistry competition" },
  { date: "2023.11", title: "37th Chinese Chemistry Olympiad Preliminary, Third Prize", org: "High-school chemistry competition" },
];

const activityGroups = [
  {
    title: "Student Work",
    items: ["Lantian College Party Member Quality Development Center", "Qizhen Interdisciplinary Innovation Lab, software team"],
  },
  {
    title: "Service and Practice",
    items: ["80+ hours of volunteer service", "2025-2026 Zhejiang University social-practice program"],
  },
  {
    title: "Community Activities",
    items: ["FLUX NanKe Hackathon S2", "2026 ROS Spring School", "SGLang engineering practice", "Trae Friends Vibe Coding"],
  },
];

const interests = [
  "Neural signal processing",
  "Brain-computer interfaces",
  "Physiological signal foundation models",
  "Self-supervised pretraining",
  "Embodied intelligence",
  "Medical imaging AI",
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

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <motion.div variants={reveal} className="scholar-section-head">
      <span className="scholar-section-index">{index}</span>
      <h2>{title}</h2>
    </motion.div>
  );
}

function Timeline({
  items,
}: {
  items: Array<{ date: string; title: string; org: string; detail: string; mark: string }>;
}) {
  return (
    <motion.div variants={reveal} className="scholar-timeline">
      {items.map((entry) => (
        <article key={`${entry.date}-${entry.title}`} className="scholar-timeline-item">
          <div className="scholar-mark" aria-hidden="true">
            {entry.mark}
          </div>
          <div>
            <p className="scholar-date">{entry.date}</p>
            <h3>{entry.title}</h3>
            <p className="scholar-org">{entry.org}</p>
            <p className="scholar-detail">{entry.detail}</p>
          </div>
        </article>
      ))}
    </motion.div>
  );
}

function ProjectList() {
  return (
    <motion.div variants={reveal} className="scholar-project-list">
      {projectCards.map((project) => (
        <article key={project.title} className="scholar-project">
          <div className="scholar-project-thumb" aria-hidden="true">
            {project.mark}
          </div>
          <div className="scholar-project-body">
            <p className="scholar-project-subtitle">{project.subtitle}</p>
            <h3>{project.title}</h3>
            <p>{project.text}</p>
          </div>
        </article>
      ))}
    </motion.div>
  );
}

function AwardList() {
  return (
    <motion.div variants={reveal} className="scholar-awards">
      {awards.map((award) => (
        <article key={`${award.date}-${award.title}`} className="scholar-award-row">
          <p>{award.date}</p>
          <div>
            <h3>{award.title}</h3>
            <span>{award.org}</span>
          </div>
        </article>
      ))}
    </motion.div>
  );
}

function TagGroup({ items }: { items: string[] }) {
  return (
    <div className="scholar-tags">
      {items.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

export default function ScholarAcademicContent() {
  const [active, setActive] = useState(navItems[0].id);

  useEffect(() => {
    const updateActive = () => {
      const sampleLine = window.innerHeight * 0.32;
      let current = navItems[0].id;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= sampleLine) current = item.id;
      }

      setActive(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = document.querySelector(".scholar-nav")?.clientHeight ?? 0;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - navHeight - 16,
      behavior: "smooth",
    });
  };

  return (
    <div className="scholar-ac">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400;1,700&family=Fira+Mono:wght@400;500;700&display=swap");

        .scholar-ac {
          --scholar-bg: #fff;
          --scholar-bg-elev: #fdfafe;
          --scholar-bg-tint: #f8edf4;
          --scholar-ink: #0d0d10;
          --scholar-ink-2: #46464a;
          --scholar-ink-3: #6b6b70;
          --scholar-line: #f2e6f0;
          --scholar-line-2: #e3cfe2;
          --scholar-accent: #8a5ba6;
          --scholar-accent-ink: #4a2f6a;
          --scholar-accent-soft: #f0e0ee;
          position: relative;
          min-height: 100vh;
          overflow: clip;
          background:
            linear-gradient(180deg, rgba(248, 237, 244, 0.42), rgba(255, 255, 255, 0) 360px),
            var(--scholar-bg);
          color: var(--scholar-ink);
          font-family: "Merriweather", Georgia, "Times New Roman", "Noto Serif CJK SC", serif;
          font-size: 16px;
          line-height: 1.65;
        }

        .scholar-ac * {
          box-sizing: border-box;
          letter-spacing: 0;
        }

        .scholar-ac::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(var(--scholar-line-2) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.28;
        }

        .scholar-sprig {
          position: fixed;
          right: clamp(20px, 6vw, 96px);
          top: 112px;
          z-index: 0;
          width: 220px;
          height: 420px;
          pointer-events: none;
          opacity: 0.34;
        }

        .scholar-sprig::before,
        .scholar-sprig::after {
          content: "";
          position: absolute;
          inset: 0;
          border-right: 1px solid var(--scholar-line-2);
          border-radius: 50%;
          transform: rotate(18deg);
        }

        .scholar-sprig::after {
          width: 120px;
          height: 120px;
          inset: 54px 0 auto auto;
          border: 1px solid var(--scholar-line-2);
          border-left-color: transparent;
          transform: rotate(-28deg);
        }

        .scholar-ac a {
          color: var(--scholar-accent-ink);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .scholar-ac a:hover {
          color: var(--scholar-accent);
          border-bottom-color: var(--scholar-accent);
        }

        .scholar-nav {
          position: sticky;
          top: 0;
          z-index: 40;
          border-bottom: 1px solid rgba(227, 207, 226, 0.72);
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(14px) saturate(160%);
        }

        .scholar-nav-inner {
          max-width: 1240px;
          min-height: 64px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .scholar-brand {
          flex: 0 0 220px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-bottom: 0;
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 13px;
          font-weight: 600;
        }

        .scholar-brand img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          transition: transform 0.24s ease;
        }

        .scholar-brand:hover img {
          transform: scale(1.08) rotate(-4deg);
        }

        .scholar-nav-links {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .scholar-nav-links::-webkit-scrollbar {
          display: none;
        }

        .scholar-nav-link {
          flex: 0 0 auto;
          border: 0;
          border-radius: 999px;
          background: transparent;
          padding: 9px 13px;
          color: var(--scholar-ink-2);
          cursor: pointer;
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
          line-height: 1;
        }

        .scholar-nav-link.active {
          background: var(--scholar-accent-soft);
          color: var(--scholar-accent-ink);
        }

        .scholar-page {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 48px 48px 96px;
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 64px;
          align-items: start;
        }

        .scholar-sidebar {
          position: sticky;
          top: 96px;
          text-align: center;
        }

        .scholar-avatar-wrap {
          position: relative;
          width: 188px;
          height: 188px;
          margin: 0 auto 28px;
        }

        .scholar-avatar-orbit,
        .scholar-avatar-orbit-2 {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .scholar-avatar-orbit {
          inset: -14px;
          border: 1px dashed rgba(138, 91, 166, 0.5);
          animation: scholarOrbit 28s linear infinite;
        }

        .scholar-avatar-orbit-2 {
          inset: -4px;
          border: 1px solid rgba(227, 207, 226, 0.88);
        }

        .scholar-avatar-orbit::before,
        .scholar-avatar-orbit::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--scholar-accent);
          box-shadow: 0 0 0 3px rgba(138, 91, 166, 0.14);
        }

        .scholar-avatar-orbit::before {
          top: -4px;
          left: 50%;
          margin-left: -4px;
        }

        .scholar-avatar-orbit::after {
          bottom: -4px;
          left: 50%;
          margin-left: -4px;
        }

        .scholar-avatar {
          position: absolute;
          inset: 10px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid var(--scholar-line);
          border-radius: 50%;
          background: var(--scholar-bg-elev);
          box-shadow: 0 10px 30px rgba(74, 47, 106, 0.1);
        }

        .scholar-avatar img {
          width: 82%;
          height: 82%;
          object-fit: contain;
        }

        .scholar-name {
          margin: 0;
          color: var(--scholar-ink);
          font-size: clamp(28px, 3.4vw, 38px);
          font-weight: 700;
          line-height: 1.12;
        }

        .scholar-handle {
          margin: 8px 0 0;
          color: var(--scholar-accent);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 13px;
        }

        .scholar-tagline {
          margin: 20px auto 0;
          max-width: 210px;
          color: var(--scholar-ink-2);
          font-size: 14px;
          line-height: 1.8;
        }

        .scholar-meta {
          margin-top: 24px;
          display: grid;
          gap: 8px;
          color: var(--scholar-ink-3);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
        }

        .scholar-socials {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .scholar-socials a {
          border: 1px solid var(--scholar-line);
          border-radius: 999px;
          padding: 7px 10px;
          background: rgba(255, 255, 255, 0.64);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 11px;
        }

        .scholar-stats {
          margin-top: 24px;
          display: grid;
          gap: 10px;
          text-align: left;
        }

        .scholar-stat {
          border-top: 1px dashed var(--scholar-line-2);
          padding-top: 10px;
        }

        .scholar-stat p {
          margin: 0;
        }

        .scholar-stat-label {
          color: var(--scholar-ink-3);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 11px;
        }

        .scholar-stat-value {
          margin-top: 2px;
          color: var(--scholar-ink);
          font-size: 14px;
          font-weight: 700;
        }

        .scholar-main {
          min-width: 0;
          padding-top: 4px;
        }

        .scholar-section {
          padding: 34px 0 8px;
          scroll-margin-top: 86px;
        }

        .scholar-section:first-child {
          padding-top: 0;
        }

        .scholar-section-head {
          position: relative;
          margin-bottom: 22px;
          padding-bottom: 12px;
          display: flex;
          align-items: baseline;
          gap: 14px;
          border-bottom: 1px solid var(--scholar-line);
        }

        .scholar-section-head::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 42px;
          height: 2px;
          border-radius: 2px;
          background: var(--scholar-accent);
        }

        .scholar-section-head h2 {
          margin: 0;
          color: var(--scholar-ink);
          font-size: 22px;
          font-weight: 600;
        }

        .scholar-section-index {
          color: var(--scholar-accent);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 11px;
        }

        .scholar-about {
          max-width: 780px;
          color: var(--scholar-ink-2);
          font-size: 16px;
          line-height: 1.88;
        }

        .scholar-about p {
          margin: 0;
        }

        .scholar-about p + p {
          margin-top: 1.1em;
        }

        .scholar-timeline {
          display: grid;
          gap: 0;
        }

        .scholar-timeline-item {
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr);
          gap: 20px;
          padding: 0 0 28px;
        }

        .scholar-timeline-item:last-child {
          padding-bottom: 0;
        }

        .scholar-mark,
        .scholar-project-thumb {
          display: grid;
          place-items: center;
          border: 1px solid var(--scholar-line);
          border-radius: 8px;
          background: linear-gradient(135deg, #fff, var(--scholar-bg-tint));
          color: var(--scholar-accent-ink);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
          font-weight: 700;
        }

        .scholar-mark {
          width: 72px;
          height: 72px;
        }

        .scholar-date,
        .scholar-project-subtitle,
        .scholar-award-row > p {
          margin: 0 0 5px;
          color: var(--scholar-ink-3);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
        }

        .scholar-timeline h3,
        .scholar-project h3,
        .scholar-award-row h3,
        .scholar-activity h3 {
          margin: 0;
          color: var(--scholar-ink);
          font-size: 17px;
          font-weight: 600;
          line-height: 1.45;
        }

        .scholar-org {
          margin: 3px 0 0;
          color: var(--scholar-accent-ink);
          font-size: 14px;
        }

        .scholar-detail,
        .scholar-project-body p,
        .scholar-award-row span,
        .scholar-activity li {
          color: var(--scholar-ink-2);
          font-size: 14px;
          line-height: 1.76;
        }

        .scholar-detail {
          margin: 10px 0 0;
        }

        .scholar-project-list {
          display: grid;
          gap: 6px;
        }

        .scholar-project {
          display: grid;
          grid-template-columns: 138px minmax(0, 1fr);
          gap: 20px;
          padding: 18px 0;
          border-bottom: 1px dashed var(--scholar-line);
        }

        .scholar-project:last-child {
          border-bottom: 0;
        }

        .scholar-project-thumb {
          width: 138px;
          min-height: 92px;
          align-self: start;
          font-size: 13px;
        }

        .scholar-project-body p {
          margin: 9px 0 0;
        }

        .scholar-awards {
          display: grid;
        }

        .scholar-award-row {
          display: grid;
          grid-template-columns: 100px minmax(0, 1fr);
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px dashed var(--scholar-line);
          align-items: baseline;
        }

        .scholar-award-row:last-child {
          border-bottom: 0;
        }

        .scholar-award-row h3 {
          font-size: 15px;
          font-weight: 500;
        }

        .scholar-activity-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .scholar-activity {
          border-top: 1px solid var(--scholar-line);
          padding-top: 14px;
        }

        .scholar-activity ul {
          margin: 10px 0 0;
          padding: 0;
          list-style: none;
        }

        .scholar-activity li {
          position: relative;
          padding-left: 14px;
        }

        .scholar-activity li + li {
          margin-top: 8px;
        }

        .scholar-activity li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.82em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--scholar-accent);
        }

        .scholar-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .scholar-tags span {
          border: 1px solid var(--scholar-line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.68);
          padding: 7px 10px;
          color: var(--scholar-ink-2);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
        }

        .scholar-stack-block + .scholar-stack-block {
          margin-top: 22px;
        }

        .scholar-stack-label {
          margin: 0 0 10px;
          color: var(--scholar-ink-3);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
        }

        .scholar-footer {
          margin-top: 56px;
          padding-top: 18px;
          border-top: 1px solid var(--scholar-line);
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: var(--scholar-ink-3);
          font-family: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
        }

        @keyframes scholarOrbit {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 980px) {
          .scholar-nav-inner {
            padding: 0 28px;
          }

          .scholar-brand {
            flex: 0 0 auto;
          }

          .scholar-page {
            grid-template-columns: 1fr;
            gap: 34px;
            padding: 42px 28px 86px;
          }

          .scholar-sidebar {
            position: static;
          }

          .scholar-stats {
            max-width: 520px;
            margin-left: auto;
            margin-right: auto;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .scholar-main {
            padding-top: 0;
          }
        }

        @media (max-width: 720px) {
          .scholar-nav-inner {
            min-height: auto;
            width: 100%;
            padding: 10px 20px;
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .scholar-nav-links {
            width: 100%;
            max-width: 100%;
            display: grid;
            grid-template-columns: repeat(3, max-content);
            column-gap: 4px;
            row-gap: 6px;
            overflow-x: visible;
          }

          .scholar-nav-link {
            padding: 8px 11px;
          }

          .scholar-page {
            padding: 34px 20px 78px;
          }

          .scholar-avatar-wrap {
            width: 164px;
            height: 164px;
          }

          .scholar-stats,
          .scholar-activity-grid {
            grid-template-columns: 1fr;
          }

          .scholar-timeline-item,
          .scholar-project,
          .scholar-award-row {
            grid-template-columns: 1fr;
          }

          .scholar-mark,
          .scholar-project-thumb {
            width: 100%;
            min-height: 64px;
          }

          .scholar-footer {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="scholar-sprig" aria-hidden="true" />

      <nav className="scholar-nav">
        <div className="scholar-nav-inner">
          <Link href="/" className="scholar-brand" aria-label="Back to home">
            <img src="/images/avatar_without_background.png" alt="" />
            <span>cyhkbl</span>
          </Link>
          <div className="scholar-nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`scholar-nav-link ${active === item.id ? "active" : ""}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            <Link href="/articles" className="scholar-nav-link">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <motion.div
        className="scholar-page"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <aside className="scholar-sidebar" id="about">
          <motion.div variants={reveal} className="scholar-avatar-wrap">
            <div className="scholar-avatar-orbit-2" aria-hidden="true" />
            <div className="scholar-avatar-orbit" aria-hidden="true" />
            <div className="scholar-avatar">
              <img src="/images/avatar_without_background.png" alt="陈逸恒" />
            </div>
          </motion.div>

          <motion.div variants={reveal}>
            <h1 className="scholar-name">陈逸恒</h1>
            <p className="scholar-handle">@cyhkbl</p>
            <p className="scholar-tagline">
              Biomedical Engineering undergraduate at Zhejiang University.
            </p>
          </motion.div>

          <motion.div variants={reveal} className="scholar-meta">
            <span>Zhejiang University</span>
            <span>chenyiheng#zju.edu.cn</span>
            <span>Hangzhou, China</span>
          </motion.div>

          <motion.div variants={reveal} className="scholar-socials">
            {profileLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ),
            )}
          </motion.div>

          <motion.div variants={reveal} className="scholar-stats">
            {highlights.map((item) => (
              <div key={item.label} className="scholar-stat">
                <p className="scholar-stat-label">{item.label}</p>
                <p className="scholar-stat-value">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </aside>

        <main className="scholar-main">
          <section className="scholar-section scholar-section-first">
            <motion.div variants={reveal} className="scholar-about">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </motion.div>
          </section>

          <section className="scholar-section" id="education">
            <SectionHead index="01" title="Education" />
            <Timeline items={educationTimeline} />
          </section>

          <section className="scholar-section" id="research">
            <SectionHead index="02" title="Research Experience" />
            <Timeline items={researchTimeline} />
          </section>

          <section className="scholar-section" id="projects">
            <SectionHead index="03" title="Selected Projects" />
            <ProjectList />
          </section>

          <section className="scholar-section" id="awards">
            <SectionHead index="04" title="Honors and Awards" />
            <AwardList />
          </section>

          <section className="scholar-section" id="activities">
            <SectionHead index="05" title="Activities and Practice" />
            <motion.div variants={reveal} className="scholar-activity-grid">
              {activityGroups.map((group) => (
                <article key={group.title} className="scholar-activity">
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </motion.div>
          </section>

          <section className="scholar-section">
            <SectionHead index="06" title="Research Interests and Stack" />
            <motion.div variants={reveal}>
              <div className="scholar-stack-block">
                <p className="scholar-stack-label">Research Interests</p>
                <TagGroup items={interests} />
              </div>
              <div className="scholar-stack-block">
                <p className="scholar-stack-label">Technical Stack</p>
                <TagGroup items={techStack} />
              </div>
            </motion.div>
          </section>

          <footer className="scholar-footer">
            <span>© 2026 陈逸恒</span>
            <span>Scholar page for cyhkbl.qzz.io</span>
          </footer>
        </main>
      </motion.div>
    </div>
  );
}
