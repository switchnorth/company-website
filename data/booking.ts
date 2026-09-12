import type {
  BookingAvailabilityConfig,
  ConsultationType,
} from "@/types/booking";

// DEVELOPMENT PLACEHOLDER DATA:
// Sample consultation prices, blocked times, and unavailable dates must be
// replaced with real business rules before production payments are enabled.
export const consultationTypes = [
  {
    id: "initial-30",
    title: "Initial Immigration Consultation",
    durationMinutes: 30,
    samplePriceCents: 7500,
    currency: "CAD",
    description:
      "A focused first consultation for questions, pathway orientation, and practical next steps.",
  },
  {
    id: "detailed-60",
    title: "Detailed Immigration Consultation",
    durationMinutes: 60,
    samplePriceCents: 15000,
    currency: "CAD",
    description:
      "A longer consultation for more complex timelines, documents, or multiple immigration options.",
  },
] as const satisfies ConsultationType[];

export const bookingAvailability: BookingAvailabilityConfig = {
  timeZone: "America/Vancouver",
  bookingHorizonDays: 21,
  minimumNoticeHours: 24,
  slotIntervalMinutes: 30,
  businessHours: {
    1: [{ start: "09:00", end: "17:00" }],
    2: [{ start: "09:00", end: "17:00" }],
    3: [{ start: "09:00", end: "17:00" }],
    4: [{ start: "09:00", end: "17:00" }],
    5: [{ start: "09:00", end: "17:00" }],
  },
  blockedTimes: [
    {
      date: "2026-09-18",
      start: "12:00",
      end: "13:00",
      reason: "Sample lunch block",
    },
  ],
  unavailableDates: [
    {
      date: "2026-09-25",
      reason: "Sample unavailable date",
    },
  ],
};

// DEVELOPMENT PLACEHOLDER POLICY:
// Rescheduling/cancellation notice, refund wording, and reminder timings must
// be reviewed and approved by the client before production use.
export const appointmentLifecyclePolicy = {
  managementTokenBytes: 32,
  minimumCancellationNoticeHours: 24,
  minimumRescheduleNoticeHours: 24,
  refundPolicyNotice:
    "Cancelling an appointment does not automatically issue a refund. Refund requests are reviewed separately according to the approved consultation policy.",
  reminderOffsets: [
    { hoursBefore: 24, type: "REMINDER_24_HOUR" },
    { hoursBefore: 2, type: "REMINDER_2_HOUR" },
  ],
} as const;

export function formatConsultationPrice(type: ConsultationType) {
  return new Intl.NumberFormat("en-CA", {
    currency: type.currency,
    style: "currency",
  }).format(type.samplePriceCents / 100);
}
