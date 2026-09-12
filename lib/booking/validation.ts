import { consultationTypes } from "@/data/booking";
import { contactInterestOptions } from "@/data/contact";
import { siteConfig } from "@/data/site";
import type {
  BookingFormErrors,
  BookingRequest,
} from "@/types/booking";
import type { ContactInterest } from "@/data/contact";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s().-]{7,24}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;
const suspiciousUrlPattern = /(https?:\/\/|www\.)/i;
const interestValues = new Set<string>(
  contactInterestOptions.map((option) => option.value),
);
const languageValues = new Set(siteConfig.languages);
const consultationTypeValues = new Set<string>(
  consultationTypes.map((type) => type.id),
);

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function hasObviousSpam(value: string) {
  return suspiciousUrlPattern.test(value.slice(0, 120));
}

export function getBookingHoneypot(formData: FormData) {
  return readString(formData, "company");
}

export function parseBookingFormData(formData: FormData): BookingRequest {
  return {
    consultationTypeId: readString(formData, "consultationTypeId"),
    date: readString(formData, "date"),
    startTime: readString(formData, "startTime"),
    fullName: readString(formData, "fullName"),
    email: readString(formData, "email").toLowerCase(),
    phone: readString(formData, "phone"),
    country: readString(formData, "country"),
    interest: readString(formData, "interest") as ContactInterest,
    preferredLanguage: readString(formData, "preferredLanguage"),
    situation: readString(formData, "situation"),
    consent: formData.get("consent") === "on",
  };
}

export function validateBookingRequest(request: BookingRequest) {
  const errors: BookingFormErrors = {};

  if (!consultationTypeValues.has(request.consultationTypeId)) {
    errors.consultationTypeId = "Choose a consultation type.";
  }

  if (!datePattern.test(request.date)) {
    errors.date = "Choose an available consultation date.";
  }

  if (!timePattern.test(request.startTime)) {
    errors.startTime = "Choose an available consultation time.";
  }

  if (
    request.fullName.length < 2 ||
    request.fullName.length > 100 ||
    hasObviousSpam(request.fullName)
  ) {
    errors.fullName = "Enter your full name using 2 to 100 characters.";
  }

  if (!emailPattern.test(request.email) || request.email.length > 160) {
    errors.email = "Enter a valid email address.";
  }

  if (!phonePattern.test(request.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (
    request.country.length < 2 ||
    request.country.length > 80 ||
    hasObviousSpam(request.country)
  ) {
    errors.country = "Enter your country of residence.";
  }

  if (!interestValues.has(request.interest)) {
    errors.interest = "Choose the immigration area closest to your goal.";
  }

  if (!languageValues.has(request.preferredLanguage)) {
    errors.preferredLanguage = "Choose a preferred consultation language.";
  }

  if (
    request.situation.length < 20 ||
    request.situation.length > 1500 ||
    hasObviousSpam(request.situation)
  ) {
    errors.situation =
      "Enter 20 to 1500 characters without promotional links.";
  }

  if (!request.consent) {
    errors.consent =
      "Confirm that Switch North can use this information to process the booking request.";
  }

  return errors;
}
