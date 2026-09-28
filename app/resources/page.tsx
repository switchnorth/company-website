import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Calculator,
  ClipboardList,
  ExternalLink,
  FileText,
} from "lucide-react";
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
import {
  getArticlesByCategory,
  resourceCategories,
} from "@/data/resources";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Resources",
  description:
    "Canadian immigration resources, general guides, FAQs, and tools from Switch North Immigration.",
  path: "/resources",
});

const featuredLinks = [
  {
    title: "CRS Calculator",
    description:
      "Estimate an Express Entry CRS score using centrally configured Government of Canada criteria.",
    href: "/tools/crs-calculator",
    icon: Calculator,
  },
  {
    title: "Free Assessment",
    description:
      "Share your background so Switch North can review possible immigration options and next steps.",
    href: "/assessment",
    icon: ClipboardList,
  },
  {
    title: "Immigration FAQ",
    description:
      "Browse common questions grouped by Express Entry, permanent residence, permits, sponsorship, and intake.",
    href: "/faq",
    icon: BookOpenText,
  },
];

const officialLinks = [
  {
    label: "Immigration and citizenship",
    href: "https://www.canada.ca/en/services/immigration-citizenship.html",
  },
  {
    label: "Express Entry",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
  },
  {
    label: "Study in Canada",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
  },
  {
    label: "Visitor visa",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Immigration resources for clearer planning."
        description="Use general guides, official links, FAQs, and tools to prepare for a more focused Canadian immigration conversation."
      />

      <Section containerClassName="grid gap-8">
        <Breadcrumbs items={[{ label: "Resources", href: "/resources" }]} />
        <div className="grid gap-5 md:grid-cols-3">
          {featuredLinks.map((resource) => {
            const Icon = resource.icon;

            return (
              <Link
                className="focus-ring group rounded-md"
                href={resource.href}
                key={resource.title}
              >
                <Card className="h-full hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-soft">
                  <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal transition group-hover:bg-brand-teal group-hover:text-white">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <CardHeader className="mt-5">
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-teal group-hover:text-accent-red">
                    Open resource
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by immigration topic."
          description="Categories are backed by structured data so future MDX or CMS content can reuse the same fields and layouts."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {resourceCategories.map((category) => {
            const count = getArticlesByCategory(category.slug).length;

            return (
              <a
                className="focus-ring rounded-md border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-soft"
                href={`#${category.slug}`}
                key={category.slug}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-deep-ink">{category.title}</h2>
                  <span className="rounded-md bg-brand-teal-soft px-2 py-1 text-xs font-semibold text-brand-teal">
                    {count}
                  </span>
                </div>
                <p className="mt-3 text-base leading-8 text-muted">
                  {category.description}
                </p>
              </a>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="General Guides"
          title="Planning resources organized by immigration topic."
          description="These pages provide general information, official source links, related services, and a structure that can support future reviewed articles."
        />
        <div className="mt-10 grid gap-12">
          {resourceCategories.map((category) => {
            const articles = getArticlesByCategory(category.slug);

            return (
              <section
                aria-labelledby={`${category.slug}-heading`}
                className="scroll-mt-28"
                id={category.slug}
                key={category.slug}
              >
                <div className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2
                      className="font-serif text-3xl leading-tight text-deep-ink"
                      id={`${category.slug}-heading`}
                    >
                      {category.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-base leading-8 text-muted">
                      {category.description}
                    </p>
                  </div>
                  <span className="text-base font-semibold text-brand-teal">
                    {articles.length} guides
                  </span>
                </div>
                {articles.length > 0 ? (
                  <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                      <Link
                        className="focus-ring group rounded-md"
                        href={`/resources/${article.slug}`}
                        key={article.slug}
                      >
                        <Card className="h-full hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-soft">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-accent-red">
                            <FileText aria-hidden="true" size={15} />
                            {article.generalGuide ? "General Guide" : "Article"}
                          </div>
                          <CardHeader className="mt-4">
                            <CardTitle>{article.title}</CardTitle>
                            <CardDescription>{article.description}</CardDescription>
                          </CardHeader>
                          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
                            <span>Updated {article.updatedAt}</span>
                            <span aria-hidden="true">/</span>
                            <span>{article.author}</span>
                          </div>
                          <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-teal group-hover:text-accent-red">
                            Read guide
                            <ArrowRight aria-hidden="true" size={16} />
                          </span>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="mt-6 bg-surface-soft">
                    <p className="text-base leading-8 text-muted">
                      No guides are currently assigned to this category.
                    </p>
                  </Card>
                )}
              </section>
            );
          })}
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <SectionHeading
            eyebrow="Official Sources"
            title="Confirm current requirements before making decisions."
            description="Switch North resource pages stay general. Official Government of Canada pages should be checked for current program instructions, forms, fees, and processing details."
          />
          <Card>
            <CardHeader>
              <CardTitle>Government of Canada links</CardTitle>
              <CardDescription>
                Useful starting points for current official immigration information.
              </CardDescription>
            </CardHeader>
            <div className="mt-5 grid gap-3">
              {officialLinks.map((link) => (
                <a
                  className="focus-ring inline-flex min-h-12 items-center justify-between gap-3 rounded-md border border-border px-4 py-3 text-base font-semibold text-deep-ink transition hover:border-brand-teal/40 hover:bg-brand-teal-soft hover:text-brand-teal"
                  href={link.href}
                  key={link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                  <ExternalLink aria-hidden="true" className="shrink-0" size={15} />
                </a>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <Card className="bg-brand-navy text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase text-brand-mint">
                Need personal guidance?
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
                Turn general reading into a focused next step.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/78">
                Articles can help you prepare, but immigration advice should be based
                on current requirements and your own facts.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
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
          </div>
        </Card>
      </Section>
    </>
  );
}
