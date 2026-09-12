import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
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
import { faqGroups } from "@/data/faqs";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Immigration FAQ",
  description:
    "Common Canadian immigration questions grouped by topic, with general answers from Switch North Immigration.",
  path: "/faq",
});

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.questions.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    ),
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <PageHeader
        eyebrow="FAQ"
        title="Canadian immigration questions, organized by topic."
        description="These answers are general information only. Current requirements should be confirmed through official sources or a consultation before making immigration decisions."
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
        <Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="grid gap-4 lg:sticky lg:top-24">
            <Card>
              <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                <HelpCircle aria-hidden="true" size={22} />
              </div>
              <CardHeader className="mt-5">
                <CardTitle>Browse topics</CardTitle>
                <CardDescription>
                  Jump to the question group closest to your current planning stage.
                </CardDescription>
              </CardHeader>
              <nav aria-label="FAQ categories" className="mt-5 grid gap-2">
                {faqGroups.map((group) => (
                  <a
                    className="focus-ring rounded-md px-4 py-3 text-base font-semibold text-deep-ink transition hover:bg-brand-teal-soft hover:text-brand-teal"
                    href={`#${group.slug}`}
                    key={group.slug}
                  >
                    {group.category}
                  </a>
                ))}
              </nav>
            </Card>
          </aside>

          <div className="grid gap-10">
            {faqGroups.map((group) => (
              <section
                className="scroll-mt-28"
                id={group.slug}
                key={group.slug}
              >
                <SectionHeading title={group.category} />
                <div className="mt-6 grid gap-4">
                  {group.questions.map((item) => (
                    <Card key={item.question}>
                      <h3 className="text-lg font-semibold leading-7 text-deep-ink">
                        {item.question}
                      </h3>
                      <p className="mt-3 text-base leading-8 text-muted">
                        {item.answer}
                      </p>
                      {item.relatedHref ? (
                        <Link
                          className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-brand-teal hover:text-accent-red"
                          href={item.relatedHref}
                        >
                          Related page
                          <ArrowRight aria-hidden="true" size={16} />
                        </Link>
                      ) : null}
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
