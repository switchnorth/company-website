import type { FaqGroup } from "@/types/resources";

export const faqGroups: FaqGroup[] = [
  {
    category: "Express Entry",
    slug: "express-entry",
    questions: [
      {
        question: "Does the CRS calculator confirm my official score?",
        answer:
          "No. It provides an informational estimate only. IRCC determines the official CRS score in the Express Entry system.",
        relatedHref: "/tools/crs-calculator",
      },
      {
        question: "Can I rely on old CRS or invitation information?",
        answer:
          "You should verify current IRCC instructions before making decisions. CRS rules, rounds, and program instructions can change.",
        relatedHref: "/services/express-entry",
      },
    ],
  },
  {
    category: "Permanent Residence",
    slug: "permanent-residence",
    questions: [
      {
        question: "Is permanent residence information the same for every pathway?",
        answer:
          "No. Different pathways can have different forms, documents, and requirements. General website information should be reviewed against the pathway that applies to your facts.",
        relatedHref: "/services/permanent-residence",
      },
      {
        question: "What should I organize before a consultation?",
        answer:
          "Identity documents, education and work records, immigration history, family details, travel history, and any current deadlines are useful starting points.",
        relatedHref: "/assessment",
      },
    ],
  },
  {
    category: "Work And Study",
    slug: "work-study",
    questions: [
      {
        question: "Is a work permit or study permit also a visa?",
        answer:
          "A permit and an entry document are not the same thing. Depending on citizenship and travel method, a person may also need a visitor visa or eTA to enter Canada.",
        relatedHref: "/services/work-permits",
      },
      {
        question: "Can the website confirm whether I qualify for a permit?",
        answer:
          "No. Permit eligibility is fact-specific and should be checked against current official instructions and your personal circumstances.",
        relatedHref: "/services/study-permits",
      },
    ],
  },
  {
    category: "Family And Visitors",
    slug: "family-visitors",
    questions: [
      {
        question: "Can family sponsorship outcomes be guaranteed?",
        answer:
          "No. Sponsorship decisions depend on the facts, documents, law, and officer review. Professional support helps organize and prepare the application; it cannot guarantee approval.",
        relatedHref: "/services/family-sponsorship",
      },
      {
        question: "What makes a visitor visa application clearer?",
        answer:
          "A clear purpose of travel, realistic visit plan, consistent documents, and relevant ties outside Canada can make the application easier to understand.",
        relatedHref: "/services/visitor-visas",
      },
    ],
  },
  {
    category: "Working With Switch North",
    slug: "switch-north",
    questions: [
      {
        question: "Is the demo licence number on this development site real?",
        answer:
          "No. DEMO-RCIC-000000 is placeholder development data and must be replaced and verified before production.",
        relatedHref: "/about",
      },
      {
        question: "Does submitting a form create a consultant-client relationship?",
        answer:
          "No. Contact and assessment forms are intake tools. A formal relationship depends on later review and engagement steps.",
        relatedHref: "/contact",
      },
    ],
  },
];
