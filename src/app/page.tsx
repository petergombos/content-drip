import type { Metadata } from "next";
import { SubscribeForm } from "@/components/subscribe-form";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import "@/content-packs";
import { Mail, BookOpen, Sparkles, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "The Art of Mindful Productivity — Free 5-Day Email Course",
  description:
    "Join thousands of professionals who've transformed their work habits. Get one actionable lesson delivered to your inbox each morning.",
};

/* ── Static data ── */

const COURSE_OUTLINE = [
  {
    day: "Welcome",
    title: "Welcome & What to Expect",
    description:
      "An overview of the course, what you'll learn, and how to get the most from each lesson.",
  },
  {
    day: "Day 1",
    title: "The Power of Single-Tasking",
    description:
      "Why doing one thing at a time isn't just more productive — it's more fulfilling.",
  },
  {
    day: "Day 2",
    title: "Designing Your Ideal Morning",
    description:
      "Create a morning routine that sets the tone for focused, intentional work.",
  },
  {
    day: "Day 3",
    title: "The Two-Minute Rule",
    description:
      "How small, immediate actions build unstoppable momentum throughout your day.",
  },
  {
    day: "Day 4",
    title: "Digital Minimalism",
    description:
      "Reclaim your attention by redesigning your relationship with technology.",
  },
  {
    day: "Day 5",
    title: "Building Sustainable Habits",
    description:
      "Turn five days of insights into a lasting productivity practice.",
  },
];

const FAQS = [
  {
    q: "Is this really free?",
    a: "Yes, completely free. No credit card required, no hidden upsells. Just five days of focused, actionable content delivered to your inbox.",
  },
  {
    q: "Can I pause my subscription?",
    a: "Absolutely. Every email includes a manage link where you can pause deliveries and resume whenever you're ready. Your progress is saved.",
  },
  {
    q: "How do I unsubscribe?",
    a: "One click. Every email has an unsubscribe link at the bottom. We also include a manage link so you can adjust your preferences instead.",
  },
  {
    q: "When will I receive emails?",
    a: "You choose your preferred delivery time when you sign up. Emails arrive at that time in your local timezone, every day for five days.",
  },
  {
    q: "What if I miss an email?",
    a: "Each email includes a \"view online\" link that takes you to a companion page with the full lesson. You'll never lose access to the content.",
  },
  {
    q: "Can I restart from the beginning?",
    a: "Yes! Simply unsubscribe and re-subscribe to start the course fresh from Day 1.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "This course changed how I approach my mornings. The single-tasking lesson alone was worth signing up for — I'm more focused than I've been in years.",
    name: "Sarah K.",
    role: "Product Designer",
  },
  {
    quote:
      "Simple, actionable, and perfectly paced. Each email gave me exactly one thing to implement that day. No overwhelm, just progress.",
    name: "Marcus R.",
    role: "Software Engineer",
  },
  {
    quote:
      "I've tried dozens of productivity systems. This is the first one that actually stuck — because it taught me habits, not hacks.",
    name: "Aisha M.",
    role: "Marketing Director",
  },
];

/* ── Page ── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b bg-linear-to-b from-amber-50/60 via-amber-50/20 to-background">
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 text-center md:pb-28 md:pt-32">
          <p className="text-sm font-medium uppercase tracking-widest text-primary no-underline">
            Free 5-Day Email Course
          </p>
          <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Master the Art of{" "}
            <span className="text-primary">Mindful Productivity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Join thousands of professionals who&apos;ve transformed their work
            habits. One actionable lesson delivered to your inbox each morning.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <Card className="p-6 shadow-lg shadow-amber-900/5">
              <SubscribeForm />
            </Card>
            <p className="mt-4 text-xs text-muted-foreground">
              No spam&ensp;·&ensp;Unsubscribe anytime&ensp;·&ensp;Free forever
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-b py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
            Three simple steps to better productivity habits.
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {(
              [
                {
                  icon: Mail,
                  title: "Subscribe",
                  desc: "Enter your email and choose when you'd like to receive your daily lesson.",
                },
                {
                  icon: BookOpen,
                  title: "Learn Daily",
                  desc: "Receive one focused, actionable lesson each morning — no fluff, no filler.",
                },
                {
                  icon: Sparkles,
                  title: "Transform",
                  desc: "Build lasting habits with insights you can apply immediately to your work.",
                },
              ] as const
            ).map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content Outline ── */}
      <section className="border-b bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold tracking-tight">
            What You&apos;ll Learn
          </h2>
          <p className="mt-3 text-muted-foreground">
            A carefully curated sequence of lessons, each building on the last.
          </p>

          <div className="mt-10 divide-y">
            {COURSE_OUTLINE.map((item, i) => (
              <div key={i} className="flex gap-4 py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i === 0 ? "✦" : i}
                </span>
                <div>
                  <h3 className="font-semibold leading-snug">
                    <span className="font-normal text-muted-foreground">
                      {item.day}:
                    </span>{" "}
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sneak Peek ── */}
      <section className="border-b py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold tracking-tight">
            A Sneak Peek
          </h2>
          <p className="mt-3 text-muted-foreground">
            Here&apos;s a taste of what lands in your inbox.
          </p>

          <Card className="mt-10 overflow-hidden">
            <div className="border-b bg-muted/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  MP
                </div>
                <div>
                  <p className="text-sm font-medium no-underline">
                    Mindful Productivity
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Day 1 — The Power of Single-Tasking
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Good morning! Today we&apos;re exploring one of the most
                counterintuitive truths about productivity:{" "}
                <strong className="text-foreground">
                  doing less leads to achieving more.
                </strong>
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/singletask/560/280"
                alt="A focused workspace with a single notebook"
                className="mt-5 w-full rounded-lg object-cover"
              />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                When we scatter our attention across five tasks, we don&apos;t
                get five things done — we get fragments of five things done, each
                poorly. Research from Stanford shows that heavy multitaskers are{" "}
                <strong className="text-foreground">
                  worse at filtering irrelevant information
                </strong>{" "}
                and slower at switching between tasks...
              </p>
              <p className="mt-6 text-sm font-medium text-primary no-underline">
                Continue reading in your inbox&ensp;→
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 divide-y">
            {FAQS.map((faq, i) => (
              <details key={i} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium no-underline">
                  {faq.q}
                  <ChevronDown className="ml-4 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-b py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold tracking-tight">
            What People Are Saying
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="flex flex-col p-6">
                <div className="flex gap-0.5 text-primary">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-stone-950 py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-50">
            Ready to Transform Your Productivity?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-400">
            Start your free 5-day course today. One email a day, at the time you
            choose. No spam, no nonsense.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <Card className="p-6 ring-1 ring-white/10">
              <SubscribeForm />
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
