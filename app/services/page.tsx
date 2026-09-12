import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Canadian immigration services for clear next steps."
        description="Explore high-level service areas for workers, students, families, visitors, permanent residence applicants, future citizens, employers, and business clients."
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
        <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Service Areas"
            title="Choose the area closest to your goal."
            description="These pages provide general, evergreen information. Current requirements should be confirmed through official sources or a consultation before taking action."
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.serviceCategories.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                href={`/services/${service.slug}`}
                className="focus-ring group rounded-md"
                key={service.slug}
              >
                <Card className="h-full hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-soft">
                  <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal transition group-hover:bg-brand-teal group-hover:text-white">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <CardHeader className="mt-5">
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-teal group-hover:text-accent-red">
                    Learn more
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
          <SectionHeading
            eyebrow="General Information"
            title="Immigration planning should be current and specific to you."
            description="Switch North avoids generic promises and success claims. Program details can change, so service pages stay high-level until your facts and current instructions are reviewed."
          />
          <Card>
            <CardHeader>
              <CardTitle>Need help choosing?</CardTitle>
              <CardDescription>
                Start with the free assessment route or contact the office to
                discuss which service area fits your goals.
              </CardDescription>
            </CardHeader>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href={siteConfig.bookingUrl}>
                {siteConfig.consultationCta}
              </ButtonLink>
              <ButtonLink href="/assessment" variant="outline">
                {siteConfig.secondaryCta}
              </ButtonLink>
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Express Entry Tool"
            title="Estimate a CRS score before your Express Entry conversation."
            description="The CRS calculator is informational and uses centrally reviewed Government of Canada criteria. IRCC determines the official score."
          />
          <Card>
            <div className="grid size-12 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
              <Calculator aria-hidden="true" size={24} />
            </div>
            <CardHeader className="mt-5">
              <CardTitle>CRS Calculator</CardTitle>
              <CardDescription>
                Review core factors, spouse factors, skill transferability, and
                additional points in one focused tool.
              </CardDescription>
            </CardHeader>
            <div className="mt-6">
              <ButtonLink href="/tools/crs-calculator">
                Open CRS Calculator
                <ArrowRight aria-hidden="true" size={18} />
              </ButtonLink>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
