export const contactInterestOptions = [
  { label: "Express Entry", value: "express-entry" },
  { label: "PNP", value: "pnp" },
  { label: "Family Sponsorship", value: "family-sponsorship" },
  { label: "Study Permit", value: "study-permit" },
  { label: "Work Permit", value: "work-permit" },
  { label: "Visitor Visa", value: "visitor-visa" },
  { label: "Permanent Residence", value: "permanent-residence" },
  { label: "Citizenship", value: "citizenship" },
  { label: "Business Immigration", value: "business-immigration" },
  { label: "Other", value: "other" },
] as const;

export type ContactInterest = (typeof contactInterestOptions)[number]["value"];
