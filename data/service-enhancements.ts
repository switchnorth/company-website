export type ServiceEnhancement = {
  commonSituations?: string[];
  questionsToPrepare?: string[];
  helpfulChecklist?: string[];
  officialResources?: Array<{
    label: string;
    href: string;
  }>;
};

export const serviceEnhancements: Record<string, ServiceEnhancement> = {
  "express-entry": {
    commonSituations: [
      "You are comparing Express Entry with provincial nomination options.",
      "You want to organize language, education, and work-history records before profile planning.",
      "You need a careful review of consistency across personal history and supporting documents.",
    ],
    questionsToPrepare: [
      "Which language tests and education records are already available?",
      "Do your job titles, dates, and duties line up across documents?",
      "Are there provincial or work-permit factors that should be discussed together?",
    ],
    officialResources: [
      {
        label: "Government of Canada Express Entry",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
      },
      {
        label: "Comprehensive Ranking System criteria",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system/grid.html",
      },
    ],
  },
  "provincial-nominee-program": {
    commonSituations: [
      "You have work, study, family, or employer ties to a province or territory.",
      "You want to compare regional options with federal permanent residence planning.",
      "You need help keeping provincial and federal steps organized.",
    ],
    officialResources: [
      {
        label: "Provincial nominees",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html",
      },
    ],
  },
  "family-sponsorship": {
    questionsToPrepare: [
      "Who is the sponsor and who is the applicant?",
      "What relationship, identity, and timeline documents are available?",
      "Are there prior applications, refusals, or status issues to discuss?",
    ],
    helpfulChecklist: [
      "Gather identity and civil-status records.",
      "Prepare a relationship and communication timeline where relevant.",
      "Keep translations, document dates, and names consistent.",
    ],
    officialResources: [
      {
        label: "Family sponsorship",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html",
      },
    ],
  },
  "study-permits": {
    commonSituations: [
      "You are preparing to study in Canada and want a coherent document plan.",
      "Your study goal needs to be explained alongside your background and future plans.",
      "You want to understand how temporary status planning connects with later goals.",
    ],
    helpfulChecklist: [
      "Organize school, identity, financial, and travel records.",
      "Prepare a clear explanation of your study purpose.",
      "Review current official instructions before relying on any document list.",
    ],
    officialResources: [
      {
        label: "Study in Canada",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
      },
    ],
  },
  "work-permits": {
    questionsToPrepare: [
      "What is the job, employer context, and intended timeline?",
      "Which documents are the worker and employer each expected to provide?",
      "Are there status, extension, or family-member questions to plan around?",
    ],
    officialResources: [
      {
        label: "Work in Canada",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada.html",
      },
    ],
  },
  "visitor-visas": {
    commonSituations: [
      "You are visiting family or friends in Canada.",
      "You need to explain the purpose and timing of a temporary stay.",
      "You want to organize financial, travel, and family-supporting documents.",
    ],
    helpfulChecklist: [
      "Clarify the purpose and planned length of travel.",
      "Gather identity, travel-history, and financial records.",
      "Avoid unsupported promises or details that cannot be documented.",
    ],
    officialResources: [
      {
        label: "Visitor visa",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html",
      },
    ],
  },
  "permanent-residence": {
    helpfulChecklist: [
      "Confirm the permanent residence pathway being discussed.",
      "Review identity, family, travel, education, and work-history consistency.",
      "Keep current official instructions separate from general planning notes.",
    ],
    officialResources: [
      {
        label: "Immigrate to Canada",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html",
      },
    ],
  },
  citizenship: {
    questionsToPrepare: [
      "Are residence, travel, identity, and family records organized?",
      "Are names, dates, and absences consistent across documents?",
      "Are there previous status or document issues that should be reviewed?",
    ],
    officialResources: [
      {
        label: "Canadian citizenship",
        href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship.html",
      },
    ],
  },
  "business-immigration": {
    commonSituations: [
      "You are exploring Canada as a founder, owner, or senior decision-maker.",
      "Your business planning and immigration planning need to be discussed together.",
      "You want to identify document categories before making commitments.",
    ],
    questionsToPrepare: [
      "What business records, ownership details, and timelines are available?",
      "Which family, work, or permanent residence goals should be considered together?",
      "What other professional advice may need to be coordinated?",
    ],
  },
};

export function getServiceEnhancement(slug: string) {
  return serviceEnhancements[slug];
}
