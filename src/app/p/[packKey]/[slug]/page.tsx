import { DemoBanner } from "@/components/demo-banner";
import { ExampleSiteFooter } from "@/components/example-site-footer";
import { ExampleSiteHeader } from "@/components/example-site-header";
import "@/content-packs";
import { getPackByKey } from "@/content-packs/registry";
import { renderMarkdownToReact } from "@/lib/markdown/renderer";
import { readFileSync } from "fs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { join } from "path";

interface CompanionPageProps {
  params: Promise<{ packKey: string; slug: string }>;
}

export default async function CompanionPage({ params }: CompanionPageProps) {
  const { packKey, slug } = await params;

  const pack = getPackByKey(packKey);
  if (!pack) return notFound();

  const stepIndex = pack.steps.findIndex((s) => s.slug === slug);
  const step = stepIndex >= 0 ? pack.steps[stepIndex] : undefined;
  if (!step) return notFound();

  const pageFile = step.pageFile ?? step.emailFile;
  const pagePath = join(
    process.cwd(),
    "src/content-packs",
    packKey,
    "pages",
    pageFile,
  );

  let markdown: string;
  try {
    markdown = readFileSync(pagePath, "utf-8");
  } catch {
    return notFound();
  }

  const content = renderMarkdownToReact(markdown);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DemoBanner />
      <ExampleSiteHeader />

      {/* Course header band */}
      <div className="border-b bg-warm-subtle">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                {pack.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Lesson {stepIndex + 1} of {pack.steps.length}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {pack.steps.map((s, i) => (
                <div
                  key={s.slug}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIndex
                      ? "w-4 bg-primary"
                      : i < stepIndex
                        ? "w-1.5 bg-primary/40"
                        : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <main className="flex-1">
        <article
          className="mx-auto max-w-3xl px-6 py-12 md:py-16"
          data-testid="companion-article"
        >
          <div className="prose-reading animate-fade-in-up">{content}</div>
        </article>

        {/* Sign-up CTA */}
        <div className="border-t bg-warm-subtle">
          <div className="mx-auto max-w-3xl px-6 py-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
              Enjoying this?
            </p>
            <p className="mt-2 text-base text-foreground text-balance">
              This is lesson {stepIndex + 1} of {pack.steps.length} in{" "}
              <span className="font-medium">{pack.name}</span>. Sign up to get
              the full course delivered to your inbox.
            </p>
            <Link
              href={`/${packKey}`}
              className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
            >
              Start the course &rarr;
            </Link>
          </div>
        </div>
      </main>

      <ExampleSiteFooter />
    </div>
  );
}
