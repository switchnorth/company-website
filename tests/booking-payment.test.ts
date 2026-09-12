import assert from "node:assert/strict";
import test from "node:test";
import Stripe from "stripe";
import { getAvailableSlots } from "../lib/booking/availability";
import { processStripePaymentEvent } from "../lib/booking/payment-events";
import {
  clearDevelopmentAppointments,
  inMemoryAppointmentRepository,
} from "../lib/booking/repository";
import { constructStripeWebhookEvent } from "../lib/booking/stripe";
import type {
  AppointmentRecord,
  BookingAvailabilityConfig,
  ConsultationType,
} from "../types/booking";

const consultationType: ConsultationType = {
  id: "initial-30",
  title: "Initial Immigration Consultation",
  durationMinutes: 30,
  samplePriceCents: 7500,
  currency: "CAD",
  description: "A focused first consultation.",
};

const config: BookingAvailabilityConfig = {
  timeZone: "America/Vancouver",
  bookingHorizonDays: 4,
  minimumNoticeHours: 1,
  slotIntervalMinutes: 30,
  businessHours: {
    1: [{ start: "09:00", end: "10:00" }],
  },
  blockedTimes: [],
  unavailableDates: [],
};

function appointment(
  overrides: Partial<AppointmentRecord> = {},
): AppointmentRecord {
  return {
    id: "appt-payment-test",
    consultationTypeId: consultationType.id,
    date: "2026-09-14",
    startTime: "09:00",
    endTime: "09:30",
    timeZone: config.timeZone,
    status: "PENDING_PAYMENT",
    paymentStatus: "PAYMENT_REQUIRED",
    stripeCheckoutSessionId: "cs_test_123",
    paymentAmountCents: 7500,
    paymentCurrency: "cad",
    paymentCreatedAt: "2026-09-13T19:00:00.000Z",
    paymentExpiresAt: "2026-09-13T19:35:00.000Z",
    holdExpiresAt: "2026-09-13T19:35:00.000Z",
    processedStripeEventIds: [],
    client: {
      fullName: "Alex Client",
      email: "alex@example.com",
      phone: "+1 604 555 0148",
      country: "Canada",
      interest: "express-entry",
      preferredLanguage: "English",
      situation: "I want to discuss my immigration options before applying.",
      consent: true,
    },
    createdAt: "2026-09-13T19:00:00.000Z",
    updatedAt: "2026-09-13T19:00:00.000Z",
    ...overrides,
  };
}

function checkoutEvent(
  type:
    | "checkout.session.completed"
    | "checkout.session.async_payment_failed"
    | "checkout.session.expired",
  eventId = `evt_${type}`,
): Stripe.Event {
  return {
    id: eventId,
    object: "event",
    api_version: "2024-06-20",
    created: 1_789_330_000,
    data: {
      object: {
        id: "cs_test_123",
        object: "checkout.session",
        amount_total: 7500,
        client_reference_id: "appt-payment-test",
        currency: "cad",
        metadata: {
          appointmentId: "appt-payment-test",
        },
        payment_intent: "pi_test_123",
        payment_status: type === "checkout.session.completed" ? "paid" : "unpaid",
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: null,
    type,
  } as unknown as Stripe.Event;
}

test("successful payment confirms appointment and starts confirmation workflow", async () => {
  clearDevelopmentAppointments();
  await inMemoryAppointmentRepository.create(appointment());

  let confirmationCount = 0;
  const result = await processStripePaymentEvent(
    checkoutEvent("checkout.session.completed"),
    {
      async onAppointmentConfirmed() {
        confirmationCount += 1;
      },
    },
  );
  const updated = await inMemoryAppointmentRepository.findById("appt-payment-test");

  assert.equal(result.status, "payment_succeeded");
  assert.equal(updated?.status, "CONFIRMED");
  assert.equal(updated?.paymentStatus, "PAID");
  assert.equal(updated?.stripePaymentIntentId, "pi_test_123");
  assert.equal(updated?.paymentAmountCents, 7500);
  assert.equal(updated?.paymentCurrency, "cad");
  assert.equal(Boolean(updated?.paymentPaidAt), true);
  assert.equal(confirmationCount, 1);
});

test("duplicate successful webhook is idempotent", async () => {
  clearDevelopmentAppointments();
  await inMemoryAppointmentRepository.create(appointment());

  let confirmationCount = 0;
  const event = checkoutEvent("checkout.session.completed", "evt_duplicate");

  await processStripePaymentEvent(event, {
    async onAppointmentConfirmed() {
      confirmationCount += 1;
    },
  });
  const duplicate = await processStripePaymentEvent(event, {
    async onAppointmentConfirmed() {
      confirmationCount += 1;
    },
  });
  const updated = await inMemoryAppointmentRepository.findById("appt-payment-test");

  assert.equal(duplicate.status, "duplicate");
  assert.equal(updated?.processedStripeEventIds.length, 1);
  assert.equal(updated?.status, "CONFIRMED");
  assert.equal(confirmationCount, 1);
});

test("failed payment cancels appointment and releases slot", async () => {
  clearDevelopmentAppointments();
  await inMemoryAppointmentRepository.create(appointment());

  const result = await processStripePaymentEvent(
    checkoutEvent("checkout.session.async_payment_failed"),
  );
  const updated = await inMemoryAppointmentRepository.findById("appt-payment-test");

  assert.equal(result.status, "payment_failed");
  assert.equal(updated?.status, "CANCELLED");
  assert.equal(updated?.paymentStatus, "FAILED");
});

test("expired checkout releases pending slot", async () => {
  clearDevelopmentAppointments();
  await inMemoryAppointmentRepository.create(appointment());

  const result = await processStripePaymentEvent(
    checkoutEvent("checkout.session.expired"),
  );
  const updated = await inMemoryAppointmentRepository.findById("appt-payment-test");
  const slots = getAvailableSlots({
    appointments: updated ? [updated] : [],
    config,
    consultationType,
    now: new Date("2026-09-13T15:00:00.000Z"),
  });

  assert.equal(result.status, "released");
  assert.equal(updated?.status, "CANCELLED");
  assert.equal(updated?.paymentStatus, "EXPIRED");
  assert.ok(slots.some((slot) => slot.date === "2026-09-14" && slot.startTime === "09:00"));
});

test("invalid webhook signature is rejected", () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_123";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const payload = JSON.stringify({ id: "evt_test", object: "event" });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload: JSON.stringify({ id: "evt_other", object: "event" }),
    secret: "whsec_test",
  });

  assert.throws(() =>
    constructStripeWebhookEvent({
      payload,
      signature,
      webhookSecret: "whsec_test",
    }),
  );
});
