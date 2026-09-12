import { bookingAvailability, formatConsultationPrice } from "@/data/booking";
import {
  getAvailableSlots,
  getConsultationType,
  isSlotAvailable,
} from "@/lib/booking/availability";
import { getAppointmentRepository } from "@/lib/booking/repository";
import { createStripeCheckoutSession } from "@/lib/booking/stripe";
import { addMinutesToTime } from "@/lib/booking/timezone";
import type {
  AppointmentRecord,
  BookingRequest,
} from "@/types/booking";

function createAppointmentId() {
  return `appt-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export async function getBookingSlots(consultationTypeId: string) {
  const consultationType = getConsultationType(consultationTypeId);

  if (!consultationType) {
    return [];
  }

  const repository = getAppointmentRepository();
  const appointments = await repository.list();

  return getAvailableSlots({ appointments, consultationType });
}

export async function createPendingAppointment(request: BookingRequest) {
  const consultationType = getConsultationType(request.consultationTypeId);

  if (!consultationType) {
    throw new Error("Invalid consultation type.");
  }

  const repository = getAppointmentRepository();
  const appointments = await repository.list();
  const available = isSlotAvailable({
    appointments,
    config: bookingAvailability,
    consultationType,
    date: request.date,
    startTime: request.startTime,
  });

  if (!available) {
    throw new Error("Selected appointment time is no longer available.");
  }

  const now = new Date().toISOString();
  const appointment: AppointmentRecord = {
    id: createAppointmentId(),
    consultationTypeId: request.consultationTypeId,
    date: request.date,
    startTime: request.startTime,
    endTime: addMinutesToTime(request.startTime, consultationType.durationMinutes),
    timeZone: bookingAvailability.timeZone,
    status: "PENDING_PAYMENT",
    paymentStatus: "PAYMENT_REQUIRED",
    refundStatus: "NOT_REQUESTED",
    calendarSyncStatus: "PENDING",
    holdExpiresAt: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    processedStripeEventIds: [],
    client: {
      fullName: request.fullName,
      email: request.email,
      phone: request.phone,
      country: request.country,
      interest: request.interest,
      preferredLanguage: request.preferredLanguage,
      situation: request.situation,
      consent: request.consent,
    },
    createdAt: now,
    updatedAt: now,
  };

  const saved = await repository.create(appointment);
  let checkoutSession;

  try {
    checkoutSession = await createStripeCheckoutSession({
      appointment: saved,
      consultationType,
    });
  } catch (error) {
    await repository.updateStatus(saved.id, "CANCELLED", "FAILED");
    throw error;
  }
  const payableAppointment = checkoutSession
    ? await repository.attachStripeCheckoutSession(saved.id, {
        amountCents: checkoutSession.amountCents,
        checkoutSessionId: checkoutSession.checkoutSessionId,
        currency: checkoutSession.currency,
        expiresAt: checkoutSession.expiresAt,
        paymentIntentId: checkoutSession.paymentIntentId,
      })
    : saved;

  return {
    appointment: payableAppointment ?? saved,
    consultationType,
    displayPrice: formatConsultationPrice(consultationType),
    paymentUrl: checkoutSession?.url ?? null,
  };
}

export async function getAppointmentForConfirmation({
  appointmentId,
  checkoutSessionId,
}: {
  appointmentId?: string;
  checkoutSessionId?: string;
}) {
  const repository = getAppointmentRepository();

  if (checkoutSessionId) {
    return repository.findByStripeCheckoutSessionId(checkoutSessionId);
  }

  if (appointmentId) {
    return repository.findById(appointmentId);
  }

  return null;
}
