import { siteConfig } from "@/data/site";
import type {
  ResourceArticle,
  ResourceCategory,
  ResourceCategorySlug,
} from "@/types/resources";

export const resourceCategories: ResourceCategory[] = [
  {
    title: "Express Entry",
    slug: "express-entry",
    description:
      "General planning resources for skilled-worker immigration and CRS profile preparation.",
  },
  {
    title: "Permanent Residence",
    slug: "permanent-residence",
    description:
      "High-level guidance for organizing documents and planning long-term settlement steps.",
  },
  {
    title: "Work in Canada",
    slug: "work-in-canada",
    description:
      "Resources for temporary workers, employer-supported plans, and work authorization questions.",
  },
  {
    title: "Study in Canada",
    slug: "study-in-canada",
    description:
      "Student-focused guidance for study permits, school documents, and status planning.",
  },
  {
    title: "Family Sponsorship",
    slug: "family-sponsorship",
    description:
      "Careful preparation topics for sponsors, applicants, and family application records.",
  },
  {
    title: "Visitor Immigration",
    slug: "visitor-immigration",
    description:
      "Temporary resident resources for visitors, travel purpose, and re-entry planning.",
  },
  {
    title: "Citizenship",
    slug: "citizenship",
    description:
      "General resources for permanent residents preparing citizenship-related records.",
  },
  {
    title: "Immigration Guides",
    slug: "immigration-guides",
    description:
      "Evergreen checklists and planning notes that apply across several immigration goals.",
  },
];

const author = siteConfig.businessName;

export const resourceArticles: ResourceArticle[] = [
  {
    title: "Express Entry Profile Basics",
    description:
      "A general overview of the information skilled-worker candidates often organize before creating or updating an Express Entry profile.",
    slug: "express-entry-profile-basics",
    category: "express-entry",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "Express Entry is an online system used by IRCC to manage applications from skilled workers. A profile is not the same thing as a permanent residence application, so candidates should keep their records organized before they rely on any next step.",
      },
      {
        type: "list",
        title: "Information to organize",
        items: [
          "Identity and travel document details.",
          "Education records and any credential assessment information that may apply.",
          "Language test details expressed in the correct official format.",
          "Work history, job titles, employers, dates, and duties.",
          "Family composition and current immigration status details.",
        ],
      },
      {
        type: "callout",
        title: "General information",
        text: "This article is general information. Current Express Entry instructions should be confirmed through official Government of Canada sources or a consultation.",
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Express Entry",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
      },
      {
        label: "Government of Canada: CRS criteria",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html",
      },
    ],
    relatedServices: [
      { label: "Express Entry", href: "/services/express-entry" },
      { label: "CRS Calculator", href: "/tools/crs-calculator" },
    ],
  },
  {
    title: "Using A CRS Calculator Responsibly",
    description:
      "A general guide to treating a CRS estimate as planning information, not as an official IRCC score.",
    slug: "using-a-crs-calculator-responsibly",
    category: "express-entry",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "A CRS calculator can help candidates understand how profile factors may be grouped, but it does not decide eligibility or replace the score shown in an official IRCC account.",
      },
      {
        type: "list",
        title: "Healthy ways to use an estimate",
        items: [
          "Review which factors contribute to the score.",
          "Identify documents that may need confirmation.",
          "Use the estimate to prepare better questions for a consultation.",
          "Recheck official rules before making immigration decisions.",
        ],
      },
      {
        type: "callout",
        title: "No official decision",
        text: "IRCC determines the official CRS score. Website calculators should be treated as informational tools only.",
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: CRS criteria",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html",
      },
    ],
    relatedServices: [
      { label: "CRS Calculator", href: "/tools/crs-calculator" },
      { label: "Express Entry", href: "/services/express-entry" },
    ],
  },
  {
    title: "Permanent Residence Document Consistency",
    description:
      "A general planning article about keeping identity, family, education, work, and travel records consistent across an application package.",
    slug: "permanent-residence-document-consistency",
    category: "permanent-residence",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "Permanent residence applications often rely on records from several parts of a person's life. Small inconsistencies can create confusion, so preparation should include a careful review of names, dates, locations, and family details.",
      },
      {
        type: "list",
        title: "Areas worth checking",
        items: [
          "Passports, national identity documents, and civil status records.",
          "Education history and work history timelines.",
          "Travel history and address history.",
          "Family member details across all relevant forms.",
        ],
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Live in Canada permanently",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html",
      },
      {
        label: "Government of Canada: PR cards and status",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/permanent-residents.html",
      },
    ],
    relatedServices: [
      { label: "Permanent Residence", href: "/services/permanent-residence" },
      { label: "Free Assessment", href: "/assessment" },
    ],
  },
  {
    title: "Work Permit Planning Questions",
    description:
      "A general guide to the practical questions workers and employers can organize before discussing Canadian work authorization.",
    slug: "work-permit-planning-questions",
    category: "work-in-canada",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "Work permit planning depends on the worker, the job, the employer context, and current program instructions. A clear intake starts with understanding the type of work, timing, and whether employer documents may be involved.",
      },
      {
        type: "list",
        title: "Useful questions",
        items: [
          "What is the job title, work location, and expected start date?",
          "Is the worker already in Canada, and if so, what is their current status?",
          "Is the position employer-specific or connected to an open work permit category?",
          "Are there family members who may need related status planning?",
        ],
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Find out what type of work permit you need",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/need-permit.html",
      },
      {
        label: "Government of Canada: Work without a permit",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/work-without-permit.html",
      },
    ],
    relatedServices: [
      { label: "Work Permits", href: "/services/work-permits" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Study Permit Document Readiness",
    description:
      "A general checklist-style guide for students preparing to discuss study permit documents and school plans.",
    slug: "study-permit-document-readiness",
    category: "study-in-canada",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "Study permit preparation often brings together school admission, financial documents, travel plans, and the student's longer-term goals. The details should support a clear and coherent study plan.",
      },
      {
        type: "list",
        title: "Documents to discuss",
        items: [
          "Letter of acceptance and school details.",
          "Financial records and family support details where relevant.",
          "Passport and travel history.",
          "Study plan, program choice, and future planning context.",
        ],
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Study in Canada",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
      },
      {
        label: "Government of Canada: Study permit eligibility",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/eligibility.html",
      },
    ],
    relatedServices: [
      { label: "Study Permits", href: "/services/study-permits" },
      { label: "Free Assessment", href: "/assessment" },
    ],
  },
  {
    title: "Family Sponsorship Preparation",
    description:
      "A general overview of sponsor, applicant, relationship, and family-document organization before a sponsorship consultation.",
    slug: "family-sponsorship-preparation",
    category: "family-sponsorship",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "Family sponsorship applications are personal and document-heavy. Sponsors and applicants should organize records thoughtfully and avoid relying on generic assumptions about what a family application requires.",
      },
      {
        type: "list",
        title: "Preparation themes",
        items: [
          "Sponsor status, residence, and undertaking responsibilities.",
          "Applicant identity, civil status, and family records.",
          "Relationship history and supporting documents, where applicable.",
          "Children, dependants, and family-member declarations.",
        ],
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Family sponsorship",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html",
      },
      {
        label: "Government of Canada: Sponsor spouse, partner, or child",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship/spouse-partner-children.html",
      },
    ],
    relatedServices: [
      { label: "Family Sponsorship", href: "/services/family-sponsorship" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Visitor Visa Purpose Of Travel",
    description:
      "A general article about organizing the purpose, timing, and supporting context for a visitor visa conversation.",
    slug: "visitor-visa-purpose-of-travel",
    category: "visitor-immigration",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "Visitor visa preparation should make the purpose of travel understandable. The supporting documents should match the planned visit and the applicant's broader personal context.",
      },
      {
        type: "list",
        title: "Common planning details",
        items: [
          "Why the applicant wants to visit Canada.",
          "How long the trip is expected to last.",
          "Where the applicant plans to stay.",
          "What ties and responsibilities exist outside Canada.",
        ],
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Visitor visa",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html",
      },
      {
        label: "Government of Canada: Entry requirements by country",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html",
      },
    ],
    relatedServices: [
      { label: "Visitor Visas", href: "/services/visitor-visas" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Citizenship Records To Review",
    description:
      "A general overview of records permanent residents may want to organize before asking citizenship-related questions.",
    slug: "citizenship-records-to-review",
    category: "citizenship",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "Citizenship planning can involve identity records, permanent residence history, travel dates, and family details. Because rules and forms can change, applicants should verify current instructions before filing.",
      },
      {
        type: "list",
        title: "Records to prepare",
        items: [
          "Permanent resident card and identity documents.",
          "Travel history and residence records.",
          "Language or education records where relevant.",
          "Family and name-change documents if applicable.",
        ],
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Canadian citizenship",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship.html",
      },
    ],
    relatedServices: [
      { label: "Citizenship", href: "/services/citizenship" },
      { label: "Permanent Residence", href: "/services/permanent-residence" },
    ],
  },
  {
    title: "Preparing For An Immigration Consultation",
    description:
      "A general guide to organizing goals, documents, and questions before speaking with an immigration professional.",
    slug: "preparing-for-an-immigration-consultation",
    category: "immigration-guides",
    publishedAt: "2026-09-11",
    updatedAt: "2026-09-11",
    author,
    generalGuide: true,
    content: [
      {
        type: "paragraph",
        text: "A useful consultation usually starts with clear facts. Before meeting with a representative, gather basic identity details, immigration history, family information, education records, work history, and any deadline or refusal history that may affect planning.",
      },
      {
        type: "list",
        title: "Helpful preparation",
        items: [
          "Write down the immigration goal you want to discuss.",
          "List current status, expiry dates, and previous applications.",
          "Prepare questions about process, documents, responsibilities, and communication.",
          "Check that any paid representative is authorized before relying on immigration advice.",
        ],
      },
      {
        type: "callout",
        title: "Representative check",
        text: "Government of Canada guidance explains how to choose a representative and how to check whether a paid representative is authorized.",
      },
    ],
    officialLinks: [
      {
        label: "Government of Canada: Choose a representative",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigration-citizenship-representative/choose.html",
      },
      {
        label: "Government of Canada: Check if a representative is authorized",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigration-citizenship-representative/choose/authorized.html",
      },
      {
        label: "Government of Canada: Protect yourself from fraud",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/protect-fraud.html",
      },
    ],
    relatedServices: [
      { label: "About Switch North", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Free Assessment", href: "/assessment" },
    ],
  },
];

export function getResourceCategory(slug: ResourceCategorySlug) {
  return resourceCategories.find((category) => category.slug === slug);
}

export function getResourceArticle(slug: string) {
  return resourceArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: ResourceCategorySlug) {
  return resourceArticles.filter((article) => article.category === categorySlug);
}
