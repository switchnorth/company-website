"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Send,
} from "lucide-react";
import { submitAssessmentForm } from "@/app/assessment/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fieldControlClasses,
  fieldErrorClasses,
  fieldHelpClasses,
  fieldLabelClasses,
} from "@/components/ui/form-styles";
import {
  assessmentFieldLabels,
  assessmentOptions,
  assessmentSteps,
  type AssessmentOption,
} from "@/data/assessment";
import {
  initialAssessmentData,
  validateAssessment,
  validateAssessmentStep,
} from "@/lib/assessment-validation";
import type {
  AssessmentErrors,
  AssessmentField,
  AssessmentFormData,
  AssessmentSubmitState,
} from "@/types/assessment";

const initialSubmitState: AssessmentSubmitState = {
  status: "idle",
  message: "",
  errors: {},
};

const totalSteps = assessmentSteps.length;
const reviewStepIndex = totalSteps - 1;

function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-1 text-accent-red">
      *
    </span>
  );
}

function OptionalText() {
  return <span className="ml-1 font-normal text-muted">(optional)</span>;
}

function SubmitButton({ submitted }: { submitted: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full sm:w-auto" disabled={pending || submitted} type="submit">
      <Send aria-hidden="true" size={18} />
      {submitted ? "Assessment Sent" : pending ? "Submitting..." : "Submit Assessment"}
    </Button>
  );
}

type FieldErrorProps = {
  children?: string;
  id: string;
};

function FieldError({ children, id }: FieldErrorProps) {
  if (!children) {
    return null;
  }

  return (
    <p className={fieldErrorClasses} id={id}>
      {children}
    </p>
  );
}

type TextInputProps = {
  autoComplete?: string;
  error?: string;
  field: AssessmentField;
  help?: string;
  label: string;
  maxLength?: number;
  onChange: (field: AssessmentField, value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "email" | "tel" | "text";
  value: string;
};

function TextInput({
  autoComplete,
  error,
  field,
  help,
  label,
  maxLength = 120,
  onChange,
  placeholder,
  required = true,
  type = "text",
  value,
}: TextInputProps) {
  const errorId = `${field}-error`;
  const helpId = help ? `${field}-help` : undefined;
  const describedBy = [helpId, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div>
      <label className={fieldLabelClasses} htmlFor={field}>
        {label}
        {required ? <RequiredMark /> : <OptionalText />}
      </label>
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className={fieldControlClasses}
        id={field}
        maxLength={maxLength}
        name={field}
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {help ? (
        <p className={fieldHelpClasses} id={helpId}>
          {help}
        </p>
      ) : null}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

type SelectInputProps = {
  error?: string;
  field: AssessmentField;
  label: string;
  onChange: (field: AssessmentField, value: string) => void;
  options: AssessmentOption[];
  value: string;
};

function SelectInput({
  error,
  field,
  label,
  onChange,
  options,
  value,
}: SelectInputProps) {
  const errorId = `${field}-error`;

  return (
    <div>
      <label className={fieldLabelClasses} htmlFor={field}>
        {label}
        <RequiredMark />
      </label>
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={fieldControlClasses}
        id={field}
        name={field}
        onChange={(event) => onChange(field, event.target.value)}
        required
        value={value}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

type TextareaInputProps = {
  error?: string;
  field: AssessmentField;
  help?: string;
  label: string;
  onChange: (field: AssessmentField, value: string) => void;
  value: string;
};

function TextareaInput({
  error,
  field,
  help,
  label,
  onChange,
  value,
}: TextareaInputProps) {
  const errorId = `${field}-error`;
  const helpId = help ? `${field}-help` : undefined;
  const describedBy = [helpId, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div>
      <label className={fieldLabelClasses} htmlFor={field}>
        {label}
        <OptionalText />
      </label>
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={`${fieldControlClasses} min-h-36 resize-y`}
        id={field}
        maxLength={2000}
        name={field}
        onChange={(event) => onChange(field, event.target.value)}
        value={value}
      />
      {help ? (
        <p className={fieldHelpClasses} id={helpId}>
          {help}
        </p>
      ) : null}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

type RadioGroupProps = {
  error?: string;
  field: AssessmentField;
  label: string;
  onChange: (field: AssessmentField, value: string) => void;
  options: AssessmentOption[];
  value: string;
};

function RadioGroup({
  error,
  field,
  label,
  onChange,
  options,
  value,
}: RadioGroupProps) {
  const errorId = `${field}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)}>
      <legend className="text-base font-semibold text-deep-ink">
        {label}
        <RequiredMark />
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-base font-semibold transition focus-within:ring-2 focus-within:ring-brand-teal/25 ${
              value === option.value
                ? "border-brand-teal bg-brand-teal-soft text-brand-teal"
                : "border-border bg-white text-deep-ink hover:border-brand-teal/40"
            }`}
            key={option.value}
          >
            <input
              checked={value === option.value}
              className="size-4 border-border text-brand-teal focus:ring-2 focus:ring-brand-teal/25"
              name={field}
              onChange={() => onChange(field, option.value)}
              required
              type="radio"
              value={option.value}
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </fieldset>
  );
}

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div aria-label="Assessment progress">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-semibold text-brand-teal">
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className="text-base text-muted">{Math.round(progress)}% complete</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-surface-soft">
        <div
          aria-label="Assessment completion"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress)}
          className="h-2 rounded-full bg-brand-teal transition-all duration-300"
          role="progressbar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-5 hidden grid-cols-4 gap-2 lg:grid">
        {assessmentSteps.map((step, index) => (
          <div
            className={`rounded-md border px-3 py-2 text-[13px] font-semibold ${
              index === currentStep
                ? "border-brand-teal bg-brand-teal text-white"
                : index < currentStep
                  ? "border-brand-teal/20 bg-brand-teal-soft text-brand-teal"
                  : "border-border bg-white text-muted"
            }`}
            key={step.id}
          >
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function getOptionLabel(options: AssessmentOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function getDisplayValue(field: AssessmentField, value: string) {
  if (!value) {
    return "Not provided";
  }

  const optionMap: Partial<Record<AssessmentField, AssessmentOption[]>> = {
    ageRange: assessmentOptions.ageRange,
    immigrationGoal: assessmentOptions.immigrationGoal,
    highestEducation: assessmentOptions.highestEducation,
    canadianEducation: assessmentOptions.educationStatus,
    foreignEducation: assessmentOptions.educationStatus,
    yearsExperience: assessmentOptions.yearsExperience,
    canadianWorkExperience: assessmentOptions.experienceStatus,
    foreignWorkExperience: assessmentOptions.experienceStatus,
    englishTestTaken: assessmentOptions.yesNoUnsure,
    englishTestType: assessmentOptions.englishTestType,
    frenchAbility: assessmentOptions.frenchAbility,
    frenchTestTaken: assessmentOptions.yesNoUnsure,
    currentStatusCanada: assessmentOptions.currentStatusCanada,
    canadianJobOffer: assessmentOptions.yesNoUnsure,
    provincialNomination: assessmentOptions.yesNoUnsure,
    familyInCanada: assessmentOptions.yesNoUnsure,
  };
  const options = optionMap[field];

  if (field === "consent") {
    return value === "yes" ? "Consent provided" : "Not provided";
  }

  return options ? getOptionLabel(options, value) : value;
}

function HiddenFields({ data }: { data: AssessmentFormData }) {
  return (
    <>
      {(Object.keys(data) as AssessmentField[]).map((field) => (
        <input key={field} name={field} type="hidden" value={data[field]} />
      ))}
    </>
  );
}

type StepContentProps = {
  data: AssessmentFormData;
  errors: AssessmentErrors;
  onChange: (field: AssessmentField, value: string) => void;
};

function PersonalStep({ data, errors, onChange }: StepContentProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          autoComplete="name"
          error={errors.fullName}
          field="fullName"
          label="Name"
          onChange={onChange}
          value={data.fullName}
        />
        <TextInput
          autoComplete="email"
          error={errors.email}
          field="email"
          label="Email"
          maxLength={160}
          onChange={onChange}
          type="email"
          value={data.email}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          autoComplete="tel"
          error={errors.phone}
          field="phone"
          label="Phone"
          onChange={onChange}
          required={false}
          type="tel"
          value={data.phone}
        />
        <SelectInput
          error={errors.ageRange}
          field="ageRange"
          label="Age range"
          onChange={onChange}
          options={assessmentOptions.ageRange}
          value={data.ageRange}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          autoComplete="country-name"
          error={errors.citizenshipCountry}
          field="citizenshipCountry"
          label="Country of citizenship"
          maxLength={80}
          onChange={onChange}
          value={data.citizenshipCountry}
        />
        <TextInput
          autoComplete="country-name"
          error={errors.residenceCountry}
          field="residenceCountry"
          label="Country of residence"
          maxLength={80}
          onChange={onChange}
          value={data.residenceCountry}
        />
      </div>
    </div>
  );
}

function GoalStep({ data, errors, onChange }: StepContentProps) {
  return (
    <RadioGroup
      error={errors.immigrationGoal}
      field="immigrationGoal"
      label="What is your main immigration goal?"
      onChange={onChange}
      options={assessmentOptions.immigrationGoal}
      value={data.immigrationGoal}
    />
  );
}

function EducationStep({ data, errors, onChange }: StepContentProps) {
  return (
    <div className="grid gap-5">
      <SelectInput
        error={errors.highestEducation}
        field="highestEducation"
        label="Highest education"
        onChange={onChange}
        options={assessmentOptions.highestEducation}
        value={data.highestEducation}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <SelectInput
          error={errors.canadianEducation}
          field="canadianEducation"
          label="Canadian education"
          onChange={onChange}
          options={assessmentOptions.educationStatus}
          value={data.canadianEducation}
        />
        <SelectInput
          error={errors.foreignEducation}
          field="foreignEducation"
          label="Foreign education"
          onChange={onChange}
          options={assessmentOptions.educationStatus}
          value={data.foreignEducation}
        />
      </div>
    </div>
  );
}

function WorkStep({ data, errors, onChange }: StepContentProps) {
  return (
    <div className="grid gap-5">
      <TextInput
        error={errors.occupation}
        field="occupation"
        label="Current occupation/job title"
        maxLength={120}
        onChange={onChange}
        value={data.occupation}
      />
      <SelectInput
        error={errors.yearsExperience}
        field="yearsExperience"
        label="Years of experience"
        onChange={onChange}
        options={assessmentOptions.yearsExperience}
        value={data.yearsExperience}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <SelectInput
          error={errors.canadianWorkExperience}
          field="canadianWorkExperience"
          label="Canadian work experience"
          onChange={onChange}
          options={assessmentOptions.experienceStatus}
          value={data.canadianWorkExperience}
        />
        <SelectInput
          error={errors.foreignWorkExperience}
          field="foreignWorkExperience"
          label="Foreign work experience"
          onChange={onChange}
          options={assessmentOptions.experienceStatus}
          value={data.foreignWorkExperience}
        />
      </div>
    </div>
  );
}

function LanguageStep({ data, errors, onChange }: StepContentProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <SelectInput
          error={errors.englishTestTaken}
          field="englishTestTaken"
          label="English test taken?"
          onChange={onChange}
          options={assessmentOptions.yesNoUnsure}
          value={data.englishTestTaken}
        />
        <SelectInput
          error={errors.englishTestType}
          field="englishTestType"
          label="CELPIP / IELTS / other"
          onChange={onChange}
          options={assessmentOptions.englishTestType}
          value={data.englishTestType}
        />
      </div>
      <TextInput
        error={errors.englishScores}
        field="englishScores"
        help="Optional. Example: overall band, CLB level, or individual scores if known."
        label="Optional scores"
        maxLength={220}
        onChange={onChange}
        required={false}
        value={data.englishScores}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <SelectInput
          error={errors.frenchAbility}
          field="frenchAbility"
          label="French ability"
          onChange={onChange}
          options={assessmentOptions.frenchAbility}
          value={data.frenchAbility}
        />
        <SelectInput
          error={errors.frenchTestTaken}
          field="frenchTestTaken"
          label="French test taken?"
          onChange={onChange}
          options={assessmentOptions.yesNoUnsure}
          value={data.frenchTestTaken}
        />
      </div>
    </div>
  );
}

function ConnectionsStep({ data, errors, onChange }: StepContentProps) {
  return (
    <div className="grid gap-5">
      <SelectInput
        error={errors.currentStatusCanada}
        field="currentStatusCanada"
        label="Current status in Canada"
        onChange={onChange}
        options={assessmentOptions.currentStatusCanada}
        value={data.currentStatusCanada}
      />
      <div className="grid gap-5 md:grid-cols-3">
        <SelectInput
          error={errors.canadianJobOffer}
          field="canadianJobOffer"
          label="Canadian job offer"
          onChange={onChange}
          options={assessmentOptions.yesNoUnsure}
          value={data.canadianJobOffer}
        />
        <SelectInput
          error={errors.provincialNomination}
          field="provincialNomination"
          label="Provincial nomination"
          onChange={onChange}
          options={assessmentOptions.yesNoUnsure}
          value={data.provincialNomination}
        />
        <SelectInput
          error={errors.familyInCanada}
          field="familyInCanada"
          label="Family in Canada"
          onChange={onChange}
          options={assessmentOptions.yesNoUnsure}
          value={data.familyInCanada}
        />
      </div>
    </div>
  );
}

function AdditionalStep({ data, errors, onChange }: StepContentProps) {
  return (
    <div className="grid gap-5">
      <TextareaInput
        error={errors.message}
        field="message"
        help="Optional. Do not include sensitive document numbers in this form."
        label="Message/comments"
        onChange={onChange}
        value={data.message}
      />
      <div>
        <label className="flex gap-3 rounded-md border border-border bg-surface-soft p-4 text-base leading-7 text-muted">
          <input
            aria-describedby={errors.consent ? "consent-error" : undefined}
            aria-invalid={Boolean(errors.consent)}
            checked={data.consent === "yes"}
            className="mt-1 size-4 rounded border-border text-brand-teal focus:ring-2 focus:ring-brand-teal/25"
            name="consent"
            onChange={(event) => onChange("consent", event.target.checked ? "yes" : "")}
            required
            type="checkbox"
            value="yes"
          />
          <span>
            <RequiredMark /> I consent to Switch North Immigration reviewing this information and
            contacting me about possible next steps. I understand this assessment
            is general intake and does not create a consultant-client relationship.
          </span>
        </label>
        <FieldError id="consent-error">{errors.consent}</FieldError>
      </div>
    </div>
  );
}

function ReviewStep({
  data,
  errors,
}: Pick<StepContentProps, "data" | "errors">) {
  const visibleSteps = assessmentSteps.filter((step) => step.id !== "review");

  return (
    <div className="grid gap-5">
      {Object.keys(errors).length > 0 ? (
        <div
          className="rounded-md border border-accent-red/25 bg-accent-red-soft p-4 text-base leading-7 text-accent-red-dark"
          role="alert"
        >
          <div className="flex gap-3">
            <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
            <p>Please go back and correct the highlighted fields before submitting.</p>
          </div>
        </div>
      ) : null}
      {visibleSteps.map((step) => (
        <Card className="p-5" key={step.id}>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {step.fields.map((field) => (
              <div className="rounded-md bg-surface-soft p-3" key={field}>
                <dt className="text-xs font-semibold uppercase text-muted">
                  {assessmentFieldLabels[field]}
                </dt>
                <dd className="mt-1 text-base leading-7 text-deep-ink">
                  {getDisplayValue(field, data[field])}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}

export function AssessmentForm() {
  const [data, setData] = useState<AssessmentFormData>(initialAssessmentData);
  const [currentStep, setCurrentStep] = useState(0);
  const [clientErrors, setClientErrors] = useState<AssessmentErrors>({});
  const [submitState, formAction] = useActionState(
    submitAssessmentForm,
    initialSubmitState,
  );
  const activeStep = assessmentSteps[currentStep];
  const mergedErrors = useMemo(
    () => ({ ...submitState.errors, ...clientErrors }),
    [clientErrors, submitState.errors],
  );
  const isReview = currentStep === reviewStepIndex;
  const isSuccess = submitState.status === "success";
  const isError = submitState.status === "error";

  function handleChange(field: AssessmentField, value: string) {
    const normalizedValue = field === "consent" && value !== "yes" ? "" : value;

    setData((current) => ({
      ...current,
      [field]: normalizedValue,
    }));
    setClientErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function goToPrevious() {
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  function goToNext() {
    const nextErrors = validateAssessmentStep(data, currentStep);

    if (Object.keys(nextErrors).length > 0) {
      setClientErrors(nextErrors);
      return;
    }

    setClientErrors({});
    setCurrentStep((step) => Math.min(reviewStepIndex, step + 1));
  }

  function goToReview() {
    const nextErrors = validateAssessment(data);

    if (Object.keys(nextErrors).length > 0) {
      setClientErrors(nextErrors);
      const firstStepWithError = assessmentSteps.findIndex((step) =>
        step.fields.some((field) => nextErrors[field]),
      );
      setCurrentStep(firstStepWithError >= 0 ? firstStepWithError : 0);
      return;
    }

    setClientErrors({});
    setCurrentStep(reviewStepIndex);
  }

  return (
    <Card className="p-5 sm:p-7">
      <form action={formAction} className="grid gap-8" noValidate>
        <input
          aria-hidden="true"
          autoComplete="off"
          className="hidden"
          name="company"
          tabIndex={-1}
          type="text"
        />
        <HiddenFields data={data} />
        <p className="text-sm leading-6 text-muted">
          <span aria-hidden="true" className="font-semibold text-accent-red">
            *
          </span>{" "}
          Required fields. Optional fields can still help with context when available.
        </p>
        <ProgressIndicator currentStep={currentStep} />

        {submitState.message ? (
          <div
            className={`rounded-md border p-4 text-base leading-7 ${
              isSuccess
                ? "border-brand-teal/25 bg-brand-teal-soft text-brand-teal"
                : "border-accent-red/25 bg-accent-red-soft text-accent-red-dark"
            }`}
            role={isError ? "alert" : "status"}
          >
            <div className="flex gap-3">
              {isSuccess ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                  size={18}
                />
              ) : (
                <AlertCircle
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                  size={18}
                />
              )}
              <p>{submitState.message}</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-2">
          <p className="text-sm font-semibold uppercase text-accent-red">
            {activeStep.id === "review" ? "Final Review" : "Assessment Intake"}
          </p>
          <h2 className="font-serif text-2xl leading-tight text-deep-ink md:text-3xl">
            {activeStep.title}
          </h2>
          <p className="max-w-2xl text-base leading-8 text-muted">
            {activeStep.description}
          </p>
        </div>

        {currentStep === 0 ? (
          <PersonalStep data={data} errors={mergedErrors} onChange={handleChange} />
        ) : null}
        {currentStep === 1 ? (
          <GoalStep data={data} errors={mergedErrors} onChange={handleChange} />
        ) : null}
        {currentStep === 2 ? (
          <EducationStep data={data} errors={mergedErrors} onChange={handleChange} />
        ) : null}
        {currentStep === 3 ? (
          <WorkStep data={data} errors={mergedErrors} onChange={handleChange} />
        ) : null}
        {currentStep === 4 ? (
          <LanguageStep data={data} errors={mergedErrors} onChange={handleChange} />
        ) : null}
        {currentStep === 5 ? (
          <ConnectionsStep data={data} errors={mergedErrors} onChange={handleChange} />
        ) : null}
        {currentStep === 6 ? (
          <AdditionalStep data={data} errors={mergedErrors} onChange={handleChange} />
        ) : null}
        {isReview ? <ReviewStep data={data} errors={mergedErrors} /> : null}

        <div className="grid gap-4 border-t border-border pt-6">
          <p className="text-sm leading-6 text-muted">
            This assessment does not calculate or promise eligibility. Information
            submitted here will be reviewed to help identify possible options and
            appropriate next steps. See the{" "}
            <Link className="focus-ring rounded-sm font-semibold text-brand-teal hover:text-accent-red" href="/privacy">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="focus-ring rounded-sm font-semibold text-brand-teal hover:text-accent-red" href="/terms">
              Terms
            </Link>
            .
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              disabled={currentStep === 0 || isSuccess}
              onClick={goToPrevious}
              type="button"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" size={18} />
              Previous
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!isReview ? (
                <>
                  {currentStep === reviewStepIndex - 1 ? (
                    <Button onClick={goToReview} type="button" variant="outline">
                      Review Answers
                    </Button>
                  ) : null}
                  <Button onClick={goToNext} type="button">
                    Continue
                    <ArrowRight aria-hidden="true" size={18} />
                  </Button>
                </>
              ) : (
                <SubmitButton submitted={isSuccess} />
              )}
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
