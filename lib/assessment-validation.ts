import { assessmentOptions, assessmentSteps } from "@/data/assessment";
import type {
  AssessmentErrors,
  AssessmentField,
  AssessmentFormData,
} from "@/types/assessment";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s().-]{7,24}$/;
const suspiciousUrlPattern = /(https?:\/\/|www\.)/i;
const repeatedUrlPattern = /(https?:\/\/|www\.).*(https?:\/\/|www\.)/i;

const optionSets = {
  ageRange: new Set<string>(
    assessmentOptions.ageRange.map((option) => option.value),
  ),
  immigrationGoal: new Set<string>(
    assessmentOptions.immigrationGoal.map((option) => option.value),
  ),
  highestEducation: new Set<string>(
    assessmentOptions.highestEducation.map((option) => option.value),
  ),
  educationStatus: new Set<string>(
    assessmentOptions.educationStatus.map((option) => option.value),
  ),
  yearsExperience: new Set<string>(
    assessmentOptions.yearsExperience.map((option) => option.value),
  ),
  experienceStatus: new Set<string>(
    assessmentOptions.experienceStatus.map((option) => option.value),
  ),
  yesNoUnsure: new Set<string>(
    assessmentOptions.yesNoUnsure.map((option) => option.value),
  ),
  englishTestType: new Set<string>(
    assessmentOptions.englishTestType.map((option) => option.value),
  ),
  frenchAbility: new Set<string>(
    assessmentOptions.frenchAbility.map((option) => option.value),
  ),
  currentStatusCanada: new Set<string>(
    assessmentOptions.currentStatusCanada.map((option) => option.value),
  ),
};

export const initialAssessmentData: AssessmentFormData = {
  fullName: "",
  email: "",
  phone: "",
  ageRange: "",
  citizenshipCountry: "",
  residenceCountry: "",
  immigrationGoal: "",
  highestEducation: "",
  canadianEducation: "",
  foreignEducation: "",
  occupation: "",
  yearsExperience: "",
  canadianWorkExperience: "",
  foreignWorkExperience: "",
  englishTestTaken: "",
  englishTestType: "",
  englishScores: "",
  frenchAbility: "",
  frenchTestTaken: "",
  currentStatusCanada: "",
  canadianJobOffer: "",
  provincialNomination: "",
  familyInCanada: "",
  message: "",
  consent: "",
};

function hasObviousSpam(value: string) {
  return repeatedUrlPattern.test(value) || suspiciousUrlPattern.test(value.slice(0, 80));
}

function isShortText(value: string, minLength = 2, maxLength = 100) {
  return value.length >= minLength && value.length <= maxLength && !hasObviousSpam(value);
}

function addOptionError(
  errors: AssessmentErrors,
  data: AssessmentFormData,
  field: AssessmentField,
  options: Set<string>,
  message: string,
) {
  if (!options.has(data[field])) {
    errors[field] = message;
  }
}

export function parseAssessmentFormData(formData: FormData): AssessmentFormData {
  return (Object.keys(initialAssessmentData) as AssessmentField[]).reduce(
    (data, field) => {
      if (field === "consent") {
        return {
          ...data,
          consent: formData.get("consent") === "yes" ? "yes" : "",
        };
      }

      const value = formData.get(field);

      return {
        ...data,
        [field]: typeof value === "string" ? value.trim() : "",
      };
    },
    initialAssessmentData,
  );
}

export function validateAssessmentFields(
  data: AssessmentFormData,
  fields: AssessmentField[],
) {
  const errors: AssessmentErrors = {};

  if (fields.includes("fullName") && !isShortText(data.fullName, 2, 100)) {
    errors.fullName = "Enter your name using 2 to 100 characters.";
  }

  if (
    fields.includes("email") &&
    (!emailPattern.test(data.email) || data.email.length > 160)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (fields.includes("phone") && data.phone && !phonePattern.test(data.phone)) {
    errors.phone = "Enter a valid phone number or leave this field blank.";
  }

  if (
    fields.includes("citizenshipCountry") &&
    !isShortText(data.citizenshipCountry, 2, 80)
  ) {
    errors.citizenshipCountry = "Enter your country of citizenship.";
  }

  if (
    fields.includes("residenceCountry") &&
    !isShortText(data.residenceCountry, 2, 80)
  ) {
    errors.residenceCountry = "Enter your country of residence.";
  }

  if (fields.includes("ageRange")) {
    addOptionError(
      errors,
      data,
      "ageRange",
      optionSets.ageRange,
      "Choose an age range.",
    );
  }

  if (fields.includes("immigrationGoal")) {
    addOptionError(
      errors,
      data,
      "immigrationGoal",
      optionSets.immigrationGoal,
      "Choose the immigration goal closest to your situation.",
    );
  }

  if (fields.includes("highestEducation")) {
    addOptionError(
      errors,
      data,
      "highestEducation",
      optionSets.highestEducation,
      "Choose your highest education level.",
    );
  }

  if (fields.includes("canadianEducation")) {
    addOptionError(
      errors,
      data,
      "canadianEducation",
      optionSets.educationStatus,
      "Choose the option that best describes Canadian education.",
    );
  }

  if (fields.includes("foreignEducation")) {
    addOptionError(
      errors,
      data,
      "foreignEducation",
      optionSets.educationStatus,
      "Choose the option that best describes foreign education.",
    );
  }

  if (fields.includes("occupation") && !isShortText(data.occupation, 2, 120)) {
    errors.occupation = "Enter your current occupation or job title.";
  }

  if (fields.includes("yearsExperience")) {
    addOptionError(
      errors,
      data,
      "yearsExperience",
      optionSets.yearsExperience,
      "Choose your broad years of experience.",
    );
  }

  if (fields.includes("canadianWorkExperience")) {
    addOptionError(
      errors,
      data,
      "canadianWorkExperience",
      optionSets.experienceStatus,
      "Choose the option that best describes Canadian work experience.",
    );
  }

  if (fields.includes("foreignWorkExperience")) {
    addOptionError(
      errors,
      data,
      "foreignWorkExperience",
      optionSets.experienceStatus,
      "Choose the option that best describes foreign work experience.",
    );
  }

  if (fields.includes("englishTestTaken")) {
    addOptionError(
      errors,
      data,
      "englishTestTaken",
      optionSets.yesNoUnsure,
      "Choose whether an English test has been taken.",
    );
  }

  if (fields.includes("englishTestType")) {
    addOptionError(
      errors,
      data,
      "englishTestType",
      optionSets.englishTestType,
      "Choose the English test type or not applicable.",
    );
  }

  if (
    fields.includes("englishScores") &&
    data.englishScores &&
    (data.englishScores.length > 220 || hasObviousSpam(data.englishScores))
  ) {
    errors.englishScores = "Keep optional English score details under 220 characters.";
  }

  if (fields.includes("frenchAbility")) {
    addOptionError(
      errors,
      data,
      "frenchAbility",
      optionSets.frenchAbility,
      "Choose your French ability level.",
    );
  }

  if (fields.includes("frenchTestTaken")) {
    addOptionError(
      errors,
      data,
      "frenchTestTaken",
      optionSets.yesNoUnsure,
      "Choose whether a French test has been taken.",
    );
  }

  if (fields.includes("currentStatusCanada")) {
    addOptionError(
      errors,
      data,
      "currentStatusCanada",
      optionSets.currentStatusCanada,
      "Choose your current status in Canada.",
    );
  }

  if (fields.includes("canadianJobOffer")) {
    addOptionError(
      errors,
      data,
      "canadianJobOffer",
      optionSets.yesNoUnsure,
      "Choose whether you have a Canadian job offer.",
    );
  }

  if (fields.includes("provincialNomination")) {
    addOptionError(
      errors,
      data,
      "provincialNomination",
      optionSets.yesNoUnsure,
      "Choose whether you have a provincial nomination.",
    );
  }

  if (fields.includes("familyInCanada")) {
    addOptionError(
      errors,
      data,
      "familyInCanada",
      optionSets.yesNoUnsure,
      "Choose whether you have family in Canada.",
    );
  }

  if (
    fields.includes("message") &&
    data.message &&
    (data.message.length > 2000 || hasObviousSpam(data.message))
  ) {
    errors.message = "Keep comments under 2000 characters without promotional links.";
  }

  if (fields.includes("consent") && data.consent !== "yes") {
    errors.consent =
      "Confirm that Switch North can review this information and respond.";
  }

  return errors;
}

export function validateAssessmentStep(data: AssessmentFormData, stepIndex: number) {
  return validateAssessmentFields(data, assessmentSteps[stepIndex]?.fields ?? []);
}

export function validateAssessment(data: AssessmentFormData) {
  return validateAssessmentFields(
    data,
    assessmentSteps.flatMap((step) => step.fields),
  );
}
