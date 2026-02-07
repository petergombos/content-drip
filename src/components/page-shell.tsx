import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell(props: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main
        className={cn(
          "mx-auto w-full max-w-3xl flex-1 px-4 py-10",
          props.className
        )}
      >
        {(props.title || props.subtitle) && (
          <header className="mb-8">
            {props.title && (
              <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
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
      </main>

      <SiteFooter />
    </div>
  );
}
