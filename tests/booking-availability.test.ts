import assert from "node:assert/strict";
import test from "node:test";
import type {
  AppointmentRecord,
  BookingAvailabilityConfig,
  ConsultationType,
} from "../types/booking";
import {
  getAvailableSlots,
  isSlotAvailable,
} from "../lib/booking/availability";

const consultationType: ConsultationType = {
  id: "test-30",
  title: "Test Consultation",
  durationMinutes: 30,
  samplePriceCents: 7500,
  currency: "CAD",
  description: "Test consultation type.",
};

const config: BookingAvailabilityConfig = {
  timeZone: "America/Vancouver",
  bookingHorizonDays: 7,
  minimumNoticeHours: 24,
  slotIntervalMinutes: 30,
  businessHours: {
    1: [{ start: "09:00", end: "11:00" }],
    2: [{ start: "09:00", end: "11:00" }],
  },
  blockedTimes: [
    {
      date: "2026-09-15",
      start: "10:00",
      end: "10:30",
      reason: "Test block",
    },
  ],
  unavailableDates: [
    {
      date: "2026-09-16",
      reason: "Test unavailable date",
    },
  ],
};

function appointment(
  overrides: Partial<AppointmentRecord> = {},
): AppointmentRecord {
  return {
    id: "appt-test",
    consultationTypeId: consultationType.id,
    date: "2026-09-15",
    startTime: "09:30",
    endTime: "10:00",
    timeZone: config.timeZone,
    status: "PENDING_PAYMENT",
    paymentStatus: "PAYMENT_REQUIRED",
    holdExpiresAt: "2026-09-14T20:00:00.000Z",
    processedStripeEventIds: [],
    client: {
      fullName: "Test Client",
      email: "test@example.com",
      phone: "+1 604 555 0100",
      country: "Canada",
      interest: "express-entry",
      preferredLanguage: "English",
      situation: "Testing booking availability overlap behaviour.",
      consent: true,
    },
    createdAt: "2026-09-14T19:00:00.000Z",
    updatedAt: "2026-09-14T19:00:00.000Z",
    ...overrides,
  };
}

test("available slots exclude active appointment overlaps and blocked times", () => {
  const slots = getAvailableSlots({
    appointments: [appointment()],
    config,
    consultationType,
    now: new Date("2026-09-13T16:00:00.000Z"),
  });
  const slotKeys = slots.map((slot) => `${slot.date} ${slot.startTime}`);

  assert.ok(slotKeys.includes("2026-09-15 09:00"));
  assert.ok(!slotKeys.includes("2026-09-15 09:30"));
  assert.ok(!slotKeys.includes("2026-09-15 10:00"));
});

test("cancelled appointments do not block future slots", () => {
  assert.equal(
    isSlotAvailable({
      appointments: [appointment({ status: "CANCELLED" })],
      config,
      consultationType,
      date: "2026-09-15",
      now: new Date("2026-09-13T16:00:00.000Z"),
      startTime: "09:30",
    }),
    true,
  );
});

test("minimum notice and unavailable dates are enforced", () => {
  assert.equal(
    isSlotAvailable({
      appointments: [],
      config,
      consultationType,
      date: "2026-09-15",
      now: new Date("2026-09-14T20:30:00.000Z"),
      startTime: "09:00",
    }),
    false,
  );

  assert.equal(
    isSlotAvailable({
      appointments: [],
      config,
      consultationType,
      date: "2026-09-16",
      now: new Date("2026-09-13T16:00:00.000Z"),
      startTime: "09:00",
    }),
    false,
  );
});
