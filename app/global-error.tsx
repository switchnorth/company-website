"use client";

import { Button, ButtonLink } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-CA">
      <body>
        <main className="grid min-h-screen place-items-center bg-background px-6 text-deep-ink">
          <section className="max-w-xl rounded-md border border-border bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase text-accent-red">Error</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight">
              Something went wrong.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              The page could not be loaded. Try again or return to the homepage.
            </p>
            {error.digest ? (
              <p className="mt-3 text-xs text-muted">Reference: {error.digest}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={reset} type="button" size="sm">
                Try again
              </Button>
              <ButtonLink href="/" variant="outline" size="sm">
                Home
              </ButtonLink>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
