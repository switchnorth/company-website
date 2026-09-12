import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePageLayout } from "@/components/sections/article-page-layout";
import { getResourceArticle, getResourceCategory, resourceArticles } from "@/data/resources";
import { siteConfig } from "@/data/site";

type ResourceArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return resourceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ResourceArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);

  if (!article) {
    return {};
  }

  const url = `${siteConfig.domain}/resources/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${article.title} | ${siteConfig.businessName}`,
      description: article.description,
      url,
      siteName: siteConfig.businessName,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: [
        {
          url: "/images/consultation-hero.png",
          width: 1792,
          height: 1024,
          alt: "Canadian immigration consultation setting",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | ${siteConfig.businessName}`,
      description: article.description,
      images: ["/images/consultation-hero.png"],
    },
  };
}

export default async function ResourceArticlePage({
  params,
}: ResourceArticlePageProps) {
  const { slug } = await params;
  const article = getResourceArticle(slug);

  if (!article) {
    notFound();
  }

  const category = getResourceCategory(article.category);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: siteConfig.domain,
    },
    mainEntityOfPage: `${siteConfig.domain}/resources/${article.slug}`,
    articleSection: category?.title,
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <ArticlePageLayout article={article} />
    </>
  );
}
