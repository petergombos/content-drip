import Link from "next/link";

/**
 * Footer for the example content pack pages.
 * Uses the imaginary "Learnwise" brand and links to both courses.
 */
export function ExampleSiteFooter() {
  return (
    <footer className="border-t bg-warm-subtle">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/mindful-productivity"
              className="group inline-flex items-center gap-2 font-serif text-lg font-semibold no-underline text-foreground"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                L
              </span>
              Learnwise
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Email courses for people who want to learn without the overwhelm.
              One focused lesson at a time, delivered at your pace.
            </p>
          </div>

          {/* Courses */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
              Courses
            </p>
            <ul className="mt-4 list-none space-y-2.5 p-0">
              <li>
                <Link
                  href="/mindful-productivity"
                  className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  Mindful Productivity
                </Link>
              </li>
              <li>
                <Link
                  href="/deep-work"
                  className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  Deep Work Essentials
                </Link>
              </li>
              <li>
                <Link
                  href="/manage"
                  className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  Manage Subscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Promise */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
              Our Promise
            </p>
            <ul className="mt-4 list-none space-y-2.5 p-0">
              <li className="text-sm text-muted-foreground">
                Free forever, no catch
              </li>
              <li className="text-sm text-muted-foreground">
                Pause or cancel anytime
              </li>
              <li className="text-sm text-muted-foreground">
                One-click unsubscribe
              </li>
              <li className="text-sm text-muted-foreground">
                No spam, no selling your data
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Learnwise. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Made with care. Delivered with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
