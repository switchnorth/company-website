import { crsRules } from "../../data/crs-rules";
import type {
  CanadianWorkExperience,
  CrsBreakdown,
  CrsInput,
  CrsResult,
  LanguageScores,
} from "../../types/crs";

function hasAccompanyingSpouse(input: CrsInput) {
  return input.maritalStatus === "spouse-accompanying";
}

function spouseKey(input: CrsInput) {
  return hasAccompanyingSpouse(input) ? "withSpouse" : "withoutSpouse";
}

function scoreRange(
  value: number,
  ranges: Array<{ min: number; max: number; withSpouse: number; withoutSpouse: number }>,
  key: "withSpouse" | "withoutSpouse",
) {
  return ranges.find((range) => value >= range.min && value <= range.max)?.[key] ?? 0;
}

function scoreLanguageAbility(
  clb: number,
  ranges: Array<{ min: number; max: number; withSpouse: number; withoutSpouse: number }>,
  key: "withSpouse" | "withoutSpouse",
) {
  return scoreRange(clb, ranges, key);
}

function languageValues(scores: LanguageScores) {
  return [scores.reading, scores.writing, scores.speaking, scores.listening];
}

function scoreLanguageTotal(
  scores: LanguageScores,
  ranges: Array<{ min: number; max: number; withSpouse: number; withoutSpouse: number }>,
  key: "withSpouse" | "withoutSpouse",
  cap?: number,
) {
  const total = languageValues(scores).reduce<number>(
    (sum, clb) => sum + scoreLanguageAbility(clb, ranges, key),
    0,
  );

  return cap === undefined ? total : Math.min(total, cap);
}

function scoreSpouseLanguage(scores: LanguageScores) {
  return languageValues(scores).reduce<number>((sum, clb) => {
    const points =
      crsRules.spouse.languagePerAbility.find(
        (range) => clb >= range.min && clb <= range.max,
      )?.points ?? 0;

    return sum + points;
  }, 0);
}

function hasCanadianWorkAtLeast(
  value: CanadianWorkExperience,
  years: 1 | 2,
) {
  const rank: Record<CanadianWorkExperience, number> = {
    none: 0,
    "one-year": 1,
    "two-years": 2,
    "three-years": 3,
    "four-years": 4,
    "five-plus": 5,
  };

  return rank[value] >= years;
}

function allAtLeast(scores: LanguageScores, minimum: number) {
  return languageValues(scores).every((score) => score >= minimum);
}

function allAtMost(scores: LanguageScores, maximum: number) {
  return languageValues(scores).every((score) => score <= maximum);
}

function scoreEducationLanguage(input: CrsInput) {
  const group = crsRules.educationTransferabilityGroup[input.educationLevel];

  if (allAtLeast(input.firstLanguageScores, 9)) {
    return crsRules.transferability.educationLanguage[group].clb9;
  }

  if (allAtLeast(input.firstLanguageScores, 7)) {
    return crsRules.transferability.educationLanguage[group].clb7;
  }

  return 0;
}

function scoreEducationCanadianWork(input: CrsInput) {
  const group = crsRules.educationTransferabilityGroup[input.educationLevel];

  if (hasCanadianWorkAtLeast(input.canadianWorkExperience, 2)) {
    return crsRules.transferability.educationCanadianWork[group].twoPlus;
  }

  if (hasCanadianWorkAtLeast(input.canadianWorkExperience, 1)) {
    return crsRules.transferability.educationCanadianWork[group].oneYear;
  }

  return 0;
}

function scoreForeignWorkLanguage(input: CrsInput) {
  const foreignWork = crsRules.transferability.foreignWorkLanguage[
    input.foreignWorkExperience
  ];

  if (allAtLeast(input.firstLanguageScores, 9)) {
    return foreignWork.clb9;
  }

  if (allAtLeast(input.firstLanguageScores, 7)) {
    return foreignWork.clb7;
  }

  return 0;
}

function scoreForeignWorkCanadianWork(input: CrsInput) {
  const foreignWork = crsRules.transferability.foreignWorkCanadianWork[
    input.foreignWorkExperience
  ];

  if (hasCanadianWorkAtLeast(input.canadianWorkExperience, 2)) {
    return foreignWork.twoPlus;
  }

  if (hasCanadianWorkAtLeast(input.canadianWorkExperience, 1)) {
    return foreignWork.oneYear;
  }

  return 0;
}

function scoreCertificateOfQualification(input: CrsInput) {
  if (input.certificateOfQualification !== "yes") {
    return 0;
  }

  if (allAtLeast(input.firstLanguageScores, 7)) {
    return crsRules.transferability.certificateOfQualification.clb7;
  }

  if (allAtLeast(input.firstLanguageScores, 5)) {
    return crsRules.transferability.certificateOfQualification.clb5;
  }

  return 0;
}

function scoreFrenchAdditional(input: CrsInput) {
  const frenchScores =
    input.firstOfficialLanguage === "french"
      ? input.firstLanguageScores
      : input.secondLanguageScores;
  const englishScores =
    input.firstOfficialLanguage === "english"
      ? input.firstLanguageScores
      : input.secondLanguageScores;

  if (!allAtLeast(frenchScores, 7)) {
    return 0;
  }

  if (allAtLeast(englishScores, 5)) {
    return crsRules.additional.frenchLanguageEnglishClb5;
  }

  if (allAtMost(englishScores, 4)) {
    return crsRules.additional.frenchLanguageLowOrNoEnglish;
  }

  return 0;
}

export function calculateCrsScore(input: CrsInput): CrsResult {
  const key = spouseKey(input);
  const withSpouse = hasAccompanyingSpouse(input);
  const secondLanguageCap = withSpouse
    ? crsRules.secondOfficialLanguage.capWithSpouse
    : crsRules.secondOfficialLanguage.capWithoutSpouse;

  const coreHumanCapital: CrsBreakdown["coreHumanCapital"] = {
    age: scoreRange(input.age, crsRules.age, key),
    education: crsRules.education[input.educationLevel][key],
    firstOfficialLanguage: scoreLanguageTotal(
      input.firstLanguageScores,
      crsRules.firstOfficialLanguage,
      key,
    ),
    secondOfficialLanguage: scoreLanguageTotal(
      input.secondLanguageScores,
      crsRules.secondOfficialLanguage.points,
      key,
      secondLanguageCap,
    ),
    canadianWorkExperience: crsRules.canadianWorkExperience[
      input.canadianWorkExperience
    ][key],
    total: 0,
  };
  coreHumanCapital.total =
    coreHumanCapital.age +
    coreHumanCapital.education +
    coreHumanCapital.firstOfficialLanguage +
    coreHumanCapital.secondOfficialLanguage +
    coreHumanCapital.canadianWorkExperience;

  const spouseFactors: CrsBreakdown["spouseFactors"] = {
    education: withSpouse ? crsRules.spouse.education[input.spouseEducationLevel] : 0,
    language: withSpouse ? scoreSpouseLanguage(input.spouseLanguageScores) : 0,
    canadianWorkExperience: withSpouse
      ? crsRules.spouse.canadianWorkExperience[input.spouseCanadianWorkExperience]
      : 0,
    total: 0,
  };
  spouseFactors.total =
    spouseFactors.education +
    spouseFactors.language +
    spouseFactors.canadianWorkExperience;

  const skillTransferability: CrsBreakdown["skillTransferability"] = {
    educationLanguage: scoreEducationLanguage(input),
    educationCanadianWork: scoreEducationCanadianWork(input),
    foreignWorkLanguage: scoreForeignWorkLanguage(input),
    foreignWorkCanadianWork: scoreForeignWorkCanadianWork(input),
    certificateOfQualification: scoreCertificateOfQualification(input),
    total: 0,
  };
  skillTransferability.total = Math.min(
    crsRules.caps.skillTransferability,
    skillTransferability.educationLanguage +
      skillTransferability.educationCanadianWork +
      skillTransferability.foreignWorkLanguage +
      skillTransferability.foreignWorkCanadianWork +
      skillTransferability.certificateOfQualification,
  );

  const additionalPoints: CrsBreakdown["additionalPoints"] = {
    siblingInCanada:
      input.siblingInCanada === "yes" ? crsRules.additional.siblingInCanada : 0,
    frenchLanguageSkills: scoreFrenchAdditional(input),
    canadianEducation:
      crsRules.additional.canadianEducation[input.canadianEducationCredential],
    provincialNomination:
      input.provincialNomination === "yes"
        ? crsRules.additional.provincialNomination
        : 0,
    total: 0,
  };
  additionalPoints.total = Math.min(
    crsRules.caps.additional,
    additionalPoints.siblingInCanada +
      additionalPoints.frenchLanguageSkills +
      additionalPoints.canadianEducation +
      additionalPoints.provincialNomination,
  );

  const total =
    coreHumanCapital.total +
    spouseFactors.total +
    skillTransferability.total +
    additionalPoints.total;

  return {
    total: Math.min(total, crsRules.caps.total),
    breakdown: {
      coreHumanCapital,
      spouseFactors,
      skillTransferability,
      additionalPoints,
    },
  };
}
