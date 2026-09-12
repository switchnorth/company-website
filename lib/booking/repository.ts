import type { AppointmentRecord } from "@/types/booking";
import type {
  AppointmentReminderRecord,
  CalendarSyncStatus,
} from "@/types/booking";

export type AppointmentRepository = {
  create(appointment: AppointmentRecord): Promise<AppointmentRecord>;
  findById(id: string): Promise<AppointmentRecord | null>;
  findByManagementTokenHash(tokenHash: string): Promise<AppointmentRecord | null>;
  findByStripeCheckoutSessionId(sessionId: string): Promise<AppointmentRecord | null>;
  list(): Promise<AppointmentRecord[]>;
  attachStripeCheckoutSession(
    id: string,
    payment: {
      amountCents: number;
      checkoutSessionId: string;
      currency: string;
      expiresAt: string;
      paymentIntentId?: string;
    },
  ): Promise<AppointmentRecord | null>;
  recordStripeEvent(id: string, eventId: string): Promise<"duplicate" | "recorded">;
  markPaymentSucceeded(
    id: string,
    payment: {
      amountCents: number;
      currency: string;
      eventId: string;
      paidAt: string;
      paymentIntentId?: string;
    },
  ): Promise<AppointmentRecord | null>;
  markPaymentFailed(
    id: string,
    payment: {
      eventId: string;
      failedAt: string;
      paymentIntentId?: string;
      status: "FAILED" | "EXPIRED";
    },
  ): Promise<AppointmentRecord | null>;
  releaseExpiredPaymentHolds(now?: Date): Promise<AppointmentRecord[]>;
  markAgreementSent(
    id: string,
    agreement: {
      agreementId: string;
      delivery: "sent" | "development-disabled";
      generatedAt: string;
      sentAt: string;
      version: string;
    },
  ): Promise<AppointmentRecord | null>;
  markConfirmationSent(
    id: string,
    confirmation: {
      delivery: "sent" | "development-disabled";
      sentAt: string;
    },
  ): Promise<AppointmentRecord | null>;
  setManagementTokenHash(
    id: string,
    token: {
      createdAt: string;
      hash: string;
    },
  ): Promise<AppointmentRecord | null>;
  updateCalendarSync(
    id: string,
    calendar: {
      eventId?: string;
      eventUrl?: string;
      lastSyncedAt: string;
      status: CalendarSyncStatus;
    },
  ): Promise<AppointmentRecord | null>;
  updateSchedule(
    id: string,
    schedule: {
      date: string;
      endTime: string;
      startTime: string;
      timeZone: string;
    },
  ): Promise<AppointmentRecord | null>;
  updateAppointmentStatus(
    id: string,
    status: AppointmentRecord["status"],
  ): Promise<AppointmentRecord | null>;
  updateStatus(
    id: string,
    status: AppointmentRecord["status"],
    paymentStatus: AppointmentRecord["paymentStatus"],
  ): Promise<AppointmentRecord | null>;
};

type BookingGlobal = typeof globalThis & {
  switchNorthAppointments?: AppointmentRecord[];
  switchNorthAppointmentReminders?: AppointmentReminderRecord[];
};

const activeStatuses = new Set(["PENDING_PAYMENT", "CONFIRMED"]);

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

function overlaps(
  startTime: string,
  endTime: string,
  busyStartTime: string,
  busyEndTime: string,
) {
  return (
    minutesFromTime(startTime) < minutesFromTime(busyEndTime) &&
    minutesFromTime(endTime) > minutesFromTime(busyStartTime)
  );
}

function getStore() {
  const globalForBooking = globalThis as BookingGlobal;

  if (!globalForBooking.switchNorthAppointments) {
    globalForBooking.switchNorthAppointments = [];
  }

  return globalForBooking.switchNorthAppointments;
}

function getReminderStore() {
  const globalForBooking = globalThis as BookingGlobal;

  if (!globalForBooking.switchNorthAppointmentReminders) {
    globalForBooking.switchNorthAppointmentReminders = [];
  }

  return globalForBooking.switchNorthAppointmentReminders;
}

function isActiveAppointment(item: AppointmentRecord) {
  if (!activeStatuses.has(item.status)) {
    return false;
  }

  if (item.status === "PENDING_PAYMENT") {
    return new Date(item.holdExpiresAt).getTime() > Date.now();
  }

  return true;
}

export const inMemoryAppointmentRepository: AppointmentRepository = {
  async create(appointment) {
    const store = getStore();
    const hasOverlap = store.some(
      (item) =>
        item.date === appointment.date &&
        isActiveAppointment(item) &&
        overlaps(
          appointment.startTime,
          appointment.endTime,
          item.startTime,
          item.endTime,
        ),
    );

    if (hasOverlap) {
      throw new Error("Selected appointment time is no longer available.");
    }

    store.push(appointment);

    return appointment;
  },
  async list() {
    await this.releaseExpiredPaymentHolds();

    return getStore();
  },
  async findById(id) {
    await this.releaseExpiredPaymentHolds();

    return getStore().find((item) => item.id === id) ?? null;
  },
  async findByManagementTokenHash(tokenHash) {
    await this.releaseExpiredPaymentHolds();

    return (
      getStore().find((item) =>
        (item.managementTokenHashes ?? []).includes(tokenHash),
      ) ?? null
    );
  },
  async findByStripeCheckoutSessionId(sessionId) {
    await this.releaseExpiredPaymentHolds();

    return (
      getStore().find((item) => item.stripeCheckoutSessionId === sessionId) ?? null
    );
  },
  async attachStripeCheckoutSession(id, payment) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.stripeCheckoutSessionId = payment.checkoutSessionId;
    appointment.stripePaymentIntentId = payment.paymentIntentId;
    appointment.paymentAmountCents = payment.amountCents;
    appointment.paymentCurrency = payment.currency;
    appointment.paymentCreatedAt = new Date().toISOString();
    appointment.paymentExpiresAt = payment.expiresAt;
    appointment.paymentStatus = "PAYMENT_REQUIRED";
    appointment.holdExpiresAt = payment.expiresAt;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async recordStripeEvent(id, eventId) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return "recorded";
    }

    appointment.processedStripeEventIds ??= [];

    if (appointment.processedStripeEventIds.includes(eventId)) {
      return "duplicate";
    }

    appointment.processedStripeEventIds.push(eventId);
    appointment.updatedAt = new Date().toISOString();

    return "recorded";
  },
  async markPaymentSucceeded(id, payment) {
    const eventStatus = await this.recordStripeEvent(id, payment.eventId);
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    if (eventStatus === "duplicate" || appointment.paymentStatus === "PAID") {
      return appointment;
    }

    appointment.status = "CONFIRMED";
    appointment.paymentStatus = "PAID";
    appointment.refundStatus ??= "NOT_REQUESTED";
    appointment.stripePaymentIntentId =
      payment.paymentIntentId ?? appointment.stripePaymentIntentId;
    appointment.paymentAmountCents = payment.amountCents;
    appointment.paymentCurrency = payment.currency;
    appointment.paymentPaidAt = payment.paidAt;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async markPaymentFailed(id, payment) {
    const eventStatus = await this.recordStripeEvent(id, payment.eventId);
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    if (eventStatus === "duplicate" || appointment.paymentStatus === "PAID") {
      return appointment;
    }

    appointment.status = "CANCELLED";
    appointment.paymentStatus = payment.status;
    appointment.stripePaymentIntentId =
      payment.paymentIntentId ?? appointment.stripePaymentIntentId;
    appointment.paymentFailedAt = payment.failedAt;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async releaseExpiredPaymentHolds(now = new Date()) {
    const released: AppointmentRecord[] = [];

    for (const appointment of getStore()) {
      if (
        appointment.status === "PENDING_PAYMENT" &&
        new Date(appointment.holdExpiresAt).getTime() <= now.getTime()
      ) {
        appointment.status = "CANCELLED";
        appointment.paymentStatus = "EXPIRED";
        appointment.paymentFailedAt = now.toISOString();
        appointment.updatedAt = now.toISOString();
        released.push(appointment);
      }
    }

    return released;
  },
  async markAgreementSent(id, agreement) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.agreementId = agreement.agreementId;
    appointment.agreementVersion = agreement.version;
    appointment.agreementGeneratedAt = agreement.generatedAt;
    appointment.agreementSentAt = agreement.sentAt;
    appointment.agreementDelivery = agreement.delivery;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async markConfirmationSent(id, confirmation) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.confirmationDelivery = confirmation.delivery;
    appointment.confirmationSentAt = confirmation.sentAt;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async setManagementTokenHash(id, token) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.managementTokenHashes ??= [];

    if (!appointment.managementTokenHashes.includes(token.hash)) {
      appointment.managementTokenHashes.push(token.hash);
    }

    appointment.managementTokenCreatedAt = token.createdAt;
    appointment.managementTokenRevokedAt = undefined;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async updateCalendarSync(id, calendar) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.calendarEventId = calendar.eventId ?? appointment.calendarEventId;
    appointment.calendarEventUrl = calendar.eventUrl ?? appointment.calendarEventUrl;
    appointment.calendarLastSyncedAt = calendar.lastSyncedAt;
    appointment.calendarSyncStatus = calendar.status;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async updateSchedule(id, schedule) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.date = schedule.date;
    appointment.startTime = schedule.startTime;
    appointment.endTime = schedule.endTime;
    appointment.timeZone = schedule.timeZone;
    appointment.calendarSyncStatus = "PENDING";
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async updateAppointmentStatus(id, status) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.status = status;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
  async updateStatus(id, status, paymentStatus) {
    const appointment = getStore().find((item) => item.id === id);

    if (!appointment) {
      return null;
    }

    appointment.status = status;
    appointment.paymentStatus = paymentStatus;
    appointment.updatedAt = new Date().toISOString();

    return appointment;
  },
};

export function getAppointmentRepository(): AppointmentRepository {
  return inMemoryAppointmentRepository;
}

export function clearDevelopmentAppointments() {
  getStore().splice(0);
  getReminderStore().splice(0);
}

export type AppointmentReminderRepository = {
  cancelFutureForAppointment(appointmentId: string): Promise<void>;
  createOrReplace(reminder: AppointmentReminderRecord): Promise<AppointmentReminderRecord>;
  findById(id: string): Promise<AppointmentReminderRecord | null>;
  list(): Promise<AppointmentReminderRecord[]>;
  listByAppointment(appointmentId: string): Promise<AppointmentReminderRecord[]>;
  listDue(now: Date): Promise<AppointmentReminderRecord[]>;
  markFailed(id: string, failureReason: string): Promise<AppointmentReminderRecord | null>;
  markSent(id: string, sentAt: string): Promise<AppointmentReminderRecord | null>;
  resetFailed(id: string): Promise<AppointmentReminderRecord | null>;
};

export const inMemoryReminderRepository: AppointmentReminderRepository = {
  async cancelFutureForAppointment(appointmentId) {
    for (const reminder of getReminderStore()) {
      if (
        reminder.appointmentId === appointmentId &&
        reminder.status === "SCHEDULED"
      ) {
        reminder.status = "CANCELLED";
      }
    }
  },
  async createOrReplace(reminder) {
    const store = getReminderStore();
    const existingIndex = store.findIndex((item) => item.id === reminder.id);

    if (existingIndex >= 0) {
      store[existingIndex] = reminder;
    } else {
      store.push(reminder);
    }

    return reminder;
  },
  async findById(id) {
    return getReminderStore().find((item) => item.id === id) ?? null;
  },
  async list() {
    return [...getReminderStore()];
  },
  async listByAppointment(appointmentId) {
    return getReminderStore().filter((item) => item.appointmentId === appointmentId);
  },
  async listDue(now) {
    return getReminderStore().filter(
      (item) =>
        item.status === "SCHEDULED" &&
        new Date(item.scheduledFor).getTime() <= now.getTime(),
    );
  },
  async markFailed(id, failureReason) {
    const reminder = getReminderStore().find((item) => item.id === id);

    if (!reminder) {
      return null;
    }

    reminder.status = "FAILED";
    reminder.failureReason = failureReason;

    return reminder;
  },
  async markSent(id, sentAt) {
    const reminder = getReminderStore().find((item) => item.id === id);

    if (!reminder || reminder.status === "SENT") {
      return reminder ?? null;
    }

    reminder.status = "SENT";
    reminder.sentAt = sentAt;
    reminder.failureReason = undefined;

    return reminder;
  },
  async resetFailed(id) {
    const reminder = getReminderStore().find((item) => item.id === id);

    if (!reminder || reminder.status !== "FAILED") {
      return reminder ?? null;
    }

    reminder.status = "SCHEDULED";
    reminder.failureReason = undefined;

    return reminder;
  },
};

export function getAppointmentReminderRepository() {
  return inMemoryReminderRepository;
}
