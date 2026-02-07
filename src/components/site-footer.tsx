import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-lg font-semibold no-underline text-foreground"
            >
              ContentDrip
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thoughtful content delivered at your pace. Subscribe, learn, grow
              — one email at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold">Links</p>
            <ul className="mt-3 list-none space-y-2 p-0">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground no-underline hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/manage"
                  className="text-sm text-muted-foreground no-underline hover:text-foreground"
                >
                  Manage Subscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm font-semibold">Details</p>
            <ul className="mt-3 list-none space-y-2 p-0">
              <li className="text-sm text-muted-foreground">Free forever</li>
              <li className="text-sm text-muted-foreground">
                Pause or cancel anytime
              </li>
              <li className="text-sm text-muted-foreground">
                One-click unsubscribe
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ContentDrip. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
