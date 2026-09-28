import type { Metadata } from "next";
import Link from "next/link";
import { RouteScaffold } from "@/components/sections/route-scaffold";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms",
  description:
    "Website terms and general information disclaimer for Switch North Immigration.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <RouteScaffold
      eyebrow="Terms"
      title="Website terms and disclaimer."
      description="These V1 website terms summarize the general-information nature of the site while final legal terms are prepared for review."
      breadcrumbs={[{ label: "Terms", href: "/terms" }]}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">General information</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            Website content is provided for general planning information. It is not
            legal advice, immigration advice for your specific facts, or a
            substitute for current Government of Canada instructions.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">No guarantees</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            Immigration outcomes, invitations, processing timelines, and decisions
            are never guaranteed. Official decisions are made by the responsible
            government authority.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">No relationship from browsing</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            Visiting the site, using tools, or submitting a form does not by itself
            create a consultant-client relationship. Any professional engagement
            requires later review and agreement.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">Current requirements</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            Immigration programs can change. Confirm requirements through official
            sources or a consultation before making decisions based on website
            content.
          </p>
        </Card>
      </div>
      <p className="text-sm leading-7 text-muted">
        Questions about these terms can be sent to {" "}
        <a className="font-semibold text-brand-teal hover:text-accent-red" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        . Review the {" "}
        <Link className="font-semibold text-brand-teal hover:text-accent-red" href="/privacy">
          Privacy
        </Link>{" "}
        page for website intake and privacy notes.
      </p>
    </RouteScaffold>
  );
}
