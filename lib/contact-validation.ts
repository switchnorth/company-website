import { contactInterestOptions, type ContactInterest } from "@/data/contact";
import type { ContactFormState } from "@/types/contact";
import type { ContactLead } from "@/types/lead";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s().-]{7,24}$/;
const suspiciousUrlPattern = /(https?:\/\/|www\.)/i;
const repeatedUrlPattern = /(https?:\/\/|www\.).*(https?:\/\/|www\.)/i;
const interestValues = new Set<string>(
  contactInterestOptions.map((option) => option.value),
);

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function hasObviousSpam(value: string) {
  return repeatedUrlPattern.test(value) || suspiciousUrlPattern.test(value.slice(0, 80));
}

export function parseContactFormData(formData: FormData): ContactLead {
  return {
    fullName: readString(formData, "fullName"),
    email: readString(formData, "email").toLowerCase(),
    phone: readString(formData, "phone"),
    country: readString(formData, "country"),
    interest: readString(formData, "interest") as ContactInterest,
    message: readString(formData, "message"),
    consent: formData.get("consent") === "on",
  };
}

export function getContactHoneypot(formData: FormData) {
  return readString(formData, "company");
}

export function validateContactLead(lead: ContactLead) {
  const errors: ContactFormState["errors"] = {};

  if (
    lead.fullName.length < 2 ||
    lead.fullName.length > 100 ||
    hasObviousSpam(lead.fullName)
  ) {
    errors.fullName = "Enter your full name using 2 to 100 characters.";
  }

  if (!emailPattern.test(lead.email) || lead.email.length > 160) {
    errors.email = "Enter a valid email address.";
  }

  if (lead.phone && !phonePattern.test(lead.phone)) {
    errors.phone = "Enter a valid phone number or leave this field blank.";
  }

  if (
    lead.country.length < 2 ||
    lead.country.length > 80 ||
    hasObviousSpam(lead.country)
  ) {
    errors.country = "Enter your country of residence.";
  }

  if (!interestValues.has(lead.interest)) {
    errors.interest = "Choose the immigration area closest to your goal.";
  }

  if (
    lead.message.length < 20 ||
    lead.message.length > 2000 ||
    hasObviousSpam(lead.message)
  ) {
    errors.message =
      "Enter a message between 20 and 2000 characters without promotional links.";
  }

  if (!lead.consent) {
    errors.consent = "Confirm that Switch North can use this information to respond.";
  }

  return errors;
}
