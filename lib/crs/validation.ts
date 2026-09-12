import { crsRules } from "../../data/crs-rules";
import type { ClbLevel, CrsInput, CrsValidationErrors } from "../../types/crs";

export const clbLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const defaultLanguageScores = {
  reading: 0,
  writing: 0,
  speaking: 0,
  listening: 0,
} satisfies Record<string, ClbLevel>;

export const defaultCrsInput: CrsInput = {
  maritalStatus: "single",
  age: 30,
  educationLevel: "bachelors-or-three-plus",
  canadianEducationCredential: "none",
  firstOfficialLanguage: "english",
  firstLanguageScores: {
    reading: 8,
    writing: 8,
    speaking: 8,
    listening: 8,
  },
  secondLanguageScores: defaultLanguageScores,
  canadianWorkExperience: "none",
  foreignWorkExperience: "none",
  certificateOfQualification: "no",
  spouseEducationLevel: "less-than-secondary",
  spouseLanguageScores: defaultLanguageScores,
  spouseCanadianWorkExperience: "none",
  siblingInCanada: "no",
  provincialNomination: "no",
};

function isValidClb(value: number): value is ClbLevel {
  return clbLevels.includes(value as ClbLevel);
}

function validateLanguageScores(
  input: CrsInput,
  prefix: "firstLanguageScores" | "secondLanguageScores" | "spouseLanguageScores",
  errors: CrsValidationErrors,
) {
  const scores = input[prefix];

  for (const ability of ["reading", "writing", "speaking", "listening"] as const) {
    if (!isValidClb(scores[ability])) {
      errors[`${prefix}.${ability}`] = "Choose a CLB/NCLC level from 0 to 10.";
    }
  }
}

export function validateCrsInput(input: CrsInput): CrsValidationErrors {
  const errors: CrsValidationErrors = {};

  if (!Number.isInteger(input.age) || input.age < 0 || input.age > 150) {
    errors.age = "Enter an age between 0 and 150.";
  }

  if (!crsRules.education[input.educationLevel]) {
    errors.educationLevel = "Choose an education level.";
  }

  validateLanguageScores(input, "firstLanguageScores", errors);
  validateLanguageScores(input, "secondLanguageScores", errors);

  if (input.maritalStatus === "spouse-accompanying") {
    validateLanguageScores(input, "spouseLanguageScores", errors);
  }

  return errors;
}
