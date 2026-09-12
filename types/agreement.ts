export type AgreementFeeLine = {
  label: string;
  amount: string;
  due: string;
};

export type AgreementTimelineItem = {
  workDescription: string;
  responsibleEntity: string;
  timeExpectation: string;
};

export type ServiceAgreementData = {
  agreementId: string;
  agreementVersion: string;
  agreementDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  consultantName: string;
  consultantTitle: string;
  consultantLicenseNumber: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessWebsite: string;
  applicationType: string;
  consultationType: string;
  professionalFee: string;
  tax: string;
  totalFee: string;
  initialPayment: string;
  remainingPayment: string;
  paymentMilestones: AgreementFeeLine[];
  estimatedProcessingTime: string;
  governingProvince: string;
  documentInstructions: string[];
};

export type AgreementSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  initials?: "client" | "licensee";
};

export type GeneratedAgreement = {
  agreementId: string;
  agreementVersion: string;
  fileName: string;
  generatedAt: string;
  pdf: Buffer;
};
