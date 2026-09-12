import type { ContactInterest } from "@/data/contact";

export type AppointmentStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type PaymentStatus =
  | "PENDING"
  | "NOT_STARTED"
  | "PAYMENT_REQUIRED"
  | "PAID"
  | "FAILED"
  | "EXPIRED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type RefundStatus =
  | "NOT_REQUESTED"
  | "PENDING"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type CalendarSyncStatus = "SYNCED" | "PENDING" | "FAILED";

export type AppointmentReminderType = "REMINDER_24_HOUR" | "REMINDER_2_HOUR";

export type AppointmentReminderStatus =
  | "CANCELLED"
  | "FAILED"
  | "SCHEDULED"
  | "SENT";

export type AppointmentReminderRecord = {
  appointmentId: string;
  failureReason?: string;
  id: string;
  scheduledFor: string;
  sentAt?: string;
  status: AppointmentReminderStatus;
  type: AppointmentReminderType;
};

export type ConsultationType = {
  id: string;
  title: string;
  durationMinutes: number;
  samplePriceCents: number;
  currency: "CAD";
  description: string;
};

export type TimeWindow = {
  start: string;
  end: string;
};

export type BlockedTime = TimeWindow & {
  date: string;
  reason: string;
};

export type UnavailableDate = {
  date: string;
  reason: string;
};

export type BookingAvailabilityConfig = {
  timeZone: string;
  bookingHorizonDays: number;
  minimumNoticeHours: number;
  slotIntervalMinutes: number;
  businessHours: Record<number, TimeWindow[]>;
  blockedTimes: BlockedTime[];
  unavailableDates: UnavailableDate[];
};

export type AvailabilitySlot = {
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  label: string;
};

export type BookingClientDetails = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  interest: ContactInterest;
  preferredLanguage: string;
  situation: string;
  consent: boolean;
};

export type BookingRequest = BookingClientDetails & {
  consultationTypeId: string;
  date: string;
  startTime: string;
};

export type AppointmentRecord = {
  id: string;
  consultationTypeId: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  calendarEventId?: string;
  calendarEventUrl?: string;
  calendarStatus?: "NOT_CONNECTED" | "NOT_CREATED" | "CREATED" | "FAILED";
  calendarLastSyncedAt?: string;
  calendarSyncStatus?: CalendarSyncStatus;
  confirmationDelivery?: "sent" | "development-disabled";
  confirmationSentAt?: string;
  managementTokenCreatedAt?: string;
  managementTokenHashes?: string[];
  managementTokenRevokedAt?: string;
  paymentAmountCents?: number;
  paymentCurrency?: string;
  paymentCreatedAt?: string;
  paymentPaidAt?: string;
  paymentFailedAt?: string;
  paymentExpiresAt?: string;
  refundStatus?: RefundStatus;
  processedStripeEventIds: string[];
  agreementId?: string;
  agreementVersion?: string;
  agreementGeneratedAt?: string;
  agreementSentAt?: string;
  agreementAcceptedAt?: string;
  agreementSignedAt?: string;
  agreementDelivery?: "sent" | "development-disabled";
  holdExpiresAt: string;
  client: BookingClientDetails;
  createdAt: string;
  updatedAt: string;
};

export type BookingFormErrors = Partial<Record<keyof BookingRequest | "form", string>>;

export type BookingFormState = {
  status: "idle" | "error" | "pending_payment" | "redirecting_to_payment";
  message: string;
  errors: BookingFormErrors;
  appointmentId?: string;
  paymentUrl?: string;
  appointment?: {
    consultationType: string;
    price: string;
    date: string;
    time: string;
    timeZone: string;
  };
};
