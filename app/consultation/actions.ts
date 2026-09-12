"use server";

import { verifyCaptchaToken } from "@/lib/captcha";
import {
  getBookingHoneypot,
  parseBookingFormData,
  validateBookingRequest,
} from "@/lib/booking/validation";
import { createPendingAppointment } from "@/lib/booking/service";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import type { BookingFormState } from "@/types/booking";

export async function submitBookingForm(
  _previousState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  if (getBookingHoneypot(formData)) {
    return {
      status: "pending_payment",
      message:
        "Your consultation request has been received. Payment setup will be completed separately.",
      errors: {},
    };
  }

  const request = parseBookingFormData(formData);
  const errors = validateBookingRequest(request);
  const captcha = await verifyCaptchaToken(formData.get("captchaToken"));

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please review the highlighted booking fields.",
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

  const identifier = await getRequestIdentifier(request.email);
  const rateLimit = checkRateLimit({
    identifier,
    limit: 3,
    scope: "consultation-booking",
    windowMs: 30 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message:
        "Too many booking attempts were submitted recently. Please wait before trying again.",
      errors: {
        form: "Rate limit reached.",
      },
    };
  }

  try {
    const result = await createPendingAppointment(request);

    return {
      status: result.paymentUrl ? "redirecting_to_payment" : "pending_payment",
      message:
        result.paymentUrl
          ? "Your appointment time is being held. Redirecting to secure Stripe Checkout."
          : "Your appointment time is being held pending payment. Add Stripe test keys to enable Checkout.",
      errors: {},
      appointmentId: result.appointment.id,
      paymentUrl: result.paymentUrl ?? undefined,
      appointment: {
        consultationType: result.consultationType.title,
        price: result.displayPrice,
        date: result.appointment.date,
        time: `${result.appointment.startTime} - ${result.appointment.endTime}`,
        timeZone: result.appointment.timeZone,
      },
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "We could not create this booking request right now.",
      errors: {
        form: "Booking request failed.",
      },
    };
  }
}
