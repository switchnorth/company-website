import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Languages,
  MessageSquareText,
  ShieldCheck,
  UserRoundCheck,
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
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Switch North Immigration, a Canadian immigration consulting practice focused on clear planning, organized applications, and client-centred guidance.",
  path: "/about",
});

const values = [
  {
    title: "Personalized planning",
    description:
      "Immigration goals are personal. The approach starts with your facts, priorities, family needs, and practical constraints.",
    icon: UserRoundCheck,
  },
  {
    title: "Clear communication",
    description:
      "Clients should understand what is being prepared, why it matters, and what information is still needed.",
    icon: MessageSquareText,
  },
  {
    title: "Organized documents",
    description:
      "Applications are easier to manage when forms, evidence, timelines, and follow-up items are tracked carefully.",
    icon: FileCheck2,
  },
  {
    title: "Responsible guidance",
    description:
      "The site avoids guarantees and keeps program information high-level until current requirements and individual facts are reviewed.",
    icon: ShieldCheck,
  },
];

const workSteps = [
  "Start with your immigration goal, current status, and key personal details.",
  "Discuss possible pathways at a high level and identify information gaps.",
  "Build a practical document plan for the service area being considered.",
  "Keep next steps, updates, and follow-up communication organized.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`A clearer, more personal way to plan immigration with ${siteConfig.businessName}.`}
        description="Switch North Immigration supports individuals, families, students, workers, employers, and business clients with careful Canadian immigration planning and application preparation."
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
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="grid gap-6">
            <SectionHeading
              eyebrow="Firm Introduction"
              title="Built around careful guidance, not generic promises."
              description={`${siteConfig.businessName} is a Canadian immigration consulting practice for people who want a calm, structured process before making important immigration decisions.`}
            />
            <div className="grid gap-5 text-base leading-8 text-muted">
              <p>
                The firm helps clients understand their options, organize
                supporting documents, and move through immigration steps with
                realistic expectations. The focus is practical: clear facts,
                strong preparation, and communication that makes the process easier
                to follow.
              </p>
              <p>
                Canadian immigration programs can change, and every situation has
                its own details. Switch North keeps website information general and
                encourages clients to verify current requirements before relying on
                any pathway.
              </p>
            </div>
          </div>

          <Card className="bg-brand-navy text-white">
            <CardHeader>
              <CardTitle className="text-white">Mission</CardTitle>
              <CardDescription className="text-white/78">
                Help clients make informed immigration decisions through clear
                strategy, organized preparation, and responsible guidance.
              </CardDescription>
            </CardHeader>
            <div className="mt-6 border-t border-white/15 pt-6">
              <p className="text-[15px] font-semibold uppercase text-brand-mint">Approach</p>
              <p className="mt-3 text-base leading-8 text-white/78">
                The work is centred on understanding your circumstances, explaining
                the process plainly, and preparing applications with attention to
                consistency and detail.
              </p>
            </div>
          </Card>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading
          eyebrow="Values"
          title="Client-focused immigration support."
          description="Trust is built through transparency, organization, and careful handling of personal information and immigration goals."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <Card key={value.title} className="h-full">
                <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                  <Icon aria-hidden="true" size={22} />
                </div>
                <CardHeader className="mt-5">
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Card>
            <div className="grid size-12 place-items-center rounded-md bg-accent-red-soft text-accent-red">
              <UserRoundCheck aria-hidden="true" size={24} />
            </div>
            <CardHeader className="mt-5">
              <CardTitle>{siteConfig.consultantName}</CardTitle>
              <CardDescription>{siteConfig.consultantTitle}</CardDescription>
            </CardHeader>
            <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-base leading-8">
              <div>
                <dt className="font-semibold text-deep-ink">
                  Credential confirmation
                </dt>
                <dd className="text-muted">
                  Professional credentials should be confirmed directly with the
                  consultant and the appropriate regulator before retaining services.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-deep-ink">Service approach</dt>
                <dd className="text-muted">
                  Consultations and application support are based on individual facts,
                  current requirements, and careful document review.
                </dd>
              </div>
            </dl>
          </Card>

          <div className="grid gap-8">
            <SectionHeading
              eyebrow="How The Firm Works"
              title="A straightforward process for complex decisions."
              description="The working style is structured enough to keep details under control, while still leaving room for the realities of each client situation."
            />
            <ol className="grid gap-4">
              {workSteps.map((step, index) => (
                <li className="flex gap-4" key={step}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-teal text-base font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 text-base leading-8 text-muted">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Languages"
              title="Support in the languages currently listed for the practice."
              description="Please mention your preferred language when contacting the office so the next step can be planned appropriately."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {siteConfig.languages.map((language) => (
                <span
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-white px-4 py-2.5 text-base font-semibold text-deep-ink"
                  key={language}
                >
                  <Languages aria-hidden="true" size={16} />
                  {language}
                </span>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service overview</CardTitle>
              <CardDescription>
                Switch North supports common Canadian immigration goals with
                high-level, current-review-aware service pages.
              </CardDescription>
            </CardHeader>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {siteConfig.serviceCategories.map((service) => (
                <Link
                  className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-md border border-border bg-white px-4 py-3 text-base font-semibold text-deep-ink transition hover:border-brand-teal/40 hover:bg-brand-teal-soft hover:text-brand-teal"
                  href={`/services/${service.slug}`}
                  key={service.slug}
                >
                  <CheckCircle2 aria-hidden="true" className="shrink-0 text-brand-teal" size={16} />
                  {service.title}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Cta
        title="Talk through your Canadian immigration goals."
        description="Book a consultation to discuss your goals, or start with the free assessment so the next conversation has useful context."
        primaryHref={siteConfig.bookingUrl}
        primaryLabel={siteConfig.consultationCta}
        secondaryHref="/assessment"
        secondaryLabel={siteConfig.secondaryCta}
      />
    </>
  );
}
