import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-start justify-center py-20">
      <p className="text-sm font-semibold uppercase text-accent-red">404</p>
      <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight text-deep-ink md:text-6xl">
        This page has moved north without us.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
        The page you are looking for is not available. Start from the homepage
        or contact the office for help.
      </p>
      <ButtonLink href="/" className="mt-8">
        <ArrowLeft aria-hidden="true" size={18} />
        Back to home
      </ButtonLink>
    </section>
  );
}
