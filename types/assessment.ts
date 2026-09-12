export type AssessmentField =
  | "fullName"
  | "email"
  | "phone"
  | "ageRange"
  | "citizenshipCountry"
  | "residenceCountry"
  | "immigrationGoal"
  | "highestEducation"
  | "canadianEducation"
  | "foreignEducation"
  | "occupation"
  | "yearsExperience"
  | "canadianWorkExperience"
  | "foreignWorkExperience"
  | "englishTestTaken"
  | "englishTestType"
  | "englishScores"
  | "frenchAbility"
  | "frenchTestTaken"
  | "currentStatusCanada"
  | "canadianJobOffer"
  | "provincialNomination"
  | "familyInCanada"
  | "message"
  | "consent";

export type AssessmentStepId =
  | "personal"
  | "goal"
  | "education"
  | "work"
  | "language"
  | "connections"
  | "additional"
  | "review";

export type AssessmentFormData = Record<AssessmentField, string> & {
  consent: "yes" | "";
};

export type AssessmentErrors = Partial<Record<AssessmentField, string>>;

export type AssessmentSubmitState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: AssessmentErrors;
};
