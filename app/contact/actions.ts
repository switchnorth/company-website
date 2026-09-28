"use server";

import {
  getContactHoneypot,
  parseContactFormData,
  validateContactLead,
} from "@/lib/contact-validation";
import { verifyCaptchaToken } from "@/lib/captcha";
import { submitContactLead } from "@/lib/lead-workflow";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import type { ContactFormState } from "@/types/contact";

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = getContactHoneypot(formData);

  if (honeypot) {
    return {
      status: "error",
      message:
        "We could not send your message right now. Please try again or contact the office directly.",
      errors: {
        form: "Submission rejected.",
      },
    };
  }

  const lead = parseContactFormData(formData);
  const errors = validateContactLead(lead);
  const captcha = await verifyCaptchaToken(formData.get("captchaToken"));

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      errors,
    };
  }

  if (!captcha.valid) {
    return {
      status: "error",
      message: "Please complete the spam-protection check and try again.",
      errors: {
        form: "CAPTCHA verification failed.",
      },
    };
  }

  const identifier = await getRequestIdentifier(lead.email);
  const rateLimit = checkRateLimit({
    identifier,
    limit: 5,
    scope: "contact-form",
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message:
        "Too many contact attempts were submitted recently. Please wait before trying again.",
      errors: {
        form: "Rate limit reached.",
      },
    };
  }

  try {
    const result = await submitContactLead(lead);

    return {
      status: "success",
      message:
        result.delivery === "sent"
          ? "Thank you. Your message has been sent successfully."
          : "Thanks. Your message passed validation. Email delivery is disabled in this development build.",
      errors: {},
    };
  } catch {
    return {
      status: "error",
      message:
        "We could not send your message right now. Please try again or contact the office directly.",
      errors: {
        form: "Submission delivery failed.",
      },
    };
  }
}
