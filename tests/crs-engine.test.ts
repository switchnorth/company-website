import test from "node:test";
import assert from "node:assert/strict";
import { calculateCrsScore } from "../lib/crs/engine";
import { defaultCrsInput } from "../lib/crs/validation";
import type { CrsInput } from "../types/crs";

function score(overrides: Partial<CrsInput>) {
  return calculateCrsScore({
    ...defaultCrsInput,
    ...overrides,
  });
}

test("scores age boundary values without an accompanying spouse", () => {
  assert.equal(score({ age: 17 }).breakdown.coreHumanCapital.age, 0);
  assert.equal(score({ age: 18 }).breakdown.coreHumanCapital.age, 99);
  assert.equal(score({ age: 20 }).breakdown.coreHumanCapital.age, 110);
  assert.equal(score({ age: 29 }).breakdown.coreHumanCapital.age, 110);
  assert.equal(score({ age: 30 }).breakdown.coreHumanCapital.age, 105);
  assert.equal(score({ age: 44 }).breakdown.coreHumanCapital.age, 6);
  assert.equal(score({ age: 45 }).breakdown.coreHumanCapital.age, 0);
});

test("scores age boundary values with an accompanying spouse", () => {
  assert.equal(
    score({ age: 18, maritalStatus: "spouse-accompanying" }).breakdown
      .coreHumanCapital.age,
    90,
  );
  assert.equal(
    score({ age: 20, maritalStatus: "spouse-accompanying" }).breakdown
      .coreHumanCapital.age,
    100,
  );
  assert.equal(
    score({ age: 44, maritalStatus: "spouse-accompanying" }).breakdown
      .coreHumanCapital.age,
    5,
  );
});

test("caps second official language points for applicants with a spouse", () => {
  const result = score({
    maritalStatus: "spouse-accompanying",
    secondLanguageScores: {
      reading: 10,
      writing: 10,
      speaking: 10,
      listening: 10,
    },
  });

  assert.equal(result.breakdown.coreHumanCapital.secondOfficialLanguage, 22);
});

test("caps skill transferability at 100 points", () => {
  const result = score({
    educationLevel: "doctoral",
    firstLanguageScores: {
      reading: 10,
      writing: 10,
      speaking: 10,
      listening: 10,
    },
    canadianWorkExperience: "five-plus",
    foreignWorkExperience: "three-plus",
    certificateOfQualification: "yes",
  });

  assert.equal(result.breakdown.skillTransferability.total, 100);
});

test("adds current CRS additional points and excludes job offer scoring", () => {
  const result = score({
    provincialNomination: "yes",
    siblingInCanada: "yes",
    canadianEducationCredential: "three-plus",
    firstOfficialLanguage: "french",
    firstLanguageScores: {
      reading: 7,
      writing: 7,
      speaking: 7,
      listening: 7,
    },
    secondLanguageScores: {
      reading: 5,
      writing: 5,
      speaking: 5,
      listening: 5,
    },
  });

  assert.equal(result.breakdown.additionalPoints.provincialNomination, 600);
  assert.equal(result.breakdown.additionalPoints.siblingInCanada, 15);
  assert.equal(result.breakdown.additionalPoints.canadianEducation, 30);
  assert.equal(result.breakdown.additionalPoints.frenchLanguageSkills, 50);
  assert.equal(result.breakdown.additionalPoints.total, 600);
});
