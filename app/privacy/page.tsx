import type { Metadata } from "next";
import Link from "next/link";
import { RouteScaffold } from "@/components/sections/route-scaffold";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description:
    "Privacy information for contacting Switch North Immigration and using the website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <RouteScaffold
      eyebrow="Privacy"
      title="Privacy information for website visitors."
      description="This page explains the current V1 website intake approach while a formal privacy policy is prepared for review."
      breadcrumbs={[{ label: "Privacy", href: "/privacy" }]}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">Form information</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            Contact and assessment forms ask for information needed to understand
            the inquiry and respond with an appropriate next step. Do not send
            sensitive documents or government identification numbers through the
            website forms.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">Email workflow</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            Form submissions are sent by email to {siteConfig.businessName}. The
            website does not add assessment details to analytics and does not keep
            a permanent client database for V1 intake.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">Website data</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            Basic technical information may be processed by hosting, security,
            email, and analytics providers used to operate the site. Final vendor
            and retention details should be confirmed in the reviewed privacy
            policy.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-deep-ink">Questions</h2>
          <p className="mt-3 text-base leading-8 text-muted">
            For privacy questions, contact {" "}
            <a className="font-semibold text-brand-teal hover:text-accent-red" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            . The full privacy policy should be reviewed before launch as a final
            legal document.
          </p>
        </Card>
      </div>
      <p className="text-sm leading-7 text-muted">
        Website information is general information only. Submitting a form does
        not create a consultant-client relationship. See the {" "}
        <Link className="font-semibold text-brand-teal hover:text-accent-red" href="/terms">
          Terms
        </Link>{" "}
        page for related website-use notes.
      </p>
    </RouteScaffold>
  );
}
