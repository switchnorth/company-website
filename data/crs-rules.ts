import type {
  CanadianEducationCredential,
  CanadianWorkExperience,
  EducationLevel,
  ForeignWorkExperience,
} from "../types/crs";

type AgeRange = {
  min: number;
  max: number;
  withSpouse: number;
  withoutSpouse: number;
};

type ClbRange = {
  min: number;
  max: number;
  withSpouse: number;
  withoutSpouse: number;
};

export const crsRules = {
  lastReviewed: "2026-09-11",
  officialCriteriaPageDate: "2026-06-22",
  sourceUrls: [
    "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html",
    "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-application-management-system/current.html",
  ],
  notes: [
    "CRS job offer points were removed by IRCC as of March 25, 2025.",
    "IRCC determines the official CRS score in the Express Entry system.",
  ],
  caps: {
    total: 1200,
    coreWithSpouse: 460,
    coreWithoutSpouse: 500,
    spouse: 40,
    skillTransferability: 100,
    additional: 600,
  },
  age: [
    { min: 0, max: 17, withSpouse: 0, withoutSpouse: 0 },
    { min: 18, max: 18, withSpouse: 90, withoutSpouse: 99 },
    { min: 19, max: 19, withSpouse: 95, withoutSpouse: 105 },
    { min: 20, max: 29, withSpouse: 100, withoutSpouse: 110 },
    { min: 30, max: 30, withSpouse: 95, withoutSpouse: 105 },
    { min: 31, max: 31, withSpouse: 90, withoutSpouse: 99 },
    { min: 32, max: 32, withSpouse: 85, withoutSpouse: 94 },
    { min: 33, max: 33, withSpouse: 80, withoutSpouse: 88 },
    { min: 34, max: 34, withSpouse: 75, withoutSpouse: 83 },
    { min: 35, max: 35, withSpouse: 70, withoutSpouse: 77 },
    { min: 36, max: 36, withSpouse: 65, withoutSpouse: 72 },
    { min: 37, max: 37, withSpouse: 60, withoutSpouse: 66 },
    { min: 38, max: 38, withSpouse: 55, withoutSpouse: 61 },
    { min: 39, max: 39, withSpouse: 50, withoutSpouse: 55 },
    { min: 40, max: 40, withSpouse: 45, withoutSpouse: 50 },
    { min: 41, max: 41, withSpouse: 35, withoutSpouse: 39 },
    { min: 42, max: 42, withSpouse: 25, withoutSpouse: 28 },
    { min: 43, max: 43, withSpouse: 15, withoutSpouse: 17 },
    { min: 44, max: 44, withSpouse: 5, withoutSpouse: 6 },
    { min: 45, max: 150, withSpouse: 0, withoutSpouse: 0 },
  ] satisfies AgeRange[],
  education: {
    "less-than-secondary": { withSpouse: 0, withoutSpouse: 0 },
    secondary: { withSpouse: 28, withoutSpouse: 30 },
    "one-year": { withSpouse: 84, withoutSpouse: 90 },
    "two-year": { withSpouse: 91, withoutSpouse: 98 },
    "bachelors-or-three-plus": { withSpouse: 112, withoutSpouse: 120 },
    "two-or-more": { withSpouse: 119, withoutSpouse: 128 },
    "masters-or-professional": { withSpouse: 126, withoutSpouse: 135 },
    doctoral: { withSpouse: 140, withoutSpouse: 150 },
  } satisfies Record<EducationLevel, { withSpouse: number; withoutSpouse: number }>,
  firstOfficialLanguage: [
    { min: 0, max: 3, withSpouse: 0, withoutSpouse: 0 },
    { min: 4, max: 5, withSpouse: 6, withoutSpouse: 6 },
    { min: 6, max: 6, withSpouse: 8, withoutSpouse: 9 },
    { min: 7, max: 7, withSpouse: 16, withoutSpouse: 17 },
    { min: 8, max: 8, withSpouse: 22, withoutSpouse: 23 },
    { min: 9, max: 9, withSpouse: 29, withoutSpouse: 31 },
    { min: 10, max: 10, withSpouse: 32, withoutSpouse: 34 },
  ] satisfies ClbRange[],
  secondOfficialLanguage: {
    capWithSpouse: 22,
    capWithoutSpouse: 24,
    points: [
      { min: 0, max: 4, withSpouse: 0, withoutSpouse: 0 },
      { min: 5, max: 6, withSpouse: 1, withoutSpouse: 1 },
      { min: 7, max: 8, withSpouse: 3, withoutSpouse: 3 },
      { min: 9, max: 10, withSpouse: 6, withoutSpouse: 6 },
    ] satisfies ClbRange[],
  },
  canadianWorkExperience: {
    none: { withSpouse: 0, withoutSpouse: 0 },
    "one-year": { withSpouse: 35, withoutSpouse: 40 },
    "two-years": { withSpouse: 46, withoutSpouse: 53 },
    "three-years": { withSpouse: 56, withoutSpouse: 64 },
    "four-years": { withSpouse: 63, withoutSpouse: 72 },
    "five-plus": { withSpouse: 70, withoutSpouse: 80 },
  } satisfies Record<
    CanadianWorkExperience,
    { withSpouse: number; withoutSpouse: number }
  >,
  spouse: {
    education: {
      "less-than-secondary": 0,
      secondary: 2,
      "one-year": 6,
      "two-year": 7,
      "bachelors-or-three-plus": 8,
      "two-or-more": 9,
      "masters-or-professional": 10,
      doctoral: 10,
    } satisfies Record<EducationLevel, number>,
    languagePerAbility: [
      { min: 0, max: 4, points: 0 },
      { min: 5, max: 6, points: 1 },
      { min: 7, max: 8, points: 3 },
      { min: 9, max: 10, points: 5 },
    ],
    canadianWorkExperience: {
      none: 0,
      "one-year": 5,
      "two-years": 7,
      "three-years": 8,
      "four-years": 9,
      "five-plus": 10,
    } satisfies Record<CanadianWorkExperience, number>,
  },
  educationTransferabilityGroup: {
    "less-than-secondary": "secondary-or-less",
    secondary: "secondary-or-less",
    "one-year": "post-secondary-one-plus",
    "two-year": "post-secondary-one-plus",
    "bachelors-or-three-plus": "post-secondary-one-plus",
    "two-or-more": "advanced-post-secondary",
    "masters-or-professional": "advanced-post-secondary",
    doctoral: "advanced-post-secondary",
  } satisfies Record<
    EducationLevel,
    "secondary-or-less" | "post-secondary-one-plus" | "advanced-post-secondary"
  >,
  transferability: {
    educationLanguage: {
      "secondary-or-less": { clb7: 0, clb9: 0 },
      "post-secondary-one-plus": { clb7: 13, clb9: 25 },
      "advanced-post-secondary": { clb7: 25, clb9: 50 },
    },
    educationCanadianWork: {
      "secondary-or-less": { oneYear: 0, twoPlus: 0 },
      "post-secondary-one-plus": { oneYear: 13, twoPlus: 25 },
      "advanced-post-secondary": { oneYear: 25, twoPlus: 50 },
    },
    foreignWorkLanguage: {
      none: { clb7: 0, clb9: 0 },
      "one-or-two-years": { clb7: 13, clb9: 25 },
      "three-plus": { clb7: 25, clb9: 50 },
    } satisfies Record<ForeignWorkExperience, { clb7: number; clb9: number }>,
    foreignWorkCanadianWork: {
      none: { oneYear: 0, twoPlus: 0 },
      "one-or-two-years": { oneYear: 13, twoPlus: 25 },
      "three-plus": { oneYear: 25, twoPlus: 50 },
    } satisfies Record<ForeignWorkExperience, { oneYear: number; twoPlus: number }>,
    certificateOfQualification: {
      clb5: 25,
      clb7: 50,
    },
  },
  additional: {
    siblingInCanada: 15,
    frenchLanguageLowOrNoEnglish: 25,
    frenchLanguageEnglishClb5: 50,
    canadianEducation: {
      none: 0,
      "one-or-two-year": 15,
      "three-plus": 30,
    } satisfies Record<CanadianEducationCredential, number>,
    provincialNomination: 600,
  },
};

export const crsSelectOptions = {
  maritalStatus: [
    { label: "Single, divorced, widowed, or no accompanying partner", value: "single" },
    { label: "Spouse or common-law partner accompanying", value: "spouse-accompanying" },
    { label: "Spouse or partner not accompanying", value: "spouse-not-accompanying" },
    {
      label: "Spouse or partner is a Canadian citizen or permanent resident",
      value: "spouse-citizen-or-pr",
    },
  ],
  officialLanguage: [
    { label: "English", value: "english" },
    { label: "French", value: "french" },
  ],
  educationLevel: [
    { label: "Less than secondary school", value: "less-than-secondary" },
    { label: "Secondary diploma", value: "secondary" },
    { label: "One-year degree, diploma, or certificate", value: "one-year" },
    { label: "Two-year program", value: "two-year" },
    {
      label: "Bachelor's degree or three-year or longer program",
      value: "bachelors-or-three-plus",
    },
    { label: "Two or more credentials, one three years or longer", value: "two-or-more" },
    {
      label: "Master's or entry-to-practice professional degree",
      value: "masters-or-professional",
    },
    { label: "Doctoral degree", value: "doctoral" },
  ],
  canadianEducationCredential: [
    { label: "None", value: "none" },
    { label: "Canadian credential of one or two years", value: "one-or-two-year" },
    { label: "Canadian credential of three years or longer", value: "three-plus" },
  ],
  canadianWorkExperience: [
    { label: "None or less than one year", value: "none" },
    { label: "1 year", value: "one-year" },
    { label: "2 years", value: "two-years" },
    { label: "3 years", value: "three-years" },
    { label: "4 years", value: "four-years" },
    { label: "5 years or more", value: "five-plus" },
  ],
  foreignWorkExperience: [
    { label: "No foreign work experience", value: "none" },
    { label: "1 or 2 years", value: "one-or-two-years" },
    { label: "3 years or more", value: "three-plus" },
  ],
  yesNo: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};
