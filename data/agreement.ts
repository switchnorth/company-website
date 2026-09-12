import type { ServiceAgreementData } from "../types/agreement";

export const serviceAgreementVersion = "v1.0";

// REVIEW REQUIRED BEFORE PRODUCTION:
// These defaults are development/template placeholders based on the supplied
// sample agreement structure. Client counsel/approval is required before use.
export const agreementDefaults = {
  documentInstructions: [
    "Official communication and documents should be shared by email unless another secure method is agreed.",
    "Documents should generally be provided in PDF, Word, JPEG, or PNG format.",
    "Documents must be clear and readable to avoid avoidable review delays.",
    "Documents should be in English or accompanied by a certified translation when required.",
    "Multiple pages for one document should be combined into one clearly named file where practical.",
    "Document names should identify the client and document type.",
  ],
  estimatedProcessingTime:
    "To be confirmed against current official guidance; no processing time is promised.",
  governingProvince: "British Columbia",
  tax: "To be confirmed",
} satisfies Pick<
  ServiceAgreementData,
  "documentInstructions" | "estimatedProcessingTime" | "governingProvince" | "tax"
>;

export const agreementReviewRequiredItems = [
  "Professional fees, taxes, payment milestones, and refund wording",
  "Scope of professional services for each application type",
  "Application type and any program-specific wording",
  "Processing-time language and official-source references",
  "Interest, late-payment, court-cost, and collection-cost terms",
  "Government-fee and disbursement wording",
  "Confidentiality, electronic communication, and document-storage wording",
  "CICC references, complaint link, and contact information",
  "Licensee absence, termination, withdrawal, and file-transfer wording",
  "Governing province, venue, and dispute-resolution wording",
  "Document requirements, file-size limits, and translation instructions",
  "Signature, initials, and future electronic-signature workflow",
];
