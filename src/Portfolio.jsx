// Portfolio.jsx — single-file React portfolio
// Dependencies: framer-motion, lucide-react, tailwindcss

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Code2, ArrowRight, ChevronDown, ChevronUp,
  Sparkles, Layers, Zap, ExternalLink, Github,
  MapPin, Mail, Linkedin, Heart, ArrowUpRight,
} from "lucide-react";
import config from './config.json';

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const HERO_PILLS = [
  { icon: Layers,   label: "7 Years Experience",      cls: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { icon: Sparkles, label: "AI & Cloud Integrations", cls: "bg-violet-50 text-violet-700 border-violet-100" },
  { icon: Zap,      label: "Open to Opportunities",   cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
];

const SKILLS = [
  {
    id: "lang", emoji: "\u2328\uFE0F", label: "Languages", accent: "indigo",
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "SQL", "Dart"],
  },
  {
    id: "fw", emoji: "\uD83E\uDDE9", label: "Frameworks & Runtimes", accent: "violet",
    items: ["React.js", "Vue.js", "Node.js", "Flutter (Android)"],
  },
  {
    id: "cloud", emoji: "\u2601\uFE0F", label: "Cloud & Database", accent: "blue",
    items: ["Firebase / Firestore", "MSSQL", "AWS Lambda", "AWS S3", "AWS DynamoDB"],
  },
  {
    id: "ai", emoji: "\uD83D\uDEE0\uFE0F", label: "AI & Tooling", accent: "emerald",
    items: ["Gemini API", "Model Context Protocol (MCP)", "Stripe Integration", "GitHub Actions (CI/CD)", "SonarQube", "Git"],
  },
];

const SKILL_STYLES = {
  indigo: { header: "bg-indigo-50/80 border-indigo-100 text-indigo-600", chip: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100", card: "border-indigo-100" },
  violet: { header: "bg-violet-50/80 border-violet-100 text-violet-600", chip: "bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100", card: "border-violet-100" },
  blue:   { header: "bg-blue-50/80 border-blue-100 text-blue-600",       chip: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",     card: "border-blue-100"   },
  emerald:{ header: "bg-emerald-50/80 border-emerald-100 text-emerald-600", chip: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100", card: "border-emerald-100" },
};

const PROJECTS = [
  {
    id: "nekotag", emoji: "\uD83D\uDECD\uFE0F", type: "Full-Stack Web",
    title: "NekoTag", subtitle: "AI-Enabled E-Commerce Platform",
    accent: "indigo",
    bullets: [
      "Vite + React storefront with responsive product catalog, cart, and checkout flows.",
      "Firebase Firestore for real-time inventory and order management.",
      "AWS Lambda serverless backend handling order processing and webhooks.",
      "Stripe Sandbox integration with webhook verification for end-to-end payment simulation.",
      "Gemini API + MCP powering an Admin chatbot for inventory Q&A.",
      "GitHub Actions CI/CD pipeline deploying to Firebase Hosting on every merge.",
    ],
    badges: ["React", "Vite", "Firebase", "Firestore", "AWS Lambda", "Stripe", "Gemini API", "MCP", "GitHub Actions"],
  },
  {
    id: "bus", emoji: "\uD83D\uDE8C", type: "Mobile App",
    title: "Bus Service Timing", subtitle: "Android Flutter Transit App",
    accent: "blue",
    bullets: [
      "Native Android app providing real-time Singapore bus arrival timings.",
      "OpenStreetMap integration for interactive route visualization and stop discovery.",
      "AWS Lambda backend proxying and normalizing LTA DataMall API responses.",
      "Clean state management with separation across data, domain, and UI layers.",
    ],
    badges: ["Flutter", "Dart", "Android", "OpenStreetMap", "AWS Lambda", "LTA DataMall API"],
  },
  {
    id: "pw", emoji: "\uD83D\uDD10", type: "Mobile App",
    title: "Password Manager & 2FA", subtitle: "Android Flutter Security Utility",
    accent: "emerald",
    bullets: [
      "Personal security utility combining encrypted password storage and TOTP 2FA.",
      "Credentials stored in AWS DynamoDB with field-level encryption.",
      "Minimalist vault UI with biometric unlock on compatible Android devices.",
      "Offline-first design with local caching for network-independent availability.",
    ],
    badges: ["Flutter", "Dart", "Android", "AWS DynamoDB", "Encryption", "TOTP", "Biometrics"],
  },
];

const PROJECT_STYLES = {
  indigo:  { img: "from-indigo-50 to-violet-50", emoji: "ring-indigo-100 bg-indigo-50", type: "bg-indigo-50 text-indigo-600 border-indigo-100", badge: "bg-indigo-50 text-indigo-700 border-indigo-100", bullet: "bg-indigo-400", visit: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200/60", gh: "bg-slate-800 hover:bg-slate-700" },
  blue:    { img: "from-blue-50 to-sky-50",       emoji: "ring-blue-100 bg-blue-50",     type: "bg-blue-50 text-blue-600 border-blue-100",         badge: "bg-blue-50 text-blue-700 border-blue-100",         bullet: "bg-blue-400",    visit: "bg-blue-600 hover:bg-blue-700 shadow-blue-200/60",     gh: "bg-slate-800 hover:bg-slate-700" },
  emerald: { img: "from-emerald-50 to-teal-50",   emoji: "ring-emerald-100 bg-emerald-50", type: "bg-emerald-50 text-emerald-600 border-emerald-100", badge: "bg-emerald-50 text-emerald-700 border-emerald-100", bullet: "bg-emerald-400", visit: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/60", gh: "bg-slate-800 hover:bg-slate-700" },
};

const CONTACT_LINKS = [
  { label: "GitHub",   icon: Github,   href: config.github,     desc: "Source code & projects",    hover: "hover:border-slate-400 hover:bg-slate-50",   iconCls: "text-slate-700" },
  { label: "LinkedIn", icon: Linkedin, href: config.linkedin,   desc: "Professional network",      hover: "hover:border-blue-300 hover:bg-blue-50",     iconCls: "text-blue-600"  },
  { label: "Email",    icon: Mail,     href: `mailto:${config.email}`, desc: config.email, hover: "hover:border-indigo-300 hover:bg-indigo-50", iconCls: "text-indigo-600"},
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardIn  = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-4"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? "shadow-lg shadow-slate-200/60" : "shadow-sm"}`}
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.5)" }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-semibold text-slate-800 tracking-tight text-sm">Portfolio</span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <button key={l.label} onClick={() => go(l.href)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">{l.label}</button>
              ))}
              <button onClick={() => go("#contact")} className="ml-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-200">Let's Connect</button>
            </nav>

            <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-700">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm md:hidden" />
            <motion.div initial={{ opacity: 0, y: -16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-50 rounded-2xl shadow-xl shadow-slate-200/60 p-4 md:hidden"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.5)" }}>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <button key={l.label} onClick={() => go(l.href)} className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left">{l.label}</button>
                ))}
                <div className="my-1 border-t border-slate-200/60" />
                <button onClick={() => go("#contact")} className="px-4 py-3 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-center">Let's Connect</button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-24 pb-16">
      {/* Ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-100/40 rounded-full blur-3xl opacity-40" />
      </div>
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-35"
        style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {HERO_PILLS.map(({ icon: Icon, label, cls }, i) => (
            <motion.span key={label} custom={i} initial="hidden" animate="visible"
              variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } }) }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cls}`}>
              <Icon size={12} />{label}
            </motion.span>
          ))}
        </div>

        {/* Headline */}
        <motion.h1 custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
          Full-Stack Engineer with{" "}
          <span style={{ background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Mobile Experience
          </span>
          <span className="text-slate-700">.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p custom={1} initial="hidden" animate="visible" variants={fadeUp}
          className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
          I craft responsive web apps and cross-platform mobile experiences using{" "}
          <strong className="font-medium text-slate-700">React</strong> and{" "}
          <strong className="font-medium text-slate-700">Flutter</strong>, and build full-stack prototypes wired to{" "}
          <strong className="font-medium text-slate-700">AWS Lambda</strong>,{" "}
          <strong className="font-medium text-slate-700">Firestore</strong>, and{" "}
          <strong className="font-medium text-slate-700">Gemini AI</strong>—from pixel to pipeline.
        </motion.p>

        {/* CTAs */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-200/60 hover:shadow-lg hover:-translate-y-0.5">
            View My Work <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm hover:-translate-y-0.5">
            Let's Connect
          </button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-20 flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Technical Stack</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Skills & Technologies</h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl leading-relaxed">Seven years of accumulated tooling across frontend, mobile, cloud, and AI—applied pragmatically to ship.</p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {SKILLS.map((cat) => {
            const s = SKILL_STYLES[cat.accent];
            return (
              <motion.div key={cat.id} variants={cardIn} className={`bg-white rounded-2xl border ${s.card} shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden`}>
                <div className={`${s.header} px-5 pt-5 pb-4 border-b flex items-center gap-2.5`}>
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider">{cat.label}</span>
                </div>
                <div className="p-5 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span key={item} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border cursor-default select-none transition-all duration-150 ${s.chip}`} style={{ fontFamily: "JetBrains Mono, Fira Code, monospace" }}>{item}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  const s = PROJECT_STYLES[project.accent];
  const visible = expanded ? project.bullets : project.bullets.slice(0, 3);
  const links = config.projects.find(p => p.id === project.id) || {};

  return (
    <motion.article variants={cardIn} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
      {/* Image slot */}
      <div className={`relative h-48 bg-gradient-to-br ${s.img} overflow-hidden flex items-center justify-center`}>
        <div aria-hidden className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className={`relative z-10 w-20 h-20 rounded-2xl ring-2 ${s.emoji} flex items-center justify-center text-4xl shadow-sm`}>{project.emoji}</div>
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${s.type}`}>{project.type}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">{project.title}</h3>
        <p className="text-sm text-slate-500 mb-4 font-medium">{project.subtitle}</p>

        {/* Bullets */}
        <div className="flex-1 mb-5">
          <ul className="space-y-2.5">
            <AnimatePresence initial={false}>
              {visible.map((b, i) => (
                <motion.li key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                  className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.bullet}`} />{b}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {project.bullets.length > 3 && (
            <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
              {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> +{project.bullets.length - 3} more</>}
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.badges.map((b) => (
            <span key={b} className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${s.badge}`} style={{ fontFamily: "JetBrains Mono, Fira Code, monospace", fontSize: "11px" }}>{b}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {links.visitUrl && (
            <a href={links.visitUrl} target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl text-white transition-all duration-200 shadow-sm ${s.visit}`}>
              <ExternalLink size={14} /> Visit Live Prototype
            </a>
          )}
          {links.githubUrl && (
            <a href={links.githubUrl} target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl text-white transition-all duration-200 ${s.gh}`}>
              <Github size={14} /> GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Selected Work</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Projects Showcase</h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl leading-relaxed">A cross-section of web, mobile, and full-stack projects built to explore real-world architecture and deliver working software.</p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard.writeText(config.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-5">
              Let's build something{" "}
              <span style={{ background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>remarkable.</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">Whether it's a new product, a complex integration, or an AI-powered prototype—I'm always open to discussing interesting engineering challenges.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin size={14} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Based in {config.location}</span>
            </div>
            <div className="mt-6">
              <button onClick={copyEmail} className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                <Mail size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="font-mono text-sm">{config.email}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md transition-all duration-200 ${copied ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"}`}>
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Right */}
          <div className="flex flex-col gap-3">
            {CONTACT_LINKS.map(({ label, icon: Icon, href, desc, hover, iconCls }, i) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }) }}
                className={`group flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${hover}`}>
                <div className={`w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 ${iconCls}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{desc}</p>
                </div>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center"><Code2 size={12} className="text-white" /></div>
            <span className="text-sm font-medium text-slate-700">Portfolio</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">Built with React, Vite & Framer Motion <Heart size={11} className="text-indigo-400 fill-indigo-400 ml-1" /></p>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} — All rights reserved.</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
