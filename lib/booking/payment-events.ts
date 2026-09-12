import type Stripe from "stripe";
import { getConsultationType } from "./availability";
import { getAppointmentRepository } from "./repository";
import type { AppointmentRecord } from "../../types/booking";

type PaymentEventResult = {
  appointment?: AppointmentRecord;
  status:
    | "duplicate"
    | "ignored"
    | "missing_appointment"
    | "payment_failed"
    | "payment_succeeded"
    | "released";
};

function getSessionPaymentIntentId(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id;
}

function getSessionAmount(session: Stripe.Checkout.Session) {
  return session.amount_total ?? 0;
}

function getSessionCurrency(session: Stripe.Checkout.Session) {
  return session.currency ?? "cad";
}

async function findAppointmentForSession(session: Stripe.Checkout.Session) {
  const repository = getAppointmentRepository();

  if (session.id) {
    const bySession = await repository.findByStripeCheckoutSessionId(session.id);

    if (bySession) {
      return bySession;
    }
  }

  const appointmentId = session.metadata?.appointmentId ?? session.client_reference_id;

  return appointmentId ? repository.findById(appointmentId) : null;
}

export async function processStripePaymentEvent(
  event: Stripe.Event,
  options: {
    onAppointmentConfirmed?: (appointment: AppointmentRecord) => Promise<void>;
  } = {},
): Promise<PaymentEventResult> {
  const repository = getAppointmentRepository();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const appointment = await findAppointmentForSession(session);

    if (!appointment) {
      return { status: "missing_appointment" };
    }

    if (appointment.processedStripeEventIds.includes(event.id)) {
      return { appointment, status: "duplicate" };
    }

    if (session.payment_status !== "paid") {
      return { appointment, status: "ignored" };
    }

    const updated = await repository.markPaymentSucceeded(appointment.id, {
      amountCents: getSessionAmount(session),
      currency: getSessionCurrency(session),
      eventId: event.id,
      paidAt: new Date(
        (event.created ? event.created * 1000 : Date.now()),
      ).toISOString(),
      paymentIntentId: getSessionPaymentIntentId(session),
    });

    if (updated) {
      const consultationType = getConsultationType(updated.consultationTypeId);

      if (consultationType) {
        await options.onAppointmentConfirmed?.(updated);
      }
    }

    return { appointment: updated ?? appointment, status: "payment_succeeded" };
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const appointment = await findAppointmentForSession(session);

    if (!appointment) {
      return { status: "missing_appointment" };
    }

    if (appointment.processedStripeEventIds.includes(event.id)) {
      return { appointment, status: "duplicate" };
    }

    const updated = await repository.markPaymentFailed(appointment.id, {
      eventId: event.id,
      failedAt: new Date(
        (event.created ? event.created * 1000 : Date.now()),
      ).toISOString(),
      paymentIntentId: getSessionPaymentIntentId(session),
      status: event.type === "checkout.session.expired" ? "EXPIRED" : "FAILED",
    });

    return {
      appointment: updated ?? appointment,
      status: event.type === "checkout.session.expired" ? "released" : "payment_failed",
    };
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const appointmentId = paymentIntent.metadata?.appointmentId;
    const appointment = appointmentId ? await repository.findById(appointmentId) : null;

    if (!appointment) {
      return { status: "missing_appointment" };
    }

    if (appointment.processedStripeEventIds.includes(event.id)) {
      return { appointment, status: "duplicate" };
    }

    const updated = await repository.markPaymentFailed(appointment.id, {
      eventId: event.id,
      failedAt: new Date(
        (event.created ? event.created * 1000 : Date.now()),
      ).toISOString(),
      paymentIntentId: paymentIntent.id,
      status: "FAILED",
    });

    return { appointment: updated ?? appointment, status: "payment_failed" };
  }

  return { status: "ignored" };
}
