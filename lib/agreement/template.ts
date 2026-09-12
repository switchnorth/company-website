import type {
  AgreementSection,
  AgreementTimelineItem,
  ServiceAgreementData,
} from "../../types/agreement";

function paragraph(value: string) {
  return value;
}

export function validateAgreementData(data: ServiceAgreementData) {
  const requiredFields: Array<keyof ServiceAgreementData> = [
    "agreementId",
    "agreementVersion",
    "agreementDate",
    "clientName",
    "clientEmail",
    "clientPhone",
    "clientAddress",
    "consultantName",
    "consultantTitle",
    "consultantLicenseNumber",
    "businessName",
    "businessAddress",
    "businessEmail",
    "businessPhone",
    "businessWebsite",
    "applicationType",
    "consultationType",
    "professionalFee",
    "tax",
    "totalFee",
    "initialPayment",
    "remainingPayment",
    "estimatedProcessingTime",
    "governingProvince",
  ];

  return requiredFields.filter((field) => {
    const value = data[field];

    return typeof value !== "string" || value.trim().length === 0;
  });
}

export function createAgreementTimeline(
  data: ServiceAgreementData,
): AgreementTimelineItem[] {
  return [
    {
      workDescription: "Send Service Agreement",
      responsibleEntity: data.businessName,
      timeExpectation: data.agreementDate,
    },
    {
      workDescription: "Review agreement and complete consultation payment",
      responsibleEntity: "Client",
      timeExpectation: "Before the scheduled consultation",
    },
    {
      workDescription: "Attend consultation and discuss available next steps",
      responsibleEntity: `${data.businessName} and Client`,
      timeExpectation: data.consultationType,
    },
    {
      workDescription: "Discuss any additional service engagement if needed",
      responsibleEntity: `${data.businessName} and Client`,
      timeExpectation: "Only if separately agreed in writing",
    },
  ];
}

export function createServiceAgreementSections(
  data: ServiceAgreementData,
): AgreementSection[] {
  return [
    {
      id: "1",
      title: "Authorization",
      paragraphs: [
        paragraph(
          `This Service Agreement is entered into on ${data.agreementDate} between ${data.clientName} ("the Client") and ${data.consultantName}, ${data.consultantTitle} ("the Licensee") of ${data.businessName}.`,
        ),
        paragraph(
          `The Client appoints the Licensee to provide professional services related to ${data.applicationType}. The Licensee information, including licence number ${data.consultantLicenseNumber}, must be verified before production use.`,
        ),
      ],
      initials: "client",
    },
    {
      id: "2",
      title: "Pre-conditions of this Agreement",
      paragraphs: [
        "This Agreement is subject to the facts provided by the Client being accurate and complete.",
        "The Client remains responsible for medical, criminal, security, and admissibility matters that may affect an immigration or citizenship application.",
        "Changes to immigration law, policy, procedure, government action, or application requirements are outside the Licensee's control and may affect the scope, timing, or viability of a matter.",
        "If new facts arise or additional expert input is required, the scope of services may need to be reviewed and separately agreed.",
        `Estimated processing time: ${data.estimatedProcessingTime}`,
      ],
    },
    {
      id: "3",
      title: "Client's Instructions",
      paragraphs: [
        `The Client has instructed the Licensee to provide services related to ${data.applicationType}. Any additional application, appeal, reconsideration, or post-decision work must be agreed separately in writing.`,
      ],
    },
    {
      id: "4",
      title: "Client's Declaration",
      paragraphs: [
        "The Client confirms that information and documents provided for the matter must be true, correct, complete, and supported by available evidence.",
        "The Client agrees to advise the Licensee promptly of changes in family status, contact information, immigration history, employment, address, or other facts relevant to the matter.",
        "The Client agrees that electronic communication may be used and understands the associated limitations on information security.",
        "The Client agrees to respond to reasonable document and information requests in a timely manner.",
      ],
      initials: "client",
    },
    {
      id: "5",
      title: "Licensee's Declaration",
      paragraphs: [
        "The Licensee affirms that they will endeavour to provide professional immigration or citizenship consulting services to the Client and supervise anyone assisting with those services.",
      ],
      initials: "licensee",
    },
    {
      id: "6",
      title: "Professional Services",
      paragraphs: [
        `Professional services are limited to the consultation and scope related to ${data.applicationType} unless a separate written agreement is signed.`,
      ],
      bullets: [
        "Review intake information provided by the Client.",
        "Discuss general pathway, document, and process considerations.",
        "Identify possible next steps based on the information provided.",
        "Explain that no immigration outcome is guaranteed.",
        "Provide copies of relevant correspondence or written follow-up if separately agreed.",
      ],
    },
    {
      id: "7",
      title: "Timeline, Responsibility and Fees",
      paragraphs: [
        `Professional fee: ${data.professionalFee}. Tax: ${data.tax}. Total fee: ${data.totalFee}. Initial payment: ${data.initialPayment}. Remaining payment: ${data.remainingPayment}.`,
      ],
    },
    {
      id: "8",
      title: "Terms of Payment and Refund Policy",
      paragraphs: [
        "Payment and refund terms must be reviewed and approved before production. No immigration decision, visa, permit, status, or processing time is guaranteed.",
        "Any further services, disbursements, or government fees are outside this consultation unless separately agreed in writing.",
      ],
    },
    {
      id: "9",
      title: "Government Fees",
      paragraphs: [
        "Government fees, third-party fees, courier costs, translation costs, credential assessments, medical exams, police certificates, and other disbursements are the Client's responsibility unless otherwise agreed in writing.",
      ],
    },
    {
      id: "10",
      title: "Confidentiality",
      paragraphs: [
        "Information provided by the Client will be used for the professional services unless the Client directs otherwise or disclosure is required by law.",
        "Reasonable steps should be taken to protect paper and electronic records. Electronic communication and storage carry inherent security limitations.",
      ],
    },
    {
      id: "11",
      title: "Licensee Not Responsible",
      paragraphs: [
        "The Licensee is not responsible for matters outside the agreed immigration or citizenship consulting services, including business, tax, estate, real estate, investment, or unrelated legal matters.",
      ],
    },
    {
      id: "12",
      title: "Force Majeure",
      paragraphs: [
        "Failure to perform caused by conditions beyond reasonable control, including government restrictions, subsequent legislation, labour disruption, war, emergency, or other events outside control, is not a breach of this Agreement.",
      ],
    },
    {
      id: "13",
      title: "Termination or Withdrawal",
      paragraphs: [
        "This Agreement may terminate when the identified services are complete, if material changes make the services impossible, if agreed fees are not paid, or if the Client does not maintain contact or provides inaccurate, misleading, or false material information.",
        "The Client may request termination in writing. Any financial obligations for work performed or disbursements incurred remain subject to the approved agreement terms.",
      ],
    },
    {
      id: "14",
      title: "Planned or Unplanned Absence",
      paragraphs: [
        "If the Client cannot contact the Licensee and has reason to believe the Licensee is unavailable, incapacitated, or otherwise unable to act, the Client may use the regulator contact process approved for the final production agreement.",
      ],
    },
    {
      id: "15",
      title: "Agreement and Dispute Resolution",
      paragraphs: [
        "The Client and Licensee should make reasonable efforts to resolve disputes between them. Any complaint, regulator contact, response period, or discipline-process wording must be reviewed before production.",
      ],
    },
    {
      id: "16",
      title: "Governing Law",
      paragraphs: [
        `This Agreement is configured to be governed by the law of ${data.governingProvince}. Governing-law and venue wording must be reviewed before production.`,
      ],
    },
    {
      id: "17",
      title: "Official Communication and Document Instructions",
      bullets: data.documentInstructions,
    },
    {
      id: "18",
      title: "Validation",
      paragraphs: [
        "The Client acknowledges that they have read this Agreement, understand it, may seek independent legal advice or translation if required, and agree to be bound by the approved terms.",
        "Signature and initials areas are placeholders only. Electronic signing is not implemented in this phase.",
      ],
    },
  ];
}
