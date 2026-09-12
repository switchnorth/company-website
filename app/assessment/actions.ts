"use server";

import { verifyCaptchaToken } from "@/lib/captcha";
import { parseAssessmentFormData, validateAssessment } from "@/lib/assessment-validation";
import { submitAssessmentLead } from "@/lib/lead-workflow";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import type { AssessmentSubmitState } from "@/types/assessment";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function submitAssessmentForm(
  _previousState: AssessmentSubmitState,
  formData: FormData,
): Promise<AssessmentSubmitState> {
  if (readString(formData, "company")) {
    return {
      status: "success",
      message: "Thanks. Your assessment has been received.",
      errors: {},
    };
  }

  const data = parseAssessmentFormData(formData);
  const errors = validateAssessment(data);
  const captcha = await verifyCaptchaToken(formData.get("captchaToken"));

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please review the highlighted assessment fields.",
      errors,
    };
  }

  if (!captcha.valid) {
    return {
      status: "error",
      message: "Please complete the spam-protection check and try again.",
      errors: {},
    };
  }

  const identifier = await getRequestIdentifier(data.email);
  const rateLimit = checkRateLimit({
    identifier,
    limit: 3,
    scope: "assessment-form",
    windowMs: 30 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message:
        "Too many assessment attempts were submitted recently. Please wait before trying again.",
      errors: {},
    };
  }

  try {
    const result = await submitAssessmentLead(data);

    return {
      status: "success",
      message:
        result.delivery === "sent"
          ? "Thanks. Your assessment has been received for review. A confirmation email has been sent."
          : "Thanks. Your assessment has been received for review. Email delivery is disabled in this development build.",
      errors: {},
    };
  } catch {
    return {
      status: "error",
      message:
        "We could not submit your assessment right now. Please try again or contact the office directly.",
      errors: {},
    };
  }
}
