"use server";

import { redirect } from "next/navigation";
import {
  cancelManagedAppointment,
  rescheduleAppointment,
} from "@/lib/booking/lifecycle";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

function safeToken(token: string) {
  return encodeURIComponent(token);
}

async function assertManagementRateLimit(token: string) {
  const identifier = await getRequestIdentifier(token);
  const rateLimit = checkRateLimit({
    identifier,
    limit: 8,
    scope: "appointment-management",
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    redirect(`/appointment/manage/${safeToken(token)}?error=rate-limited`);
  }
}

export async function rescheduleManagedAppointmentAction(
  token: string,
  formData: FormData,
) {
  await assertManagementRateLimit(token);

  const slot = String(formData.get("slot") ?? "");
  const [date, startTime] = slot.split("|");

  try {
    await rescheduleAppointment({
      actor: "client",
      date,
      startTime,
      token,
    });
  } catch {
    redirect(`/appointment/manage/${safeToken(token)}?error=reschedule`);
  }

  redirect(`/appointment/manage/${safeToken(token)}?updated=rescheduled`);
}

export async function cancelManagedAppointmentAction(
  token: string,
  formData: FormData,
) {
  await assertManagementRateLimit(token);

  if (formData.get("confirmCancel") !== "on") {
    redirect(`/appointment/manage/${safeToken(token)}?error=confirm-cancel`);
  }

  try {
    await cancelManagedAppointment({
      actor: "client",
      token,
    });
  } catch {
    redirect(`/appointment/manage/${safeToken(token)}?error=cancel`);
  }

  redirect(`/appointment/manage/${safeToken(token)}?updated=cancelled`);
}
