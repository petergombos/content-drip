import {
  ArrowRight,
  CircleCheckBig,
  Clock,
  FileText,
  Globe,
  KeyRound,
  LogOut,
  Mail,
  Pause,
  Play,
  Plug,
  RefreshCcw,
  ShieldCheck,
  UserPlus,
  Workflow,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DripBackground } from "@/components/drip-background";
import { HeroAnimation } from "@/components/hero-animation";
import { HowItWorksSection } from "@/components/how-it-works-section";

export const metadata: Metadata = {
  title: "ContentDrip — Open-Source Email Drip Courses",
  description:
    "Turn your knowledge into automated email courses. Open-source, self-hosted, built with Next.js.",
};

/* ── Data ── */

const STACK = [
  { name: "Next.js", note: "App Router, Server Actions, API Routes" },
  { name: "React Email", note: "Type-safe, cross-client email templates" },
  { name: "Drizzle ORM", note: "Type-safe SQL with zero-overhead" },
  { name: "SQLite / Turso", note: "Edge-ready, zero-config database" },
  {
    name: "Postmark / Resend",
    note: "Pluggable email adapters — bring your own provider",
  },
  { name: "Tailwind CSS", note: "Utility-first styling throughout" },
];

/* ── Page ── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e8e8] selection:bg-[#c8ff00]/20 selection:text-[#c8ff00]">
      {/* ── Header ── */}
      <header className="border-b border-[#1a1a1a]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-tight text-[#e8e8e8] no-underline"
          >
            ContentDrip
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/docs"
              className="font-mono text-sm text-[#666] no-underline transition-colors hover:text-[#e8e8e8]"
            >
              docs
            </Link>
            <Link
              href="/mindful-productivity"
              className="font-mono text-sm text-[#666] no-underline transition-colors hover:text-[#e8e8e8]"
            >
              demo
            </Link>
            <a
              href="https://github.com/petergombos/content-drip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666] no-underline transition-colors hover:text-[#e8e8e8]"
              aria-label="GitHub"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#1a1a1a]">
        <div className="absolute inset-0 bg-grid-dark" />
        <DripBackground />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-32 md:pt-28">
          {/* Right: animated subscription → drip visual (absolutely positioned) */}
          <div className="pointer-events-none absolute bottom-0 right-6 top-0 hidden w-[340px] items-center lg:flex">
            <div className="animate-fade-in delay-3 w-full">
              <HeroAnimation />
            </div>
          </div>

          <p className="animate-fade-in-up font-mono text-[13px] uppercase tracking-[0.3em] text-[#c8ff00]">
            Open Source
          </p>

          <h1 className="animate-fade-in-up delay-1 mt-6 max-w-4xl text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.02] tracking-tighter">
            Ship email courses
            <br />
            from <span className="text-[#c8ff00]">markdown</span>.
          </h1>

          <p className="animate-fade-in-up delay-2 mt-6 max-w-xl font-mono text-base leading-relaxed text-[#777]">
            ContentDrip is an open-source Next.js template for building
            automated email drip courses. You write content in markdown, define
            a delivery schedule, and subscribers receive one lesson at a time —
            at the hour they choose, in their timezone.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-3 mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="group inline-flex h-9 items-center gap-2 bg-[#c8ff00] px-4 font-mono text-[13px] font-bold uppercase tracking-widest text-[#050505] no-underline transition-colors hover:bg-[#d8ff44]"
            >
              Get Started
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/mindful-productivity"
              className="inline-flex h-9 items-center border border-[#333] px-4 font-mono text-[13px] font-bold uppercase tracking-widest text-[#777] no-underline transition-colors hover:border-[#555] hover:text-[#e8e8e8]"
            >
              View Demo
            </Link>
          </div>

          <p className="animate-fade-in-up delay-4 mt-6 font-mono text-xs uppercase tracking-widest text-[#333]">
            MIT Licensed &middot; Self-Hosted &middot; No Vendor Lock-In
          </p>
        </div>
      </section>

      {/* ── The Drip Flow ── */}
      <section className="border-b border-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#444]">
            The Drip Flow
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            What happens after someone subscribes
          </h2>
          <p className="mt-3 max-w-xl font-mono text-base leading-relaxed text-[#555]">
            Every subscription follows the same lifecycle. No configuration
            needed — this is how ContentDrip works out of the box.
          </p>

          {/* Horizontal timeline */}
          <div className="mt-10 overflow-x-auto">
            <div className="relative min-w-[700px]">
              {/* Horizontal line */}
              <div className="absolute left-0 right-0 top-5 h-px bg-[#1a1a1a]" />

              <div className="grid grid-cols-5">
                {(
                  [
                    {
                      icon: UserPlus,
                      label: "Subscribe",
                      desc: "Visitor enters email + preferred delivery time",
                    },
                    {
                      icon: ShieldCheck,
                      label: "Confirm",
                      desc: "Signed token email → click to activate",
                    },
                    {
                      icon: Mail,
                      label: "Welcome",
                      desc: "Sent immediately on confirmation",
                    },
                    {
                      icon: Clock,
                      label: "Drip",
                      desc: "One lesson per day at the chosen time & timezone",
                    },
                    {
                      icon: CircleCheckBig,
                      label: "Complete",
                      desc: "Marked as completed after final step",
                    },
                  ] as const
                ).map((step) => (
                  <div key={step.label} className="relative flex flex-col items-center text-center">
                    {/* Node */}
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a] bg-[#0a0a0a]">
                      <step.icon
                        className="h-4 w-4 text-[#c8ff00]"
                        strokeWidth={1.5}
                      />
                    </div>
                    {/* Content */}
                    <p className="mt-3 font-mono text-[12px] font-bold uppercase tracking-wider text-[#c8ff00]">
                      {step.label}
                    </p>
                    <p className="mt-1 px-2 text-[13px] leading-relaxed text-[#555]">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Anytime actions */}
          <div className="mt-8 grid gap-px bg-[#1a1a1a] p-px sm:grid-cols-2">
            <div className="flex items-center gap-3 bg-[#050505] px-5 py-4">
              <Pause
                className="h-4 w-4 shrink-0 text-[#c8ff00]"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#888]">
                  Pause
                </p>
                <p className="mt-0.5 text-[13px] text-[#555]">
                  Resume exactly where they left off
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#050505] px-5 py-4">
              <LogOut
                className="h-4 w-4 shrink-0 text-[#c8ff00]"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#888]">
                  Unsubscribe
                </p>
                <p className="mt-0.5 text-[13px] text-[#555]">
                  One-click, signed link, instant
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-px bg-[#1a1a1a] p-px sm:grid-cols-3">
            {(
              [
                {
                  icon: KeyRound,
                  label: "Signed Tokens",
                  desc: "Every action link (confirm, manage, pause, stop) uses a cryptographically signed, single-use token. No passwords, no sessions.",
                },
                {
                  icon: RefreshCcw,
                  label: "Idempotent Delivery",
                  desc: "The send log tracks every email sent. If the cron job runs twice, the same step is never sent again. Safe to retry, safe to overlap.",
                },
                {
                  icon: Workflow,
                  label: "Status Machine",
                  desc: "Subscriptions move through PENDING_CONFIRM → ACTIVE → PAUSED → COMPLETED or STOPPED. Every transition is logged and auditable.",
                },
              ] as const
            ).map((item) => (
              <div key={item.label} className="bg-[#050505] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#c8ff0020] bg-[#c8ff0008] shadow-[0_0_16px_#c8ff0015]">
                  <item.icon
                    className="h-5 w-5 text-[#c8ff00]"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                  {item.label}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#777]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#444]">
            Features
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need, nothing you don&apos;t.
          </h2>

          <div className="mt-10 flex flex-col gap-px bg-[#1a1a1a] p-px">
            {/* Row 1: Three tall feature cards */}
            <div className="grid gap-px md:grid-cols-3">
              {/* Content Packs */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <pre className="font-mono text-[12px] leading-[1.7] text-[#444]">
                  {`📁 my-course/
├── pack.ts
├── email-shell.tsx
├── emails/
│   ├── welcome.md
│   └── day-1.md
└── pages/
    └── day-1.md`}
                </pre>
                <div className="mt-auto pt-5">
                  <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                    Content Packs
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#666]">
                    Self-contained folders of markdown emails, web pages, and a
                    branded email template.
                  </p>
                </div>
              </div>

              {/* Scheduled Delivery */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#c8ff00]/40" />
                  <div className="font-mono text-[12px] text-[#444]">
                    subscriber picks a time
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {["06:00", "08:00", "09:30", "12:00", "18:00"].map(
                    (time, i) => (
                      <div key={time} className="flex items-center gap-3">
                        <span className="w-12 font-mono text-[12px] text-[#555]">
                          {time}
                        </span>
                        <div className="flex-1 border-b border-dashed border-[#1a1a1a]" />
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-[#c8ff00]" : "bg-[#222]"}`}
                        />
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-auto pt-5">
                  <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                    Scheduled Delivery
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#666]">
                    Subscribers choose their delivery hour. Emails arrive at the
                    exact time they chose. No batching.
                  </p>
                </div>
              </div>

              {/* Timezone Aware */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-[#c8ff00]/40" />
                  <div className="font-mono text-[12px] text-[#444]">
                    auto-detected via Intl API
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 font-mono text-[12px]">
                  {[
                    { tz: "America/New_York", time: "08:00", label: "EST" },
                    { tz: "Europe/London", time: "13:00", label: "GMT" },
                    { tz: "Asia/Tokyo", time: "22:00", label: "JST" },
                  ].map((row) => (
                    <div
                      key={row.tz}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[#555]">{row.tz}</span>
                      <span className="text-[#777]">
                        <span className="text-[#c8ff00]/60">{row.label}</span>{" "}
                        {row.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-5">
                  <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                    Timezone Aware
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#666]">
                    8am means 8am wherever they are. Timezones are auto-detected
                    and stored per subscription.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Two wide cards */}
            <div className="grid gap-px md:grid-cols-2">
              {/* Companion Pages */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="border border-[#1a1a1a] bg-[#0a0a0a]">
                  <div className="flex items-center gap-1.5 border-b border-[#1a1a1a] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                    <span className="ml-2 font-mono text-[10px] text-[#333]">
                      yoursite.com/p/my-course/day-1
                    </span>
                  </div>
                  <div className="space-y-1.5 px-4 py-3">
                    <div className="h-2 w-3/4 rounded-sm bg-[#1a1a1a]" />
                    <div className="h-2 w-full rounded-sm bg-[#1a1a1a]" />
                    <div className="h-2 w-5/6 rounded-sm bg-[#1a1a1a]" />
                    <div className="h-2 w-2/3 rounded-sm bg-[#1a1a1a]" />
                  </div>
                </div>
                <div className="mt-auto pt-5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#c8ff00]/40" />
                    <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                      Companion Pages
                    </p>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#666]">
                    Every email gets a web-readable page. Subscribers share
                    links and read on any device — no inbox digging.
                  </p>
                </div>
              </div>

              {/* Email Branding */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="border border-[#1a1a1a] bg-[#0a0a0a]">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] px-3 py-1.5">
                    <span className="font-mono text-[10px] text-[#333]">
                      EmailShell.tsx
                    </span>
                    <Mail className="h-3 w-3 text-[#333]" />
                  </div>
                  <div className="px-4 py-3">
                    <div className="mx-auto max-w-[200px] border border-dashed border-[#222] p-2">
                      <div className="mb-2 h-3 w-16 bg-[#c8ff00]/10" />
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-sm bg-[#1a1a1a]" />
                        <div className="h-1.5 w-4/5 rounded-sm bg-[#1a1a1a]" />
                      </div>
                      <div className="mt-2 h-2 w-12 bg-[#c8ff00]/10" />
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#c8ff00]/40" />
                    <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                      Email Branding
                    </p>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#666]">
                    Each pack has its own React Email shell. Full control over
                    headers, footers, typography, and colors.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 3: Four compact cards */}
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
              {/* Pause & Resume */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center border border-[#1a1a1a] bg-[#0a0a0a]">
                    <Pause className="h-3 w-3 text-[#c8ff00]/60" />
                  </div>
                  <div className="h-px flex-1 bg-[#1a1a1a]" />
                  <div className="flex h-7 w-7 items-center justify-center border border-[#1a1a1a] bg-[#0a0a0a]">
                    <Play className="h-3 w-3 text-[#c8ff00]/60" />
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                    Pause &amp; Resume
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#666]">
                    One click to pause, pick up exactly where they left off.
                  </p>
                </div>
              </div>

              {/* Subscriber Management */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="font-mono text-[11px] leading-[1.8] text-[#444]">
                  <span className="text-[#c8ff00]/40">→</span> update time
                  <br />
                  <span className="text-[#c8ff00]/40">→</span> change timezone
                  <br />
                  <span className="text-[#c8ff00]/40">→</span> unsubscribe
                </div>
                <div className="mt-auto pt-4">
                  <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                    Self-Serve Manage
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#666]">
                    Signed token links. No passwords, no accounts.
                  </p>
                </div>
              </div>

              {/* One-Click Unsubscribe */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#c8ff00]/40" />
                  <span className="font-mono text-[11px] text-[#444]">
                    CAN-SPAM · GDPR
                  </span>
                </div>
                <div className="mt-auto pt-4">
                  <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                    One-Click Unsub
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#666]">
                    Signed, cryptographically verified. Compliant out of the
                    box.
                  </p>
                </div>
              </div>

              {/* Pluggable Adapters */}
              <div className="flex flex-col bg-[#050505] p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <Plug className="h-4 w-4 text-[#c8ff00]/40" />
                  <div className="flex gap-1">
                    {["Postmark", "Resend", "…"].map((name) => (
                      <span
                        key={name}
                        className="border border-[#1a1a1a] bg-[#0a0a0a] px-1.5 py-0.5 font-mono text-[10px] text-[#555]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <p className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#c8ff00]">
                    Pluggable Adapters
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#666]">
                    Swap email providers with a single adapter. No vendor
                    lock-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-b border-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#444]">
            How It Works
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            From repo to running course in four steps.
          </h2>

          <HowItWorksSection />
        </div>
      </section>

      {/* ── Content Packs ── */}
      <section className="border-b border-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#444]">
            Content Packs
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            Markdown in, emails out.
          </h2>
          <p className="mt-3 max-w-xl font-mono text-base leading-relaxed text-[#555]">
            Write lessons in markdown. ContentDrip handles templating,
            rendering, and delivery.
          </p>

          {/* Visual pipeline */}
          <div className="mt-12 grid items-stretch gap-0 lg:grid-cols-[1fr_auto_1fr]">
            {/* Left: Markdown input */}
            <div className="border border-[#1a1a1a] bg-[#0a0a0a]">
              <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />
                </div>
                <span className="font-mono text-xs text-[#444]">day-1.md</span>
              </div>
              <pre className="p-5 font-mono text-[13px] leading-[1.8] text-[#555]">
                <code>
                  <span className="text-[#444]">---</span>
                  {"\n"}
                  <span className="text-[#666]">subject:</span>{" "}
                  <span className="text-[#888]">
                    {'"'}Day 1: Getting Started{'"'}
                  </span>
                  {"\n"}
                  <span className="text-[#666]">preview:</span>{" "}
                  <span className="text-[#888]">
                    {'"'}Your first lesson{'"'}
                  </span>
                  {"\n"}
                  <span className="text-[#444]">---</span>
                  {"\n\n"}
                  <span className="text-[#666]">Good morning!</span>
                  {"\n\n"}
                  <span className="text-[#666]">
                    Today we{`'`}re covering the
                  </span>
                  {"\n"}
                  <span className="text-[#666]">fundamentals of...</span>
                  {"\n\n"}
                  <span className="text-[#666]">## The Key Idea</span>
                  {"\n\n"}
                  <span className="text-[#666]">Content in **markdown**.</span>
                  {"\n\n"}
                  <span className="text-[#666]">[Read online →](</span>
                  <span className="text-[#c8ff00]">{"{{companionUrl}}"}</span>
                  <span className="text-[#666]">)</span>
                </code>
              </pre>
            </div>

            {/* Center: Pipeline connector */}
            <div className="flex items-center justify-center py-6 lg:px-6 lg:py-0">
              <div className="flex items-center gap-3 lg:flex-col lg:gap-4">
                {/* Arrow / chevrons */}
                <div className="flex gap-1 text-[#333] lg:flex-col">
                  <svg
                    className="h-5 w-5 rotate-90 lg:rotate-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                {/* Pipeline steps */}
                <div className="flex gap-2 lg:flex-col lg:gap-3">
                  {["parse frontmatter", "inject URLs", "render email"].map(
                    (step) => (
                      <div
                        key={step}
                        className="whitespace-nowrap border border-[#1a1a1a] bg-[#0a0a0a] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#444]"
                      >
                        {step}
                      </div>
                    ),
                  )}
                </div>

                {/* Arrow / chevrons */}
                <div className="flex gap-1 text-[#333] lg:flex-col">
                  <svg
                    className="h-5 w-5 rotate-90 lg:rotate-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Email output mockup */}
            <div className="border border-[#1a1a1a] bg-[#0a0a0a]">
              <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-2.5">
                <svg
                  className="h-4 w-4 text-[#333]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span className="font-mono text-xs text-[#444]">
                  Delivered email
                </span>
              </div>
              <div className="p-5">
                {/* Email header area */}
                <div className="mb-4 border-b border-[#1a1a1a] pb-4">
                  <div className="mb-2 h-5 w-24 bg-[#1a1a1a]" />
                  <p className="font-mono text-sm font-medium text-[#888]">
                    Day 1: Getting Started
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-[#444]">
                    Your first lesson
                  </p>
                </div>

                {/* Email body skeleton */}
                <div className="space-y-3">
                  <p className="font-mono text-[13px] leading-relaxed text-[#666]">
                    Good morning!
                  </p>
                  <p className="font-mono text-[13px] leading-relaxed text-[#555]">
                    Today we{`'`}re covering the fundamentals of...
                  </p>

                  {/* Section heading */}
                  <p className="mt-1 font-mono text-[13px] font-semibold text-[#777]">
                    The Key Idea
                  </p>

                  {/* Body skeleton lines */}
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-[#111]" />
                    <div className="h-2.5 w-4/5 bg-[#111]" />
                  </div>

                  {/* CTA button */}
                  <div className="pt-2">
                    <div className="inline-block border border-[#c8ff00] px-4 py-2 font-mono text-[12px] font-medium text-[#c8ff00]">
                      Read online →
                    </div>
                  </div>
                </div>

                {/* Footer area */}
                <div className="mt-5 border-t border-[#1a1a1a] pt-3">
                  <div className="flex gap-3 font-mono text-[10px] text-[#333]">
                    <span>Manage</span>
                    <span>·</span>
                    <span>Pause</span>
                    <span>·</span>
                    <span>Unsubscribe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template variables */}
          <div className="mt-6 grid gap-px bg-[#1a1a1a] p-px sm:grid-cols-2 lg:grid-cols-4">
            {[
              { var: "{{companionUrl}}", desc: "Web version of this lesson" },
              { var: "{{manageUrl}}", desc: "Manage subscription page" },
              { var: "{{pauseUrl}}", desc: "Pause delivery one-click" },
              { var: "{{stopUrl}}", desc: "Unsubscribe one-click" },
            ].map((v) => (
              <div key={v.var} className="bg-[#050505] p-4">
                <code className="font-mono text-[13px] text-[#c8ff00]">
                  {v.var}
                </code>
                <p className="mt-1 text-[13px] text-[#555]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="border-b border-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#444]">
            Stack
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            Tools you already know.
          </h2>

          <div className="mt-10 grid gap-px bg-[#1a1a1a] p-px sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((tech) => (
              <div key={tech.name} className="bg-[#050505] p-5">
                <p className="text-base font-bold tracking-tight">
                  {tech.name}
                </p>
                <p className="mt-1 font-mono text-[13px] text-[#555]">
                  {tech.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-b border-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Start building.
          </h2>
          <p className="mt-4 max-w-lg font-mono text-base leading-relaxed text-[#777]">
            Clone the repo, create a content pack in markdown, deploy to Vercel,
            and your subscribers start learning. The whole setup takes minutes,
            not weeks. Read the docs or explore the live demo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="group inline-flex h-9 items-center gap-2 bg-[#c8ff00] px-4 font-mono text-[13px] font-bold uppercase tracking-widest text-[#050505] no-underline transition-colors hover:bg-[#d8ff44]"
            >
              Read the Docs
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/mindful-productivity"
              className="inline-flex h-9 items-center border border-[#333] px-4 font-mono text-[13px] font-bold uppercase tracking-widest text-[#777] no-underline transition-colors hover:border-[#555] hover:text-[#e8e8e8]"
            >
              See a Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[13px] text-[#333]">
              Built by{" "}
              <a
                href="https://pego.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555] no-underline transition-colors hover:text-[#e8e8e8]"
              >
                Peter Gombos
              </a>
            </p>
            <nav className="flex items-center gap-5">
              <Link
                href="/docs"
                className="font-mono text-[13px] text-[#444] no-underline transition-colors hover:text-[#888]"
              >
                docs
              </Link>
              <Link
                href="/mindful-productivity"
                className="font-mono text-[13px] text-[#444] no-underline transition-colors hover:text-[#888]"
              >
                demo
              </Link>
              <a
                href="https://github.com/petergombos/content-drip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#444] no-underline transition-colors hover:text-[#888]"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://x.com/pepegombos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#444] no-underline transition-colors hover:text-[#888]"
                aria-label="X (Twitter)"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
