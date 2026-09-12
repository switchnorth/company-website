import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { Cta } from "@/components/sections/cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/data/site";
import { getServiceEnhancement } from "@/data/service-enhancements";
import type { ServiceCategory } from "@/types/site";

type ServicePageLayoutProps = {
  service: ServiceCategory;
  relatedServices: ServiceCategory[];
};

export function ServicePageLayout({
  service,
  relatedServices,
}: ServicePageLayoutProps) {
  const Icon = service.icon;
  const enhancement = getServiceEnhancement(service.slug);
  const hasSplitGuidance = Boolean(
    enhancement?.commonSituations?.length || enhancement?.questionsToPrepare?.length,
  );

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={service.title}
        description={service.description}
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
            { label: "Services", href: "/services" },
            { label: service.title, href: `/services/${service.slug}` },
          ]}
        />
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <aside className="grid gap-5">
            <Card>
              <div className="grid size-12 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                <Icon aria-hidden="true" size={24} />
              </div>
              <CardHeader className="mt-5">
                <CardTitle>Who this may be for</CardTitle>
              </CardHeader>
              <ul className="mt-5 grid gap-3">
                {service.audience.map((item) => (
                  <li className="flex gap-3 text-[15px] leading-7 text-muted" key={item}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-brand-teal"
                      size={18}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="bg-brand-navy text-white">
              <CardHeader>
                <CardTitle className="text-white">Talk through your options</CardTitle>
                <CardDescription className="text-white/76">
                  Get high-level guidance based on your situation before making
                  decisions or preparing documents.
                </CardDescription>
              </CardHeader>
              <div className="mt-5 flex flex-col gap-3">
                <ButtonLink href={siteConfig.bookingUrl} variant="light">
                  {siteConfig.consultationCta}
                </ButtonLink>
                <ButtonLink
                  href="/assessment"
                  variant="outlineOnDark"
                >
                  {siteConfig.secondaryCta}
                </ButtonLink>
              </div>
            </Card>
            {enhancement?.officialResources?.length ? (
              <Card>
                <div className="grid size-12 place-items-center rounded-md bg-brand-mint-soft text-brand-teal">
                  <ExternalLink aria-hidden="true" size={23} />
                </div>
                <CardHeader className="mt-5">
                  <CardTitle>Official resources</CardTitle>
                  <CardDescription>
                    Confirm current instructions directly with Government of Canada
                    sources before acting.
                  </CardDescription>
                </CardHeader>
                <div className="mt-5 grid gap-3">
                  {enhancement.officialResources.map((resource) => (
                    <a
                      className="focus-ring inline-flex min-h-12 items-center justify-between gap-3 rounded-md border border-border px-4 py-3 text-base font-semibold text-deep-ink transition hover:border-brand-teal/40 hover:bg-brand-teal-soft hover:text-brand-teal"
                      href={resource.href}
                      key={resource.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {resource.label}
                      <ExternalLink
                        aria-hidden="true"
                        className="shrink-0"
                        size={16}
                      />
                    </a>
                  ))}
                </div>
              </Card>
            ) : null}
          </aside>

          <div className="grid gap-8">
            <Card>
              <SectionHeading
                eyebrow="Overview"
                title={`About ${service.title}`}
                description={service.overview}
              />
            </Card>

            {hasSplitGuidance ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {enhancement?.commonSituations?.length ? (
                  <section className="rounded-md border border-border bg-white p-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                        <HelpCircle aria-hidden="true" size={20} />
                      </span>
                      <h2 className="text-lg font-semibold leading-7 text-deep-ink">
                        Common situations
                      </h2>
                    </div>
                    <ul className="mt-5 grid gap-3">
                      {enhancement.commonSituations.map((item) => (
                        <li className="flex gap-3 text-[15px] leading-7 text-muted" key={item}>
                          <span className="mt-3 size-1.5 shrink-0 rounded-full bg-brand-teal" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {enhancement?.questionsToPrepare?.length ? (
                  <section className="rounded-md border border-border bg-surface-soft p-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-md bg-white text-accent-red ring-1 ring-border">
                        <HelpCircle aria-hidden="true" size={20} />
                      </span>
                      <h2 className="text-lg font-semibold leading-7 text-deep-ink">
                        Questions to prepare
                      </h2>
                    </div>
                    <ul className="mt-5 grid gap-3">
                      {enhancement.questionsToPrepare.map((item) => (
                        <li className="flex gap-3 text-[15px] leading-7 text-muted" key={item}>
                          <CircleAlert
                            aria-hidden="true"
                            className="mt-1 shrink-0 text-accent-red"
                            size={18}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            ) : null}

            <Card>
              <SectionHeading
                eyebrow="Process"
                title="A practical, organized approach."
                description="The process is intentionally clear and adaptable. Specific requirements should always be confirmed before filing."
              />
              <ol className="mt-8 grid gap-4">
                {service.process.map((step, index) => (
                  <li className="flex gap-4" key={step}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-teal text-base font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-0.5 text-[15px] leading-7 text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </Card>

            {enhancement?.helpfulChecklist?.length ? (
              <section className="rounded-md border border-brand-teal/20 bg-brand-teal-soft p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md bg-white text-brand-teal ring-1 ring-brand-teal/15">
                    <ListChecks aria-hidden="true" size={20} />
                  </span>
                  <h2 className="text-lg font-semibold leading-7 text-deep-ink">
                    Helpful checklist
                  </h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {enhancement.helpfulChecklist.map((item) => (
                    <div className="flex gap-3 text-[15px] leading-7 text-muted" key={item}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-brand-teal"
                        size={18}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <Card>
              <SectionHeading
                eyebrow="Considerations"
                title="Important points to keep in mind."
              />
              <ul className="mt-8 grid gap-4">
                {service.considerations.map((item) => (
                  <li className="flex gap-3 text-[15px] leading-7 text-muted" key={item}>
                    <CircleAlert
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-accent-red"
                      size={18}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {relatedServices.length > 0 ? (
              <Card>
                <SectionHeading
                  eyebrow="Related Services"
                  title="You may also want to explore."
                />
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {relatedServices.map((related) => {
                    const RelatedIcon = related.icon;

                    return (
                      <ButtonLink
                        href={`/services/${related.slug}`}
                        key={related.slug}
                        variant="outline"
                        className="justify-start"
                      >
                        <RelatedIcon aria-hidden="true" size={18} />
                        {related.title}
                      </ButtonLink>
                    );
                  })}
                </div>
              </Card>
            ) : null}

            {service.slug === "express-entry" ? (
              <Card className="bg-surface-soft">
                <div className="grid size-12 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                  <Calculator aria-hidden="true" size={24} />
                </div>
                <CardHeader className="mt-5">
                  <CardTitle>Estimate your CRS score</CardTitle>
                  <CardDescription>
                    Use the CRS calculator as an informational planning tool before
                    discussing your Express Entry profile.
                  </CardDescription>
                </CardHeader>
                <div className="mt-6">
                  <ButtonLink href="/tools/crs-calculator">
                    Open CRS Calculator
                    <ArrowRight aria-hidden="true" size={18} />
                  </ButtonLink>
                </div>
              </Card>
            ) : null}

            <Card className="bg-surface-soft">
              <p className="text-sm font-semibold uppercase text-accent-red">
                General Information
              </p>
              <p className="mt-3 text-[15px] leading-7 text-muted">
                Information on this page is general and evergreen. It is not a
                substitute for advice based on your circumstances. Immigration
                programs, forms, instructions, and requirements can change. No
                outcome is guaranteed.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Cta
        title={`Discuss ${service.title.toLowerCase()} with Switch North.`}
        description="Book a consultation to discuss this service area, or start with the free assessment if you are still gathering your background information."
        primaryHref={siteConfig.bookingUrl}
        primaryLabel={siteConfig.consultationCta}
        secondaryHref="/assessment"
        secondaryLabel={siteConfig.secondaryCta}
      />
    </>
  );
}
