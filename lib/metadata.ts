import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
};

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "",
}: MetadataInput = {}): Metadata {
  const url = `${siteConfig.domain}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title
        ? `${title} | ${siteConfig.businessName}`
        : siteConfig.businessName,
      description,
      url,
      siteName: siteConfig.businessName,
      images: [
        {
          url: "/images/consultation-hero.png",
          width: 1792,
          height: 1024,
          alt: "Modern Canadian immigration consultation setting",
        },
      ],
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title
        ? `${title} | ${siteConfig.businessName}`
        : siteConfig.businessName,
      description,
      images: ["/images/consultation-hero.png"],
    },
  };
}
