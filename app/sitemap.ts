import type { MetadataRoute } from "next";
import { resourceArticles } from "@/data/resources";
import { siteConfig } from "@/data/site";

const routes = [
  "",
  "/about",
  "/services",
  "/assessment",
  "/consultation",
  "/resources",
  "/faq",
  "/tools/crs-calculator",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...routes.map((route) => ({
      url: `${siteConfig.domain}${route}`,
      lastModified: now,
    })),
    ...siteConfig.serviceCategories.map((service) => ({
      url: `${siteConfig.domain}/services/${service.slug}`,
      lastModified: now,
    })),
    ...resourceArticles.map((article) => ({
      url: `${siteConfig.domain}/resources/${article.slug}`,
      lastModified: new Date(article.updatedAt),
    })),
  ];
}
