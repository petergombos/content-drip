import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell(props: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1000px_circle_at_20%_10%,hsl(var(--quietly-warm)/0.35),transparent_60%),radial-gradient(900px_circle_at_80%_0%,hsl(var(--quietly-olive)/0.18),transparent_55%)]" />

      <SiteHeader action={props.headerAction} />

      <main className={cn("mx-auto w-full max-w-3xl px-4 pb-16 pt-10", props.className)}>
        {(props.title || props.subtitle) && (
          <header className="mb-8">
            {props.title && (
              <h1 className="font-serif text-3xl tracking-tight md:text-4xl">
                {props.title}
              </h1>
            )}
            {props.subtitle && (
              <p className="mt-2 max-w-prose text-muted-foreground">
                {props.subtitle}
              </p>
            )}
          </header>
        )}

        {props.children}

        <div className="mt-10 text-sm text-muted-foreground">
          <Link href="/manage" className="underline underline-offset-4 hover:text-foreground">
            Manage subscription
          </Link>
          <span className="mx-2">·</span>
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            Home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
