import type { AssessmentField, AssessmentStepId } from "@/types/assessment";

export type AssessmentOption = {
  label: string;
  value: string;
};

export type AssessmentStep = {
  id: AssessmentStepId;
  title: string;
  description: string;
  fields: AssessmentField[];
};

export const assessmentSteps: AssessmentStep[] = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Basic contact and location details for follow-up.",
    fields: [
      "fullName",
      "email",
      "phone",
      "ageRange",
      "citizenshipCountry",
      "residenceCountry",
    ],
  },
  {
    id: "goal",
    title: "Immigration Goal",
    description: "The main reason you are exploring Canadian immigration options.",
    fields: ["immigrationGoal"],
  },
  {
    id: "education",
    title: "Education",
    description: "A high-level picture of Canadian and foreign education.",
    fields: ["highestEducation", "canadianEducation", "foreignEducation"],
  },
  {
    id: "work",
    title: "Work Experience",
    description: "Your current occupation and broad work experience background.",
    fields: [
      "occupation",
      "yearsExperience",
      "canadianWorkExperience",
      "foreignWorkExperience",
    ],
  },
  {
    id: "language",
    title: "Language",
    description: "English or French details that may help guide the conversation.",
    fields: [
      "englishTestTaken",
      "englishTestType",
      "englishScores",
      "frenchAbility",
      "frenchTestTaken",
    ],
  },
  {
    id: "connections",
    title: "Canada Connections",
    description: "Current status, job offer, nomination, and family connections.",
    fields: [
      "currentStatusCanada",
      "canadianJobOffer",
      "provincialNomination",
      "familyInCanada",
    ],
  },
  {
    id: "additional",
    title: "Additional Information",
    description: "Anything else that may help the review.",
    fields: ["message", "consent"],
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm your answers before sending the assessment.",
    fields: [],
  },
];

export const assessmentOptions = {
  ageRange: [
    { label: "Under 18", value: "under-18" },
    { label: "18-24", value: "18-24" },
    { label: "25-34", value: "25-34" },
    { label: "35-44", value: "35-44" },
    { label: "45-54", value: "45-54" },
    { label: "55 or older", value: "55-plus" },
    { label: "Prefer not to say", value: "prefer-not-to-say" },
  ],
  immigrationGoal: [
    { label: "Permanent Residence", value: "permanent-residence" },
    { label: "Work", value: "work" },
    { label: "Study", value: "study" },
    { label: "Family Sponsorship", value: "family-sponsorship" },
    { label: "Visit", value: "visit" },
    { label: "Business Immigration", value: "business-immigration" },
    { label: "Citizenship", value: "citizenship" },
    { label: "Not Sure", value: "not-sure" },
  ],
  highestEducation: [
    { label: "High school or less", value: "high-school-or-less" },
    { label: "Trade certificate or diploma", value: "trade-certificate" },
    { label: "College diploma", value: "college-diploma" },
    { label: "Bachelor's degree", value: "bachelors" },
    { label: "Master's degree", value: "masters" },
    { label: "Doctoral degree", value: "doctoral" },
    { label: "Prefer to discuss", value: "prefer-to-discuss" },
  ],
  educationStatus: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "In progress", value: "in-progress" },
    { label: "Not sure", value: "not-sure" },
  ],
  yearsExperience: [
    { label: "Less than 1 year", value: "less-than-1" },
    { label: "1-2 years", value: "1-2" },
    { label: "3-5 years", value: "3-5" },
    { label: "6-10 years", value: "6-10" },
    { label: "More than 10 years", value: "10-plus" },
    { label: "Not applicable", value: "not-applicable" },
  ],
  experienceStatus: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Some", value: "some" },
    { label: "Not sure", value: "not-sure" },
  ],
  yesNoUnsure: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Not sure", value: "not-sure" },
  ],
  englishTestType: [
    { label: "CELPIP", value: "celpip" },
    { label: "IELTS", value: "ielts" },
    { label: "Other", value: "other" },
    { label: "Not applicable", value: "not-applicable" },
  ],
  frenchAbility: [
    { label: "None", value: "none" },
    { label: "Basic", value: "basic" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
    { label: "Native or fluent", value: "fluent" },
    { label: "Prefer to discuss", value: "prefer-to-discuss" },
  ],
  currentStatusCanada: [
    { label: "Outside Canada", value: "outside-canada" },
    { label: "Visitor", value: "visitor" },
    { label: "Student", value: "student" },
    { label: "Worker", value: "worker" },
    { label: "Permanent resident", value: "permanent-resident" },
    { label: "Canadian citizen", value: "canadian-citizen" },
    { label: "Other or not sure", value: "other-not-sure" },
  ],
} satisfies Record<string, AssessmentOption[]>;

export const assessmentFieldLabels: Record<AssessmentField, string> = {
  fullName: "Name",
  email: "Email",
  phone: "Phone",
  ageRange: "Age range",
  citizenshipCountry: "Country of citizenship",
  residenceCountry: "Country of residence",
  immigrationGoal: "Immigration goal",
  highestEducation: "Highest education",
  canadianEducation: "Canadian education",
  foreignEducation: "Foreign education",
  occupation: "Current occupation/job title",
  yearsExperience: "Years of experience",
  canadianWorkExperience: "Canadian work experience",
  foreignWorkExperience: "Foreign work experience",
  englishTestTaken: "English test taken",
  englishTestType: "English test type",
  englishScores: "Optional English scores",
  frenchAbility: "French ability",
  frenchTestTaken: "French test taken",
  currentStatusCanada: "Current status in Canada",
  canadianJobOffer: "Canadian job offer",
  provincialNomination: "Provincial nomination",
  familyInCanada: "Family in Canada",
  message: "Message/comments",
  consent: "Consent",
};
