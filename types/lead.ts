import type { AssessmentFormData } from "@/types/assessment";
import type { ContactInterest } from "@/data/contact";

export type ContactLead = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  interest: ContactInterest;
  message: string;
  consent: boolean;
};

export type AssessmentLead = AssessmentFormData;

export type LeadSubmissionKind = "contact" | "assessment";

export type LeadWorkflowResult = {
  id: string;
  delivery: "sent" | "development-disabled";
};
