import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CrsCalculator } from "@/components/sections/crs-calculator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { crsRules } from "@/data/crs-rules";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "CRS Calculator",
  description:
    "Estimate your Express Entry Comprehensive Ranking System score with a CRS calculator based on reviewed Government of Canada criteria.",
  path: "/tools/crs-calculator",
});

export default function CrsCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="CRS Calculator"
        title="Estimate your Express Entry CRS score."
        description={`Use this informational calculator to estimate your Comprehensive Ranking System score. Rules last reviewed ${crsRules.lastReviewed}; IRCC determines the official score.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={siteConfig.bookingUrl}>
            {siteConfig.consultationCta}
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
          <ButtonLink href="/assessment" variant="outline">
            {siteConfig.secondaryCta}
          </ButtonLink>
        </div>
      </PageHeader>

      <Section containerClassName="grid gap-8">
        <Breadcrumbs
          items={[
            { label: "Resources", href: "/resources" },
            { label: "CRS Calculator", href: "/tools/crs-calculator" },
          ]}
        />
        <CrsCalculator />
      </Section>
    </>
  );
}
