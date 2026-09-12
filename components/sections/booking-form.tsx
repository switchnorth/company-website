"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Info,
} from "lucide-react";
import { submitBookingForm } from "@/app/consultation/actions";
import { contactInterestOptions } from "@/data/contact";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  fieldControlClasses,
  fieldErrorClasses,
  fieldHelpClasses,
  fieldLabelClasses,
} from "@/components/ui/form-styles";
import type {
  AvailabilitySlot,
  BookingFormErrors,
  BookingFormState,
  BookingRequest,
  ConsultationType,
} from "@/types/booking";

const initialState: BookingFormState = {
  status: "idle",
  message: "",
  errors: {},
};

const steps = [
  "Consultation",
  "Date & Time",
  "Your Information",
  "Payment",
  "Confirmation",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(new Date(`${date}T12:00:00Z`));
}

function SubmitButton({ submitted }: { submitted: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending || submitted} type="submit">
      <CreditCard aria-hidden="true" size={18} />
      {pending ? "Preparing..." : "Proceed to Payment"}
    </Button>
  );
}

function FieldError({ children, id }: { children?: string; id: string }) {
  if (!children) {
    return null;
  }

  return (
    <p className={fieldErrorClasses} id={id}>
      {children}
    </p>
  );
}

function getInitialValues(
  consultationTypes: ConsultationType[],
  slotsByType: Record<string, AvailabilitySlot[]>,
): BookingRequest {
  const consultationTypeId = consultationTypes[0]?.id ?? "";
  const firstSlot = slotsByType[consultationTypeId]?.[0];

  return {
    consultationTypeId,
    date: firstSlot?.date ?? "",
    startTime: firstSlot?.startTime ?? "",
    fullName: "",
    email: "",
    phone: "",
    country: "",
    interest: "express-entry",
    preferredLanguage: siteConfig.languages[0] ?? "",
    situation: "",
    consent: false,
  };
}

function clientValidate(
  values: BookingRequest,
  step: number,
): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (step === 0 && !values.consultationTypeId) {
    errors.consultationTypeId = "Choose a consultation type.";
  }

  if (step === 1) {
    if (!values.date) {
      errors.date = "Choose a consultation date.";
    }

    if (!values.startTime) {
      errors.startTime = "Choose a consultation time.";
    }
  }

  if (step === 2) {
    if (values.fullName.trim().length < 2) {
      errors.fullName = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!/^[+\d\s().-]{7,24}$/.test(values.phone)) {
      errors.phone = "Enter a valid phone number.";
    }

    if (values.country.trim().length < 2) {
      errors.country = "Enter your country of residence.";
    }

    if (!values.preferredLanguage) {
      errors.preferredLanguage = "Choose a preferred language.";
    }

    if (values.situation.trim().length < 20) {
      errors.situation = "Add at least 20 characters about your situation.";
    }

    if (!values.consent) {
      errors.consent = "Confirm consent before continuing.";
    }
  }

  return errors;
}

export function BookingForm({
  consultationTypes,
  slotsByType,
}: {
  consultationTypes: ConsultationType[];
  slotsByType: Record<string, AvailabilitySlot[]>;
}) {
  const [state, formAction] = useActionState(submitBookingForm, initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [clientErrors, setClientErrors] = useState<BookingFormErrors>({});
  const [values, setValues] = useState(() =>
    getInitialValues(consultationTypes, slotsByType),
  );
  const selectedType = consultationTypes.find(
    (type) => type.id === values.consultationTypeId,
  );
  const slots = useMemo(
    () => slotsByType[values.consultationTypeId] ?? [],
    [slotsByType, values.consultationTypeId],
  );
  const dates = useMemo(
    () => Array.from(new Set(slots.map((slot) => slot.date))).slice(0, 10),
    [slots],
  );
  const selectedDateSlots = slots.filter((slot) => slot.date === values.date);
  const selectedSlot = slots.find(
    (slot) => slot.date === values.date && slot.startTime === values.startTime,
  );
  const isSubmitted = state.status === "pending_payment";
  const isRedirecting = state.status === "redirecting_to_payment";
  const activeStep = isSubmitted ? 4 : currentStep;

  useEffect(() => {
    if (isRedirecting && state.paymentUrl) {
      window.location.assign(state.paymentUrl);
    }
  }, [isRedirecting, state.paymentUrl]);

  function updateValue<Field extends keyof BookingRequest>(
    field: Field,
    value: BookingRequest[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setClientErrors((current) => ({ ...current, [field]: undefined }));
  }

  function selectConsultationType(consultationTypeId: string) {
    const nextSlot = slotsByType[consultationTypeId]?.[0];

    setValues((current) => ({
      ...current,
      consultationTypeId,
      date: nextSlot?.date ?? "",
      startTime: nextSlot?.startTime ?? "",
    }));
    setClientErrors((current) => ({
      ...current,
      consultationTypeId: undefined,
      date: undefined,
      startTime: undefined,
    }));
  }

  function goToNext() {
    const errors = clientValidate(values, currentStep);
    setClientErrors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentStep((step) => Math.min(step + 1, 3));
    }
  }

  function goToPrevious() {
    setClientErrors({});
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function fieldError(field: keyof BookingRequest | "form") {
    return clientErrors[field] ?? state.errors[field];
  }

  return (
    <form action={formAction} className="grid gap-7" noValidate>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="company"
        tabIndex={-1}
        type="text"
      />
      <input name="consultationTypeId" type="hidden" value={values.consultationTypeId} />
      <input name="date" type="hidden" value={values.date} />
      <input name="startTime" type="hidden" value={values.startTime} />
      <input name="fullName" type="hidden" value={values.fullName} />
      <input name="email" type="hidden" value={values.email} />
      <input name="phone" type="hidden" value={values.phone} />
      <input name="country" type="hidden" value={values.country} />
      <input name="interest" type="hidden" value={values.interest} />
      <input name="preferredLanguage" type="hidden" value={values.preferredLanguage} />
      <input name="situation" type="hidden" value={values.situation} />
      {values.consent ? <input name="consent" type="hidden" value="on" /> : null}

      <ol className="grid gap-3 sm:grid-cols-5">
        {steps.map((step, index) => (
          <li
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              index === activeStep
                ? "border-brand-teal bg-brand-teal-soft text-brand-teal"
                : index < activeStep
                  ? "border-brand-teal/25 bg-white text-brand-navy"
                  : "border-border bg-white text-muted"
            }`}
            key={step}
          >
            <span className="mr-2">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      {fieldError("form") || state.message ? (
        <div
          className={`rounded-md border p-4 text-sm leading-6 ${
            isSubmitted || isRedirecting
              ? "border-brand-teal/25 bg-brand-teal-soft text-brand-teal"
              : "border-accent-red/25 bg-accent-red-soft text-accent-red-dark"
          }`}
          role={isSubmitted ? "status" : "alert"}
        >
          {state.message || fieldError("form")}
        </div>
      ) : null}

      {activeStep === 0 ? (
        <section aria-labelledby="consultation-type-heading" className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase text-accent-red">Step 1</p>
            <h2
              className="mt-2 font-serif text-3xl leading-tight text-deep-ink"
              id="consultation-type-heading"
            >
              Choose a consultation type.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Pricing is sample development data and must be replaced before
              payments are enabled.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {consultationTypes.map((type) => (
              <button
                className={`focus-ring rounded-md border p-5 text-left transition hover:border-brand-teal/40 hover:bg-brand-teal-soft ${
                  values.consultationTypeId === type.id
                    ? "border-brand-teal bg-brand-teal-soft"
                    : "border-border bg-white"
                }`}
                key={type.id}
                onClick={() => selectConsultationType(type.id)}
                type="button"
              >
                <span className="text-lg font-semibold leading-7 text-deep-ink">
                  {type.title}
                </span>
                <span className="mt-3 block text-[15px] leading-7 text-muted">
                  {type.description}
                </span>
                <span className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-brand-teal">
                  <span>{type.durationMinutes} minutes</span>
                  <span aria-hidden="true">/</span>
                  <span>
                    {new Intl.NumberFormat("en-CA", {
                      currency: type.currency,
                      style: "currency",
                    }).format(type.samplePriceCents / 100)}{" "}
                    sample
                  </span>
                </span>
              </button>
            ))}
          </div>
          <FieldError id="consultationTypeId-error">
            {fieldError("consultationTypeId")}
          </FieldError>
        </section>
      ) : null}

      {activeStep === 1 ? (
        <section aria-labelledby="date-time-heading" className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase text-accent-red">Step 2</p>
            <h2
              className="mt-2 font-serif text-3xl leading-tight text-deep-ink"
              id="date-time-heading"
            >
              Select an available date and time.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Times are shown in {slots[0]?.timeZone ?? "the business timezone"}.
              Availability observes business hours, blocked times, unavailable
              dates, and minimum booking notice.
            </p>
          </div>
          {dates.length > 0 ? (
            <>
              <div>
                <p className={fieldLabelClasses}>Date</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {dates.map((date) => (
                    <button
                      className={`focus-ring rounded-md border px-4 py-3 text-left text-[15px] font-semibold transition hover:border-brand-teal/40 hover:bg-brand-teal-soft ${
                        values.date === date
                          ? "border-brand-teal bg-brand-teal-soft text-brand-teal"
                          : "border-border bg-white text-deep-ink"
                      }`}
                      key={date}
                      onClick={() => {
                        const firstTime = slots.find((slot) => slot.date === date);
                        updateValue("date", date);
                        updateValue("startTime", firstTime?.startTime ?? "");
                      }}
                      type="button"
                    >
                      <CalendarDays aria-hidden="true" className="mb-2" size={18} />
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
                <FieldError id="date-error">{fieldError("date")}</FieldError>
              </div>
              <div>
                <p className={fieldLabelClasses}>Time</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedDateSlots.map((slot) => (
                    <button
                      className={`focus-ring rounded-md border px-4 py-3 text-left text-[15px] font-semibold transition hover:border-brand-teal/40 hover:bg-brand-teal-soft ${
                        values.startTime === slot.startTime
                          ? "border-brand-teal bg-brand-teal-soft text-brand-teal"
                          : "border-border bg-white text-deep-ink"
                      }`}
                      key={`${slot.date}-${slot.startTime}`}
                      onClick={() => updateValue("startTime", slot.startTime)}
                      type="button"
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
                <FieldError id="startTime-error">{fieldError("startTime")}</FieldError>
              </div>
            </>
          ) : (
            <div className="rounded-md border border-accent-red/20 bg-accent-red-soft p-4 text-sm leading-6 text-accent-red-dark">
              No slots are currently available for this consultation type.
            </div>
          )}
        </section>
      ) : null}

      {activeStep === 2 ? (
        <section aria-labelledby="client-details-heading" className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase text-accent-red">Step 3</p>
            <h2
              className="mt-2 font-serif text-3xl leading-tight text-deep-ink"
              id="client-details-heading"
            >
              Enter your details.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              This information is used to prepare the consultation request and
              should not be placed into analytics.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={fieldLabelClasses} htmlFor="bookingFullName">
                Full Name
              </label>
              <input
                className={fieldControlClasses}
                id="bookingFullName"
                maxLength={100}
                onChange={(event) => updateValue("fullName", event.target.value)}
                type="text"
                value={values.fullName}
              />
              <FieldError id="bookingFullName-error">{fieldError("fullName")}</FieldError>
            </div>
            <div>
              <label className={fieldLabelClasses} htmlFor="bookingEmail">
                Email
              </label>
              <input
                className={fieldControlClasses}
                id="bookingEmail"
                maxLength={160}
                onChange={(event) => updateValue("email", event.target.value)}
                type="email"
                value={values.email}
              />
              <FieldError id="bookingEmail-error">{fieldError("email")}</FieldError>
            </div>
            <div>
              <label className={fieldLabelClasses} htmlFor="bookingPhone">
                Phone
              </label>
              <input
                className={fieldControlClasses}
                id="bookingPhone"
                maxLength={24}
                onChange={(event) => updateValue("phone", event.target.value)}
                type="tel"
                value={values.phone}
              />
              <FieldError id="bookingPhone-error">{fieldError("phone")}</FieldError>
            </div>
            <div>
              <label className={fieldLabelClasses} htmlFor="bookingCountry">
                Country of Residence
              </label>
              <input
                className={fieldControlClasses}
                id="bookingCountry"
                maxLength={80}
                onChange={(event) => updateValue("country", event.target.value)}
                type="text"
                value={values.country}
              />
              <FieldError id="bookingCountry-error">{fieldError("country")}</FieldError>
            </div>
            <div>
              <label className={fieldLabelClasses} htmlFor="bookingInterest">
                Immigration Interest
              </label>
              <select
                className={fieldControlClasses}
                id="bookingInterest"
                onChange={(event) =>
                  updateValue("interest", event.target.value as BookingRequest["interest"])
                }
                value={values.interest}
              >
                {contactInterestOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldError id="bookingInterest-error">{fieldError("interest")}</FieldError>
            </div>
            <div>
              <label className={fieldLabelClasses} htmlFor="bookingLanguage">
                Preferred Language
              </label>
              <select
                className={fieldControlClasses}
                id="bookingLanguage"
                onChange={(event) =>
                  updateValue("preferredLanguage", event.target.value)
                }
                value={values.preferredLanguage}
              >
                {siteConfig.languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <FieldError id="bookingLanguage-error">
                {fieldError("preferredLanguage")}
              </FieldError>
            </div>
          </div>
          <div>
            <label className={fieldLabelClasses} htmlFor="bookingSituation">
              Short description of immigration situation
            </label>
            <textarea
              className={`${fieldControlClasses} min-h-36 resize-y`}
              id="bookingSituation"
              maxLength={1500}
              onChange={(event) => updateValue("situation", event.target.value)}
              value={values.situation}
            />
            <p className={fieldHelpClasses}>
              Share your current status, goal, timeline, and any urgent questions.
            </p>
            <FieldError id="bookingSituation-error">{fieldError("situation")}</FieldError>
          </div>
          <div>
            <label className="flex gap-3 rounded-md border border-border bg-surface-soft p-4 text-[15px] leading-7 text-muted">
              <input
                checked={values.consent}
                className="mt-1 size-4 rounded border-border text-brand-teal focus:ring-brand-teal"
                onChange={(event) => updateValue("consent", event.target.checked)}
                type="checkbox"
              />
              <span>
                I consent to Switch North Immigration using this information to
                process my consultation request. I understand this does not
                create a consultant-client relationship.
              </span>
            </label>
            <FieldError id="bookingConsent-error">{fieldError("consent")}</FieldError>
          </div>
        </section>
      ) : null}

      {activeStep === 3 ? (
        <section aria-labelledby="payment-heading" className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase text-accent-red">Step 4</p>
            <h2
              className="mt-2 font-serif text-3xl leading-tight text-deep-ink"
              id="payment-heading"
            >
              Review before payment.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Payment processing is the Phase 11 integration point. Submitting
              now creates a pending-payment appointment hold, not a confirmed
              appointment.
            </p>
          </div>
          <div className="rounded-md border border-border bg-white p-5">
            <dl className="grid gap-4 text-[15px] leading-7 text-muted md:grid-cols-2">
              <div>
                <dt className="font-semibold text-deep-ink">Consultation</dt>
                <dd>{selectedType?.title}</dd>
              </div>
              <div>
                <dt className="font-semibold text-deep-ink">Sample Price</dt>
                <dd>
                  {selectedType
                    ? new Intl.NumberFormat("en-CA", {
                        currency: selectedType.currency,
                        style: "currency",
                      }).format(selectedType.samplePriceCents / 100)
                    : "Not selected"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-deep-ink">Date</dt>
                <dd>{values.date ? formatDate(values.date) : "Not selected"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-deep-ink">Time</dt>
                <dd>
                  {selectedSlot?.label ?? "Not selected"}{" "}
                  {selectedSlot ? selectedSlot.timeZone : ""}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-deep-ink">Client</dt>
                <dd>{values.fullName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-deep-ink">Interest</dt>
                <dd>
                  {
                    contactInterestOptions.find(
                      (option) => option.value === values.interest,
                    )?.label
                  }
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex gap-3 rounded-md border border-brand-teal/20 bg-brand-teal-soft p-4 text-sm leading-6 text-muted">
            <Info aria-hidden="true" className="mt-0.5 shrink-0 text-brand-teal" size={18} />
            <p>
              A slot is only fully confirmed after payment succeeds. Until Phase
              11, this flow stops at a pending-payment hold.
            </p>
          </div>
        </section>
      ) : null}

      {activeStep === 4 ? (
        <section aria-labelledby="confirmation-heading" className="grid gap-5">
          <div className="rounded-md border border-brand-teal/25 bg-brand-teal-soft p-6">
            <CheckCircle2 aria-hidden="true" className="text-brand-teal" size={30} />
            <h2
              className="mt-4 font-serif text-3xl leading-tight text-deep-ink"
              id="confirmation-heading"
            >
              Pending-payment appointment created.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              {state.message}
            </p>
            {state.appointment ? (
              <dl className="mt-5 grid gap-3 text-[15px] leading-7 text-muted">
                <div>
                  <dt className="font-semibold text-deep-ink">Appointment ID</dt>
                  <dd>{state.appointmentId}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Consultation</dt>
                  <dd>{state.appointment.consultationType}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Date and time</dt>
                  <dd>
                    {formatDate(state.appointment.date)}, {state.appointment.time}{" "}
                    {state.appointment.timeZone}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Sample price</dt>
                  <dd>{state.appointment.price}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        </section>
      ) : null}

      {activeStep < 4 ? (
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            disabled={currentStep === 0 || isSubmitted}
            onClick={goToPrevious}
            type="button"
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            Previous
          </Button>
          {currentStep === 3 ? (
          <SubmitButton submitted={isSubmitted || isRedirecting} />
          ) : (
            <Button disabled={dates.length === 0 && currentStep === 1} onClick={goToNext} type="button">
              Continue
              <ArrowRight aria-hidden="true" size={18} />
            </Button>
          )}
        </div>
      ) : null}
    </form>
  );
}
