import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
        >
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
            ContentDrip
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/manage"
            className="text-sm text-muted-foreground no-underline hover:text-foreground transition-colors"
          >
            Manage
          </Link>
        </nav>
      </div>
    </header>
  );
}
