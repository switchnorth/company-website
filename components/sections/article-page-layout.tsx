import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, Info } from "lucide-react";
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
import { getResourceCategory, resourceArticles } from "@/data/resources";
import type { ArticleBlock, ResourceArticle } from "@/types/resources";

function ArticleBlockRenderer({ block }: { block: ArticleBlock }) {
  if (block.type === "paragraph") {
    return <p className="text-base leading-7 text-muted">{block.text}</p>;
  }

  if (block.type === "list") {
    return (
      <div>
        {block.title ? (
          <h2 className="text-lg font-semibold leading-7 text-deep-ink">{block.title}</h2>
        ) : null}
        <ul className="mt-4 grid gap-3">
          {block.items.map((item) => (
            <li className="flex gap-3 text-base leading-7 text-muted" key={item}>
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-accent-red" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <aside className="rounded-md border border-brand-teal/20 bg-brand-teal-soft p-5">
      <div className="flex gap-3">
        <Info aria-hidden="true" className="mt-1 shrink-0 text-brand-teal" size={18} />
        <div>
          <h2 className="font-semibold text-brand-teal">{block.title}</h2>
          <p className="mt-2 text-base leading-7 text-muted">{block.text}</p>
        </div>
      </div>
    </aside>
  );
}

export function ArticlePageLayout({ article }: { article: ResourceArticle }) {
  const category = getResourceCategory(article.category);
  const relatedArticles = resourceArticles
    .filter(
      (resourceArticle) =>
        resourceArticle.category === article.category &&
        resourceArticle.slug !== article.slug,
    )
    .slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={article.sample ? "Sample Article" : category?.title}
        title={article.title}
        description={article.description}
      >
        <div className="flex flex-wrap gap-3 text-base text-muted">
          <span>Published {article.publishedAt}</span>
          <span aria-hidden="true">/</span>
          <span>Updated {article.updatedAt}</span>
          <span aria-hidden="true">/</span>
          <span>By {article.author}</span>
        </div>
      </PageHeader>

      <Section containerClassName="grid gap-8">
        <Breadcrumbs
          items={[
            { label: "Resources", href: "/resources" },
            {
              label: category?.title ?? "Article",
              href: `/resources#${article.category}`,
            },
            { label: article.title, href: `/resources/${article.slug}` },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          <article className="grid gap-7">
            {article.sample ? (
              <Card className="border-accent-red/20 bg-accent-red-soft">
                <p className="text-sm font-semibold uppercase text-accent-red">
                  Sample content
                </p>
                <p className="mt-3 text-base leading-7 text-muted">
                  This resource demonstrates the article design and content
                  architecture. It must be reviewed and replaced or approved before
                  production.
                </p>
              </Card>
            ) : null}

            {article.content.map((block, index) => (
              <ArticleBlockRenderer block={block} key={`${block.type}-${index}`} />
            ))}
          </article>

          <aside className="grid gap-5 lg:sticky lg:top-24">
            <Card>
              <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                <ExternalLink aria-hidden="true" size={22} />
              </div>
              <CardHeader className="mt-5">
                <CardTitle>Official resources</CardTitle>
                <CardDescription>
                  Confirm current instructions with Government of Canada sources.
                </CardDescription>
              </CardHeader>
              <div className="mt-5 grid gap-3">
                {article.officialLinks.map((link) => (
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

            <Card>
              <div className="grid size-11 place-items-center rounded-md bg-accent-red-soft text-accent-red">
                <FileText aria-hidden="true" size={22} />
              </div>
              <CardHeader className="mt-5">
                <CardTitle>Related services</CardTitle>
                <CardDescription>
                  Continue from this article into the relevant service or intake page.
                </CardDescription>
              </CardHeader>
              <div className="mt-5 grid gap-3">
                {article.relatedServices.map((item) => (
                  <ButtonLink
                    className="justify-start"
                    href={item.href}
                    key={item.href}
                    variant="outline"
                  >
                    {item.label}
                    <ArrowRight aria-hidden="true" size={16} />
                  </ButtonLink>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </Section>

      {relatedArticles.length > 0 ? (
        <Section tone="soft">
          <SectionHeading
            eyebrow="Related Reading"
            title="More from this category."
            description="Use these sample resources as starting points for reviewed article content later."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <Link
                className="focus-ring group rounded-md"
                href={`/resources/${relatedArticle.slug}`}
                key={relatedArticle.slug}
              >
                <Card className="h-full hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-soft">
                  <CardHeader>
                    <CardTitle>{relatedArticle.title}</CardTitle>
                    <CardDescription>{relatedArticle.description}</CardDescription>
                  </CardHeader>
                  <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-teal group-hover:text-accent-red">
                    Read article
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
