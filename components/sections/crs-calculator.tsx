"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Info,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fieldControlClasses,
  fieldErrorClasses,
  fieldLabelClasses,
} from "@/components/ui/form-styles";
import { SectionHeading } from "@/components/ui/section-heading";
import { crsRules, crsSelectOptions } from "@/data/crs-rules";
import { siteConfig } from "@/data/site";
import { calculateCrsScore } from "@/lib/crs/engine";
import {
  clbLevels,
  defaultCrsInput,
  validateCrsInput,
} from "@/lib/crs/validation";
import type {
  ClbLevel,
  CrsBreakdown,
  CrsInput,
  EducationLevel,
  LanguageScores,
} from "@/types/crs";

const abilities = ["reading", "writing", "speaking", "listening"] as const;

type SelectOption = {
  label: string;
  value: string;
};

function optionLabel(options: SelectOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

type SelectFieldProps = {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

function SelectField({
  error,
  label,
  onChange,
  options,
  value,
}: SelectFieldProps) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div>
      <label className={fieldLabelClasses} htmlFor={id}>
        {label}
      </label>
      <select
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        className={fieldControlClasses}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className={fieldErrorClasses} id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type LanguageGroupProps = {
  errors: Record<string, string | undefined>;
  languageScores: LanguageScores;
  legend: string;
  name: "firstLanguageScores" | "secondLanguageScores" | "spouseLanguageScores";
  onChange: (
    group: "firstLanguageScores" | "secondLanguageScores" | "spouseLanguageScores",
    ability: keyof LanguageScores,
    value: ClbLevel,
  ) => void;
};

function LanguageGroup({
  errors,
  languageScores,
  legend,
  name,
  onChange,
}: LanguageGroupProps) {
  return (
    <fieldset>
      <legend className={fieldLabelClasses}>{legend}</legend>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {abilities.map((ability) => {
          const fieldKey = `${name}.${ability}`;

          return (
            <div key={ability}>
              <label
                className="text-xs font-semibold uppercase text-muted"
                htmlFor={fieldKey}
              >
                {ability}
              </label>
              <select
                aria-describedby={errors[fieldKey] ? `${fieldKey}-error` : undefined}
                aria-invalid={Boolean(errors[fieldKey])}
                className={fieldControlClasses}
                id={fieldKey}
                onChange={(event) =>
                  onChange(name, ability, Number(event.target.value) as ClbLevel)
                }
                value={languageScores[ability]}
              >
                {clbLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors[fieldKey] ? (
                <p className={fieldErrorClasses} id={`${fieldKey}-error`}>
                  {errors[fieldKey]}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

type ResultRowProps = {
  label: string;
  points: number;
};

function ResultRow({ label, points }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2 last:border-b-0">
      <dt className="text-sm leading-6 text-muted">{label}</dt>
      <dd className="font-semibold text-deep-ink">{points}</dd>
    </div>
  );
}

type BreakdownCardProps = {
  items: Array<{ label: string; points: number }>;
  title: string;
  total: number;
};

function BreakdownCard({ items, title, total }: BreakdownCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-deep-ink">{title}</h3>
        <span className="rounded-md bg-brand-teal-soft px-3 py-1 text-sm font-semibold text-brand-teal">
          {total}
        </span>
      </div>
      <dl className="mt-4">
        {items.map((item) => (
          <ResultRow key={item.label} label={item.label} points={item.points} />
        ))}
      </dl>
    </Card>
  );
}

function resultCards(breakdown: CrsBreakdown) {
  return [
    {
      title: "Core/Human Capital",
      total: breakdown.coreHumanCapital.total,
      items: [
        { label: "Age", points: breakdown.coreHumanCapital.age },
        { label: "Education", points: breakdown.coreHumanCapital.education },
        {
          label: "First official language",
          points: breakdown.coreHumanCapital.firstOfficialLanguage,
        },
        {
          label: "Second official language",
          points: breakdown.coreHumanCapital.secondOfficialLanguage,
        },
        {
          label: "Canadian work experience",
          points: breakdown.coreHumanCapital.canadianWorkExperience,
        },
      ],
    },
    {
      title: "Spouse Factors",
      total: breakdown.spouseFactors.total,
      items: [
        { label: "Spouse education", points: breakdown.spouseFactors.education },
        { label: "Spouse language", points: breakdown.spouseFactors.language },
        {
          label: "Spouse Canadian work",
          points: breakdown.spouseFactors.canadianWorkExperience,
        },
      ],
    },
    {
      title: "Skill Transferability",
      total: breakdown.skillTransferability.total,
      items: [
        {
          label: "Education and language",
          points: breakdown.skillTransferability.educationLanguage,
        },
        {
          label: "Education and Canadian work",
          points: breakdown.skillTransferability.educationCanadianWork,
        },
        {
          label: "Foreign work and language",
          points: breakdown.skillTransferability.foreignWorkLanguage,
        },
        {
          label: "Foreign and Canadian work",
          points: breakdown.skillTransferability.foreignWorkCanadianWork,
        },
        {
          label: "Certificate of qualification",
          points: breakdown.skillTransferability.certificateOfQualification,
        },
      ],
    },
    {
      title: "Additional Points",
      total: breakdown.additionalPoints.total,
      items: [
        {
          label: "Sibling in Canada",
          points: breakdown.additionalPoints.siblingInCanada,
        },
        {
          label: "French language skills",
          points: breakdown.additionalPoints.frenchLanguageSkills,
        },
        {
          label: "Canadian education",
          points: breakdown.additionalPoints.canadianEducation,
        },
        {
          label: "Provincial nomination",
          points: breakdown.additionalPoints.provincialNomination,
        },
      ],
    },
  ];
}

export function CrsCalculator() {
  const [input, setInput] = useState<CrsInput>(defaultCrsInput);
  const errors = validateCrsInput(input);
  const result = useMemo(() => calculateCrsScore(input), [input]);
  const hasErrors = Object.keys(errors).length > 0;
  const hasSpouse = input.maritalStatus === "spouse-accompanying";
  const secondLanguageName = input.firstOfficialLanguage === "english" ? "French" : "English";

  function updateField<Key extends keyof CrsInput>(field: Key, value: CrsInput[Key]) {
    setInput((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateLanguageScore(
    group: "firstLanguageScores" | "secondLanguageScores" | "spouseLanguageScores",
    ability: keyof LanguageScores,
    value: ClbLevel,
  ) {
    setInput((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [ability]: value,
      },
    }));
  }

  const breakdownCards = resultCards(result.breakdown);

  return (
    <>
      <Card className="border-brand-teal/20 bg-brand-navy text-white lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold uppercase text-brand-mint">
              Estimated CRS score
            </p>
            <p className="mt-1 text-5xl font-semibold leading-none">
              {hasErrors ? "--" : result.total}
            </p>
          </div>
          <div className="grid size-12 place-items-center rounded-md bg-white/12">
            <Calculator aria-hidden="true" size={23} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/78">
          Informational estimate only. IRCC determines the official CRS score.
        </p>
        <details className="mt-4 rounded-md border border-white/15 bg-white/8 p-4">
          <summary className="focus-ring cursor-pointer rounded-sm text-base font-semibold">
            View category totals
          </summary>
          <dl className="mt-4 grid gap-2">
            {breakdownCards.map((card) => (
              <div
                className="flex items-center justify-between gap-4 border-b border-white/10 pb-2 last:border-b-0 last:pb-0"
                key={card.title}
              >
                <dt className="text-sm text-white/76">{card.title}</dt>
                <dd className="font-semibold text-white">{card.total}</dd>
              </div>
            ))}
          </dl>
        </details>
        <div className="mt-5 grid gap-3">
          <ButtonLink href={siteConfig.bookingUrl} variant="light">
            {siteConfig.consultationCta}
          </ButtonLink>
          <ButtonLink
            href="/assessment"
            variant="outlineOnDark"
          >
            {siteConfig.secondaryCta}
          </ButtonLink>
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile basics</CardTitle>
            <CardDescription>
              CRS points change depending on whether a spouse or common-law partner
              is accompanying you to Canada.
            </CardDescription>
          </CardHeader>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <SelectField
              label="Marital status"
              onChange={(value) =>
                updateField("maritalStatus", value as CrsInput["maritalStatus"])
              }
              options={crsSelectOptions.maritalStatus}
              value={input.maritalStatus}
            />
            <div>
              <label className={fieldLabelClasses} htmlFor="age">
                Age
              </label>
              <input
                aria-describedby={errors.age ? "age-error" : undefined}
                aria-invalid={Boolean(errors.age)}
                className={fieldControlClasses}
                id="age"
                max={150}
                min={0}
                onChange={(event) =>
                  updateField("age", Number.parseInt(event.target.value, 10) || 0)
                }
                type="number"
                value={input.age}
              />
              {errors.age ? (
                <p className={fieldErrorClasses} id="age-error">
                  {errors.age}
                </p>
              ) : null}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education and experience</CardTitle>
            <CardDescription>
              Choose the closest CRS category. Use verified education credential
              assessments and current IRCC instructions for official profile entries.
            </CardDescription>
          </CardHeader>
          <div className="mt-6 grid gap-5">
            <SelectField
              error={errors.educationLevel}
              label="Level of education"
              onChange={(value) =>
                updateField("educationLevel", value as EducationLevel)
              }
              options={crsSelectOptions.educationLevel}
              value={input.educationLevel}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Canadian education"
                onChange={(value) =>
                  updateField(
                    "canadianEducationCredential",
                    value as CrsInput["canadianEducationCredential"],
                  )
                }
                options={crsSelectOptions.canadianEducationCredential}
                value={input.canadianEducationCredential}
              />
              <SelectField
                label="Canadian work experience"
                onChange={(value) =>
                  updateField(
                    "canadianWorkExperience",
                    value as CrsInput["canadianWorkExperience"],
                  )
                }
                options={crsSelectOptions.canadianWorkExperience}
                value={input.canadianWorkExperience}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Foreign work experience"
                onChange={(value) =>
                  updateField(
                    "foreignWorkExperience",
                    value as CrsInput["foreignWorkExperience"],
                  )
                }
                options={crsSelectOptions.foreignWorkExperience}
                value={input.foreignWorkExperience}
              />
              <SelectField
                label="Trade certificate of qualification"
                onChange={(value) =>
                  updateField(
                    "certificateOfQualification",
                    value as CrsInput["certificateOfQualification"],
                  )
                }
                options={crsSelectOptions.yesNo}
                value={input.certificateOfQualification}
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Official languages</CardTitle>
            <CardDescription>
              Enter CLB/NCLC levels for each ability. This calculator does not
              convert test scores from IELTS, CELPIP, TEF, or TCF.
            </CardDescription>
          </CardHeader>
          <div className="mt-6 grid gap-6">
            <SelectField
              label="First official language"
              onChange={(value) =>
                updateField("firstOfficialLanguage", value as CrsInput["firstOfficialLanguage"])
              }
              options={crsSelectOptions.officialLanguage}
              value={input.firstOfficialLanguage}
            />
            <LanguageGroup
              errors={errors}
              languageScores={input.firstLanguageScores}
              legend={`${optionLabel(
                crsSelectOptions.officialLanguage,
                input.firstOfficialLanguage,
              )} CLB/NCLC levels`}
              name="firstLanguageScores"
              onChange={updateLanguageScore}
            />
            <LanguageGroup
              errors={errors}
              languageScores={input.secondLanguageScores}
              legend={`${secondLanguageName} CLB/NCLC levels, if tested`}
              name="secondLanguageScores"
              onChange={updateLanguageScore}
            />
          </div>
        </Card>

        {hasSpouse ? (
          <Card>
            <CardHeader>
              <CardTitle>Spouse or common-law partner factors</CardTitle>
              <CardDescription>
                These factors apply only when the spouse or common-law partner is
                accompanying and is not a Canadian citizen or permanent resident.
              </CardDescription>
            </CardHeader>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Spouse education"
                  onChange={(value) =>
                    updateField("spouseEducationLevel", value as EducationLevel)
                  }
                  options={crsSelectOptions.educationLevel}
                  value={input.spouseEducationLevel}
                />
                <SelectField
                  label="Spouse Canadian work experience"
                  onChange={(value) =>
                    updateField(
                      "spouseCanadianWorkExperience",
                      value as CrsInput["spouseCanadianWorkExperience"],
                    )
                  }
                  options={crsSelectOptions.canadianWorkExperience}
                  value={input.spouseCanadianWorkExperience}
                />
              </div>
              <LanguageGroup
                errors={errors}
                languageScores={input.spouseLanguageScores}
                legend="Spouse first official language CLB/NCLC levels"
                name="spouseLanguageScores"
                onChange={updateLanguageScore}
              />
            </div>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Additional points</CardTitle>
            <CardDescription>
              Current CRS additional factors include nomination, Canadian education,
              sibling in Canada, and French-language points. Job offer CRS points are
              no longer assigned.
            </CardDescription>
          </CardHeader>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <SelectField
              label="Brother or sister in Canada"
              onChange={(value) =>
                updateField("siblingInCanada", value as CrsInput["siblingInCanada"])
              }
              options={crsSelectOptions.yesNo}
              value={input.siblingInCanada}
            />
            <SelectField
              label="Provincial or territorial nomination"
              onChange={(value) =>
                updateField(
                  "provincialNomination",
                  value as CrsInput["provincialNomination"],
                )
              }
              options={crsSelectOptions.yesNo}
              value={input.provincialNomination}
            />
          </div>
        </Card>
      </div>

      <aside className="grid gap-5 lg:sticky lg:top-24">
        <Card className="hidden bg-brand-navy text-white lg:block">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-md bg-white/12">
              <Calculator aria-hidden="true" size={22} />
            </div>
            <div>
              <p className="text-[15px] font-semibold uppercase text-brand-mint">
                Estimated CRS score
              </p>
              <p className="mt-1 text-5xl font-semibold leading-none">
                {hasErrors ? "--" : result.total}
              </p>
            </div>
          </div>
          <p className="mt-5 text-base leading-8 text-white/78">
            This is an informational estimate. IRCC determines the official CRS
            score in the Express Entry system.
          </p>
          <div className="mt-6 grid gap-3">
            <ButtonLink href={siteConfig.bookingUrl} variant="light">
              {siteConfig.consultationCta}
            </ButtonLink>
            <ButtonLink
              href="/assessment"
              variant="outlineOnDark"
            >
              {siteConfig.secondaryCta}
            </ButtonLink>
          </div>
        </Card>

        {hasErrors ? (
          <Card className="border-accent-red/25 bg-accent-red-soft">
            <div className="flex gap-3 text-base leading-7 text-accent-red-dark">
              <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
              <p>Review the highlighted fields before relying on the estimate.</p>
            </div>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Rule review</CardTitle>
            <CardDescription>
              Last reviewed: {crsRules.lastReviewed}. Official criteria page date:
              {" "}
              {crsRules.officialCriteriaPageDate}.
            </CardDescription>
          </CardHeader>
          <div className="mt-5 grid gap-3 text-base leading-7 text-muted">
            {crsRules.notes.map((note) => (
              <div className="flex gap-2" key={note}>
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-brand-teal"
                  size={16}
                />
                <p>{note}</p>
              </div>
            ))}
          </div>
          <a
            className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-teal hover:text-accent-red"
            href={crsRules.sourceUrls[0]}
            rel="noreferrer"
            target="_blank"
          >
            Official CRS criteria
            <ExternalLink aria-hidden="true" size={16} />
          </a>
        </Card>
      </aside>

      <div className="grid gap-5 lg:col-span-2">
        <SectionHeading
          eyebrow="Score Breakdown"
          title="How the estimate is grouped."
          description="The calculator separates the same major CRS categories used by IRCC: core/human capital, spouse factors, skill transferability, and additional points."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {breakdownCards.map((card) => (
            <BreakdownCard
              items={card.items}
              key={card.title}
              title={card.title}
              total={card.total}
            />
          ))}
        </div>
        <Card className="bg-surface-soft">
          <div className="flex gap-3 text-base leading-8 text-muted">
            <Info aria-hidden="true" className="mt-1 shrink-0 text-brand-teal" size={18} />
            <p>
              This calculator is not legal advice and does not confirm Express Entry
              eligibility. Official scoring depends on the information accepted in
              your IRCC profile and current program instructions.
            </p>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}
