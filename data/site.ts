import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  HeartHandshake,
  Home,
  Landmark,
  MapPinned,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { getConsultationCtaHref } from "./features";
import type { SiteConfig } from "@/types/site";

// DEVELOPMENT PLACEHOLDER DATA:
// All demo business information in this file MUST be replaced and verified
// before production. Do not treat DEMO-RCIC-000000 as a genuine licence.
export const siteConfig: SiteConfig = {
  isDevelopmentPlaceholderData: true,
  businessName: "Switch North Immigration",
  domain: "https://switchnorth.ca",
  description:
    "Canadian immigration services with clear, professional guidance for individuals, families, and employers.",
  email: "info@switchnorth.ca",
  phone: "+1 (604) 555-0148",
  address: "1234 Example Street\nSurrey, BC V0V 0V0\nCanada",
  businessHours: "Monday – Friday\n9:00 AM – 5:00 PM",
  languages: ["English", "Punjabi", "Hindi"],
  serviceArea: "Canada and international clients",
  consultantName: "Inderjit Singh",
  consultantTitle: "Canadian Immigration Consultant",
  consultantLicense: "DEMO-RCIC-000000",
  bookingUrl: getConsultationCtaHref(),
  consultationCta: "Book a Consultation",
  secondaryCta: "Free Assessment",
  logo: {
    src: "/assets/images/logo.jpeg",
    alt: "Switch North Immigration logo",
    width: 363,
    height: 186,
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "#",
    },
  ],
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Free Assessment", href: "/assessment" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
  serviceCategories: [
    {
      title: "Express Entry",
      slug: "express-entry",
      description:
        "High-level guidance for skilled workers exploring federal economic immigration.",
      overview:
        "Express Entry can be an important option for skilled workers who want to build a long-term future in Canada. Switch North helps clients understand the moving pieces, organize documents, and prepare for informed next steps.",
      audience: [
        "Skilled workers exploring permanent residence",
        "Candidates with Canadian work or study history",
        "Applicants who want a clearer document plan before creating or updating a profile",
      ],
      process: [
        "Review your background, goals, and current immigration history.",
        "Discuss possible pathway fit at a general level and identify document gaps.",
        "Organize supporting records and prepare next steps for profile or application work.",
        "Monitor follow-up items and keep the process understandable.",
      ],
      considerations: [
        "Selection criteria, invitations, and program instructions can change.",
        "Language results, education records, work history, and identity documents should be consistent.",
        "Current requirements should be confirmed through official Government of Canada sources or a consultation.",
      ],
      relatedServices: [
        "provincial-nominee-program",
        "permanent-residence",
        "work-permits",
      ],
      icon: MapPinned,
    },
    {
      title: "Provincial Nominee Programs",
      slug: "provincial-nominee-program",
      description:
        "Support for candidates considering province or territory nomination options.",
      overview:
        "Provincial nominee pathways can connect immigration planning with regional needs, work experience, education, or employer relationships. Switch North helps clients approach these options with structure and current-review discipline.",
      audience: [
        "Candidates with ties to a province or territory",
        "Workers or graduates exploring regional immigration options",
        "Applicants who need help organizing a nomination-focused plan",
      ],
      process: [
        "Clarify your preferred province, background, and current status.",
        "Review potential fit at a general level without assuming eligibility.",
        "Prepare a document roadmap for nomination or related application steps.",
        "Coordinate follow-up planning after provincial or federal milestones.",
      ],
      considerations: [
        "Provincial criteria may change and can differ significantly by region.",
        "Some pathways may depend on employer, education, or local connection factors.",
        "Official provincial and Government of Canada sources should be checked before decisions.",
      ],
      relatedServices: [
        "express-entry",
        "work-permits",
        "permanent-residence",
      ],
      icon: Landmark,
    },
    {
      title: "Family Sponsorship",
      slug: "family-sponsorship",
      description:
        "Careful support for families preparing sponsorship applications.",
      overview:
        "Family sponsorship is deeply personal, and strong preparation depends on clear records and consistent relationship evidence. Switch North supports families with organized, respectful guidance.",
      audience: [
        "Canadian citizens or permanent residents sponsoring eligible relatives",
        "Couples and families organizing relationship documents",
        "Applicants who want help understanding the application package",
      ],
      process: [
        "Understand the sponsor, applicant, and family circumstances.",
        "Create an evidence and document checklist for the application.",
        "Review forms and supporting records for completeness and consistency.",
        "Support follow-up planning if additional information is requested.",
      ],
      considerations: [
        "Family applications often depend on clear documents and consistent timelines.",
        "Relationship evidence should be organized thoughtfully and respectfully.",
        "Eligibility and document requirements should be verified before submission.",
      ],
      relatedServices: [
        "visitor-visas",
        "permanent-residence",
        "citizenship",
      ],
      icon: HeartHandshake,
    },
    {
      title: "Study Permits",
      slug: "study-permits",
      description:
        "Practical guidance for students preparing to study in Canada.",
      overview:
        "Studying in Canada can involve academic, financial, and immigration planning. Switch North helps students and families organize the story, documents, and next steps for a stronger application process.",
      audience: [
        "International students preparing for Canadian studies",
        "Families supporting a study plan",
        "Students who want to understand status and future planning at a general level",
      ],
      process: [
        "Review your study goal, timeline, and current circumstances.",
        "Organize school, financial, identity, and purpose-related documents.",
        "Prepare a clear application package based on verified requirements.",
        "Discuss maintaining status and planning future steps in general terms.",
      ],
      considerations: [
        "Study permit requirements and supporting-document expectations can change.",
        "Education plans should be coherent and supported by records.",
        "Students should confirm current rules before relying on any general information.",
      ],
      relatedServices: [
        "work-permits",
        "visitor-visas",
        "permanent-residence",
      ],
      icon: GraduationCap,
    },
    {
      title: "Work Permits",
      slug: "work-permits",
      description:
        "Document and pathway support for temporary workers and employers.",
      overview:
        "Work authorization can affect both career plans and employer timelines. Switch North helps workers and employers understand the process at a high level and organize application materials.",
      audience: [
        "Temporary foreign workers",
        "Employers supporting a worker's authorization process",
        "Applicants planning extensions or changes in status",
      ],
      process: [
        "Review the work situation, timeline, employer context, and current status.",
        "Identify document responsibilities for the worker and employer.",
        "Prepare application materials based on the pathway being pursued.",
        "Plan for status, timing, and follow-up communication where applicable.",
      ],
      considerations: [
        "Work permit pathways can depend on job, employer, worker history, and current rules.",
        "Employer documents and applicant documents should align.",
        "Current requirements should be confirmed before filing or making employment decisions.",
      ],
      relatedServices: [
        "express-entry",
        "provincial-nominee-program",
        "permanent-residence",
      ],
      icon: BriefcaseBusiness,
    },
    {
      title: "Visitor Visas",
      slug: "visitor-visas",
      description:
        "Clear preparation for temporary visits, family travel, and short-term stays.",
      overview:
        "A visitor application should explain the purpose of travel and provide organized supporting documents. Switch North helps visitors prepare with clarity and realistic expectations.",
      audience: [
        "People visiting family or friends in Canada",
        "Travellers planning short-term stays",
        "Applicants who want help organizing purpose-of-travel documents",
      ],
      process: [
        "Review travel purpose, timing, and personal circumstances.",
        "Organize identity, travel, financial, and family-supporting documents.",
        "Prepare forms and statements based on verified current instructions.",
        "Discuss follow-up or status questions at a general level.",
      ],
      considerations: [
        "Temporary intent and supporting documents should be clear and consistent.",
        "Travel plans should be realistic and supported by available records.",
        "Rules and document expectations should be checked before submission.",
      ],
      relatedServices: [
        "family-sponsorship",
        "study-permits",
        "work-permits",
      ],
      icon: Plane,
    },
    {
      title: "Permanent Residence",
      slug: "permanent-residence",
      description:
        "Application support for clients preparing for long-term settlement in Canada.",
      overview:
        "Permanent residence planning often brings several documents, deadlines, and life details together. Switch North helps clients keep the process organized and grounded in verified requirements.",
      audience: [
        "Applicants transitioning from temporary status",
        "Candidates preparing after nomination or pathway selection",
        "Families organizing long-term settlement plans",
      ],
      process: [
        "Clarify the pathway, family composition, and document requirements.",
        "Build an application checklist and evidence plan.",
        "Review forms and supporting documents for consistency.",
        "Support next-step planning and follow-up requests where applicable.",
      ],
      considerations: [
        "Permanent residence pathways have different document and timing needs.",
        "Identity, family, travel, education, and work records should be consistent.",
        "Current official instructions should be reviewed before submission.",
      ],
      relatedServices: [
        "express-entry",
        "provincial-nominee-program",
        "family-sponsorship",
      ],
      icon: Home,
    },
    {
      title: "Citizenship",
      slug: "citizenship",
      description:
        "Support for permanent residents preparing Canadian citizenship applications.",
      overview:
        "Citizenship applications require careful attention to records, dates, identity documents, and application details. Switch North helps permanent residents prepare in an organized way.",
      audience: [
        "Permanent residents considering citizenship",
        "Applicants organizing residence, travel, and identity records",
        "Families who want help preparing citizenship documents",
      ],
      process: [
        "Review your general readiness and document history.",
        "Organize residence, identity, travel, and family information.",
        "Prepare forms and supporting records based on current instructions.",
        "Plan next steps after submission or follow-up requests.",
      ],
      considerations: [
        "Citizenship requirements and forms should be verified before filing.",
        "Dates and travel history should be reviewed carefully.",
        "General website information is not a substitute for advice based on your facts.",
      ],
      relatedServices: [
        "permanent-residence",
        "family-sponsorship",
        "visitor-visas",
      ],
      icon: ShieldCheck,
    },
    {
      title: "Business Immigration",
      slug: "business-immigration",
      description:
        "Strategic guidance for founders and business owners exploring Canada.",
      overview:
        "Business immigration planning can involve personal goals, business records, ownership details, and long-term settlement strategy. Switch North helps clients frame the conversation and prepare next steps.",
      audience: [
        "Entrepreneurs exploring Canadian immigration options",
        "Business owners planning future expansion or relocation",
        "Senior decision-makers who need an organized immigration discussion",
      ],
      process: [
        "Review personal, family, and business goals at a high level.",
        "Identify document categories and professional coordination needs.",
        "Organize a roadmap for consultation and application preparation.",
        "Support follow-up planning as business and immigration details evolve.",
      ],
      considerations: [
        "Business pathways can be fact-specific and may require coordinated professional advice.",
        "Ownership, financial, and operating records should be handled carefully.",
        "Current requirements should be confirmed before business or immigration commitments.",
      ],
      relatedServices: [
        "work-permits",
        "permanent-residence",
        "provincial-nominee-program",
      ],
      icon: Building2,
    },
  ],
};

export function getServiceCategory(slug: string) {
  return siteConfig.serviceCategories.find((service) => service.slug === slug);
}
