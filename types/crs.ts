export type MaritalStatus =
  | "single"
  | "spouse-accompanying"
  | "spouse-not-accompanying"
  | "spouse-citizen-or-pr";

export type OfficialLanguage = "english" | "french";

export type ClbLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type LanguageScores = {
  reading: ClbLevel;
  writing: ClbLevel;
  speaking: ClbLevel;
  listening: ClbLevel;
};

export type EducationLevel =
  | "less-than-secondary"
  | "secondary"
  | "one-year"
  | "two-year"
  | "bachelors-or-three-plus"
  | "two-or-more"
  | "masters-or-professional"
  | "doctoral";

export type CanadianEducationCredential = "none" | "one-or-two-year" | "three-plus";

export type CanadianWorkExperience =
  | "none"
  | "one-year"
  | "two-years"
  | "three-years"
  | "four-years"
  | "five-plus";

export type ForeignWorkExperience = "none" | "one-or-two-years" | "three-plus";

export type YesNo = "yes" | "no";

export type CrsInput = {
  maritalStatus: MaritalStatus;
  age: number;
  educationLevel: EducationLevel;
  canadianEducationCredential: CanadianEducationCredential;
  firstOfficialLanguage: OfficialLanguage;
  firstLanguageScores: LanguageScores;
  secondLanguageScores: LanguageScores;
  canadianWorkExperience: CanadianWorkExperience;
  foreignWorkExperience: ForeignWorkExperience;
  certificateOfQualification: YesNo;
  spouseEducationLevel: EducationLevel;
  spouseLanguageScores: LanguageScores;
  spouseCanadianWorkExperience: CanadianWorkExperience;
  siblingInCanada: YesNo;
  provincialNomination: YesNo;
};

export type CrsBreakdown = {
  coreHumanCapital: {
    age: number;
    education: number;
    firstOfficialLanguage: number;
    secondOfficialLanguage: number;
    canadianWorkExperience: number;
    total: number;
  };
  spouseFactors: {
    education: number;
    language: number;
    canadianWorkExperience: number;
    total: number;
  };
  skillTransferability: {
    educationLanguage: number;
    educationCanadianWork: number;
    foreignWorkLanguage: number;
    foreignWorkCanadianWork: number;
    certificateOfQualification: number;
    total: number;
  };
  additionalPoints: {
    siblingInCanada: number;
    frenchLanguageSkills: number;
    canadianEducation: number;
    provincialNomination: number;
    total: number;
  };
};

export type CrsResult = {
  total: number;
  breakdown: CrsBreakdown;
};

export type CrsValidationErrors = Partial<Record<keyof CrsInput | string, string>>;
