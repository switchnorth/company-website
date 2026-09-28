import type { NavigationItem } from "@/types/site";

export type ResourceCategorySlug =
  | "express-entry"
  | "permanent-residence"
  | "work-in-canada"
  | "study-in-canada"
  | "family-sponsorship"
  | "visitor-immigration"
  | "citizenship"
  | "immigration-guides";

export type ResourceCategory = {
  title: string;
  slug: ResourceCategorySlug;
  description: string;
};

export type OfficialResourceLink = {
  label: string;
  href: string;
};

export type ArticleBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      title?: string;
      items: string[];
    }
  | {
      type: "callout";
      title: string;
      text: string;
    };

export type ResourceArticle = {
  title: string;
  description: string;
  slug: string;
  category: ResourceCategorySlug;
  publishedAt: string;
  updatedAt: string;
  author: string;
  generalGuide: boolean;
  content: ArticleBlock[];
  officialLinks: OfficialResourceLink[];
  relatedServices: NavigationItem[];
};

export type FaqGroup = {
  category: string;
  slug: string;
  questions: Array<{
    question: string;
    answer: string;
    relatedHref?: string;
  }>;
};
