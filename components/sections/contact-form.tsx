"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { submitContactForm } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import {
  fieldControlClasses,
  fieldErrorClasses,
  fieldHelpClasses,
  fieldLabelClasses,
} from "@/components/ui/form-styles";
import { contactInterestOptions } from "@/data/contact";
import type { ContactFormState } from "@/types/contact";

const initialState: ContactFormState = {
  status: "idle",
  message: "",
  errors: {},
};

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
      {submitted ? "Message Sent" : pending ? "Sending..." : "Send Message"}
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

export function ContactForm({ initialInterest = "" }: { initialInterest?: string }) {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const isError = state.status === "error";
  const isSuccess = state.status === "success";

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="company"
        tabIndex={-1}
        type="text"
      />

      <p className="text-sm leading-6 text-muted">
        <span aria-hidden="true" className="font-semibold text-accent-red">
          *
        </span>{" "}
        Required fields. Share only the details needed to understand your inquiry.
      </p>

      {state.message ? (
        <div
          className={`rounded-md border p-4 text-sm leading-6 ${
            isSuccess
              ? "border-brand-teal/25 bg-brand-teal-soft text-brand-teal"
              : "border-accent-red/25 bg-accent-red-soft text-accent-red-dark"
          }`}
          role={isError ? "alert" : "status"}
        >
          <div className="flex gap-3">
            {isSuccess ? (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
            ) : (
              <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
            )}
            <p>{state.message}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={fieldLabelClasses} htmlFor="fullName">
            Full Name
            <RequiredMark />
          </label>
          <input
            aria-describedby={state.errors.fullName ? "fullName-error" : undefined}
            aria-invalid={Boolean(state.errors.fullName)}
            autoComplete="name"
            className={fieldControlClasses}
            id="fullName"
            maxLength={100}
            name="fullName"
            required
            type="text"
          />
          <FieldError id="fullName-error">{state.errors.fullName}</FieldError>
        </div>

        <div>
          <label className={fieldLabelClasses} htmlFor="email">
            Email
            <RequiredMark />
          </label>
          <input
            aria-describedby={state.errors.email ? "email-error" : undefined}
            aria-invalid={Boolean(state.errors.email)}
            autoComplete="email"
            className={fieldControlClasses}
            id="email"
            maxLength={160}
            name="email"
            required
            type="email"
          />
          <FieldError id="email-error">{state.errors.email}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={fieldLabelClasses} htmlFor="phone">
            Phone
            <OptionalText />
          </label>
          <input
            aria-describedby={state.errors.phone ? "phone-error" : undefined}
            aria-invalid={Boolean(state.errors.phone)}
            autoComplete="tel"
            className={fieldControlClasses}
            id="phone"
            maxLength={24}
            name="phone"
            type="tel"
          />
          <FieldError id="phone-error">{state.errors.phone}</FieldError>
        </div>

        <div>
          <label className={fieldLabelClasses} htmlFor="country">
            Country of Residence
            <RequiredMark />
          </label>
          <input
            aria-describedby={state.errors.country ? "country-error" : undefined}
            aria-invalid={Boolean(state.errors.country)}
            autoComplete="country-name"
            className={fieldControlClasses}
            id="country"
            maxLength={80}
            name="country"
            required
            type="text"
          />
          <FieldError id="country-error">{state.errors.country}</FieldError>
        </div>
      </div>

      <div>
        <label className={fieldLabelClasses} htmlFor="interest">
          Immigration Interest
          <RequiredMark />
        </label>
        <select
          aria-describedby={state.errors.interest ? "interest-error" : undefined}
          aria-invalid={Boolean(state.errors.interest)}
          className={fieldControlClasses}
          defaultValue={initialInterest}
          id="interest"
          name="interest"
          required
        >
          <option value="">Select an option</option>
          {contactInterestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError id="interest-error">{state.errors.interest}</FieldError>
      </div>

      <div>
        <label className={fieldLabelClasses} htmlFor="message">
          Message
          <RequiredMark />
        </label>
        <textarea
          aria-describedby={state.errors.message ? "message-help message-error" : "message-help"}
          aria-invalid={Boolean(state.errors.message)}
          className={`${fieldControlClasses} min-h-36 resize-y`}
          id="message"
          maxLength={2000}
          name="message"
          required
        />
        <p className={fieldHelpClasses} id="message-help">
          Share your goal, current location, and any important timing or status details.
        </p>
        <FieldError id="message-error">{state.errors.message}</FieldError>
      </div>

      <div>
        <label className="flex gap-3 rounded-md border border-border bg-surface-soft p-4 text-base leading-7 text-muted">
          <input
            aria-describedby={state.errors.consent ? "consent-error" : undefined}
            aria-invalid={Boolean(state.errors.consent)}
            className="mt-1 size-4 rounded border-border text-brand-teal focus:ring-2 focus:ring-brand-teal/25"
            name="consent"
            required
            type="checkbox"
          />
          <span>
            <RequiredMark /> I consent to Switch North Immigration using this information to respond to
            my inquiry. I understand this form does not create a consultant-client
            relationship.
          </span>
        </label>
        <FieldError id="consent-error">{state.errors.consent}</FieldError>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base leading-7 text-muted">
          Your information is handled according to the{" "}
          <Link className="focus-ring rounded-sm font-semibold text-brand-teal hover:text-accent-red" href="/privacy">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link className="focus-ring rounded-sm font-semibold text-brand-teal hover:text-accent-red" href="/terms">
            Terms
          </Link>
          .
        </p>
        <SubmitButton submitted={isSuccess} />
      </div>
    </form>
  );
}
