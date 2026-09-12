import crypto from "node:crypto";
import { appointmentLifecyclePolicy, bookingAvailability } from "../../data/booking";
import { siteConfig } from "../../data/site";
import {
  createAppointmentReminderEmail,
  createCancelledAppointmentEmail,
  createManagementLinkEmail,
  createRescheduledAppointmentEmail,
} from "../email/templates";
import { getEmailFromAddress, sendEmail as defaultSendEmail } from "../email/provider";
import { getAvailableSlots, getConsultationType, isSlotAvailable } from "./availability";
import {
  getAppointmentReminderRepository,
  getAppointmentRepository,
} from "./repository";
import { addMinutesToTime, appointmentStartInstant } from "./timezone";
import { recordAuditEntry } from "../admin/audit";
import type { CalendarAdapter } from "../calendar/google";
import { googleCalendarAdapter } from "../calendar/google";
import type { EmailMessage, EmailSendResult } from "../email/provider";
import type { AdminIdentity } from "../../types/admin";
import type {
  AppointmentRecord,
  AppointmentReminderRecord,
  AppointmentReminderType,
  AvailabilitySlot,
} from "../../types/booking";

type LifecycleOptions = {
  calendarAdapter?: CalendarAdapter;
  now?: () => Date;
  sendEmail?: (message: EmailMessage) => Promise<EmailSendResult>;
};

type AddressedEmailTemplate = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

export class AppointmentLifecycleError extends Error {
  code:
    | "INVALID_TOKEN"
    | "MISSING_APPOINTMENT"
    | "NOTICE_RESTRICTED"
    | "UNAVAILABLE_SLOT";

  constructor(code: AppointmentLifecycleError["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "AppointmentLifecycleError";
  }
}

function hashManagementToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createManagementToken() {
  return crypto
    .randomBytes(appointmentLifecyclePolicy.managementTokenBytes)
    .toString("base64url");
}

export function getManagementUrl(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.domain;

  return `${baseUrl.replace(/\/$/, "")}/appointment/manage/${token}`;
}

export async function createAppointmentManagementLink(
  appointment: AppointmentRecord,
  now = new Date(),
) {
  const token = createManagementToken();
  const updated = await getAppointmentRepository().setManagementTokenHash(
    appointment.id,
    {
      createdAt: now.toISOString(),
      hash: hashManagementToken(token),
    },
  );

  if (!updated) {
    throw new AppointmentLifecycleError(
      "MISSING_APPOINTMENT",
      "Appointment not found.",
    );
  }

  return {
    appointment: updated,
    token,
    url: getManagementUrl(token),
  };
}

export async function getAppointmentByManagementToken(token: string) {
  if (!token || token.length < 32) {
    throw new AppointmentLifecycleError("INVALID_TOKEN", "Invalid appointment link.");
  }

  const appointment = await getAppointmentRepository().findByManagementTokenHash(
    hashManagementToken(token),
  );

  if (!appointment || appointment.managementTokenRevokedAt) {
    throw new AppointmentLifecycleError("INVALID_TOKEN", "Invalid appointment link.");
  }

  return appointment;
}

export function isInsideNoticeWindow({
  appointment,
  noticeHours,
  now = new Date(),
}: {
  appointment: AppointmentRecord;
  noticeHours: number;
  now?: Date;
}) {
  const start = appointmentStartInstant(appointment).getTime();

  return start - now.getTime() < noticeHours * 60 * 60 * 1000;
}

export async function getManagementPageData(token: string, now = new Date()) {
  const appointment = await getAppointmentByManagementToken(token);
  const consultationType = getConsultationType(appointment.consultationTypeId);
  const appointments = (await getAppointmentRepository().list()).filter(
    (item) => item.id !== appointment.id,
  );
  const slots = consultationType
    ? getAvailableSlots({ appointments, consultationType, now }).slice(0, 40)
    : [];
  const restricted = isInsideNoticeWindow({
    appointment,
    noticeHours: appointmentLifecyclePolicy.minimumRescheduleNoticeHours,
    now,
  });

  return {
    appointment,
    canCancel: appointment.status === "CONFIRMED" && !restricted,
    canReschedule: appointment.status === "CONFIRMED" && !restricted,
    consultationType,
    slots,
  };
}

function assertSelfServiceAllowed(
  appointment: AppointmentRecord,
  now: Date,
  noticeHours: number,
) {
  if (appointment.status !== "CONFIRMED") {
    throw new AppointmentLifecycleError(
      "NOTICE_RESTRICTED",
      "Only confirmed appointments can be changed online.",
    );
  }

  if (isInsideNoticeWindow({ appointment, noticeHours, now })) {
    throw new AppointmentLifecycleError(
      "NOTICE_RESTRICTED",
      "This appointment is inside the online change window. Please contact the office.",
    );
  }
}

async function sendLifecycleEmail({
  email,
  sendEmail,
}: {
  email: AddressedEmailTemplate;
  sendEmail: (message: EmailMessage) => Promise<EmailSendResult>;
}) {
  const from = getEmailFromAddress() || "disabled@example.invalid";

  return sendEmail({
    ...email,
    from,
    to: email.to,
  });
}

export async function rescheduleAppointment({
  actor,
  date,
  options = {},
  overrideNotice = false,
  startTime,
  token,
  appointmentId,
}: {
  actor: "admin" | "client";
  appointmentId?: string;
  date: string;
  options?: LifecycleOptions;
  overrideNotice?: boolean;
  startTime: string;
  token?: string;
}) {
  const now = options.now?.() ?? new Date();
  const appointment = token
    ? await getAppointmentByManagementToken(token)
    : appointmentId
      ? await getAppointmentRepository().findById(appointmentId)
      : null;

  if (!appointment) {
    throw new AppointmentLifecycleError(
      "MISSING_APPOINTMENT",
      "Appointment not found.",
    );
  }

  if (!overrideNotice) {
    assertSelfServiceAllowed(
      appointment,
      now,
      appointmentLifecyclePolicy.minimumRescheduleNoticeHours,
    );
  }

  const consultationType = getConsultationType(appointment.consultationTypeId);

  if (!consultationType) {
    throw new AppointmentLifecycleError(
      "MISSING_APPOINTMENT",
      "Consultation type not found.",
    );
  }

  const appointments = (await getAppointmentRepository().list()).filter(
    (item) => item.id !== appointment.id,
  );
  const available = isSlotAvailable({
    appointments,
    consultationType,
    date,
    now,
    startTime,
  });

  if (!available) {
    throw new AppointmentLifecycleError(
      "UNAVAILABLE_SLOT",
      "Selected appointment time is no longer available.",
    );
  }

  const updated = await getAppointmentRepository().updateSchedule(appointment.id, {
    date,
    endTime: addMinutesToTime(startTime, consultationType.durationMinutes),
    startTime,
    timeZone: bookingAvailability.timeZone,
  });

  if (!updated) {
    throw new AppointmentLifecycleError(
      "MISSING_APPOINTMENT",
      "Appointment not found.",
    );
  }

  const calendar = await (options.calendarAdapter ?? googleCalendarAdapter)
    .updateAppointment(updated)
    .catch((error: Error) => ({
      message: error.message,
      status: "FAILED" as const,
    }));
  await getAppointmentRepository().updateCalendarSync(updated.id, {
    eventId: calendar.eventId,
    eventUrl: calendar.eventUrl,
    lastSyncedAt: now.toISOString(),
    status: calendar.status,
  });

  if (calendar.status === "FAILED") {
    recordAuditEntry({
      action: "CALENDAR_SYNC_FAILED",
      adminId: actor,
      entity: "appointment",
      entityId: updated.id,
      timestamp: now.toISOString(),
    });
  }

  await scheduleAppointmentReminders(updated, { now });
  const managementLink = await createAppointmentManagementLink(updated, now);
  await sendLifecycleEmail({
    email: createRescheduledAppointmentEmail({
      appointment: updated,
      consultationType,
      managementUrl: managementLink.url,
    }),
    sendEmail: options.sendEmail ?? defaultSendEmail,
  });
  recordAuditEntry({
    action:
      actor === "admin"
        ? "APPOINTMENT_RESCHEDULED_ADMIN"
        : "APPOINTMENT_RESCHEDULED_CLIENT",
    adminId: actor,
    entity: "appointment",
    entityId: updated.id,
    timestamp: now.toISOString(),
  });

  return updated;
}

export async function cancelManagedAppointment({
  actor,
  appointmentId,
  options = {},
  overrideNotice = false,
  token,
}: {
  actor: "admin" | "client";
  appointmentId?: string;
  options?: LifecycleOptions;
  overrideNotice?: boolean;
  token?: string;
}) {
  const now = options.now?.() ?? new Date();
  const appointment = token
    ? await getAppointmentByManagementToken(token)
    : appointmentId
      ? await getAppointmentRepository().findById(appointmentId)
      : null;

  if (!appointment) {
    throw new AppointmentLifecycleError(
      "MISSING_APPOINTMENT",
      "Appointment not found.",
    );
  }

  if (!overrideNotice) {
    assertSelfServiceAllowed(
      appointment,
      now,
      appointmentLifecyclePolicy.minimumCancellationNoticeHours,
    );
  }

  const updated = await getAppointmentRepository().updateAppointmentStatus(
    appointment.id,
    "CANCELLED",
  );

  if (!updated) {
    throw new AppointmentLifecycleError(
      "MISSING_APPOINTMENT",
      "Appointment not found.",
    );
  }

  updated.refundStatus ??= "NOT_REQUESTED";
  await getAppointmentReminderRepository().cancelFutureForAppointment(updated.id);

  const calendar = await (options.calendarAdapter ?? googleCalendarAdapter)
    .cancelAppointment(updated)
    .catch((error: Error) => ({
      message: error.message,
      status: "FAILED" as const,
    }));
  await getAppointmentRepository().updateCalendarSync(updated.id, {
    eventId: calendar.eventId,
    eventUrl: calendar.eventUrl,
    lastSyncedAt: now.toISOString(),
    status: calendar.status,
  });

  if (calendar.status === "FAILED") {
    recordAuditEntry({
      action: "CALENDAR_SYNC_FAILED",
      adminId: actor,
      entity: "appointment",
      entityId: updated.id,
      timestamp: now.toISOString(),
    });
  }

  const consultationType = getConsultationType(updated.consultationTypeId);

  if (consultationType) {
    await sendLifecycleEmail({
      email: createCancelledAppointmentEmail({
        appointment: updated,
        consultationType,
      }),
      sendEmail: options.sendEmail ?? defaultSendEmail,
    });
  }

  recordAuditEntry({
    action:
      actor === "admin"
        ? "APPOINTMENT_CANCELLED_ADMIN"
        : "APPOINTMENT_CANCELLED_CLIENT",
    adminId: actor,
    entity: "appointment",
    entityId: updated.id,
    timestamp: now.toISOString(),
  });

  return updated;
}

export async function scheduleAppointmentReminders(
  appointment: AppointmentRecord,
  options: { now?: Date } = {},
) {
  const repository = getAppointmentReminderRepository();

  await repository.cancelFutureForAppointment(appointment.id);

  if (appointment.status !== "CONFIRMED") {
    return [];
  }

  const now = options.now ?? new Date();
  const start = appointmentStartInstant(appointment);
  const reminders: AppointmentReminderRecord[] = [];

  for (const offset of appointmentLifecyclePolicy.reminderOffsets) {
    const scheduledFor = new Date(
      start.getTime() - offset.hoursBefore * 60 * 60 * 1000,
    );

    if (scheduledFor <= now) {
      continue;
    }

    const reminder = await repository.createOrReplace({
      appointmentId: appointment.id,
      id: `${appointment.id}:${offset.type}:${appointment.date}:${appointment.startTime}`,
      scheduledFor: scheduledFor.toISOString(),
      status: "SCHEDULED",
      type: offset.type as AppointmentReminderType,
    });

    reminders.push(reminder);
  }

  return reminders;
}

export async function sendDueAppointmentReminders(
  options: LifecycleOptions = {},
) {
  const now = options.now?.() ?? new Date();
  const repository = getAppointmentReminderRepository();
  const due = await repository.listDue(now);
  const sent: AppointmentReminderRecord[] = [];
  const failed: AppointmentReminderRecord[] = [];

  for (const reminder of due) {
    const appointment = await getAppointmentRepository().findById(reminder.appointmentId);

    if (
      !appointment ||
      ["CANCELLED", "COMPLETED", "NO_SHOW"].includes(appointment.status)
    ) {
      await repository.cancelFutureForAppointment(reminder.appointmentId);
      continue;
    }

    const consultationType = getConsultationType(appointment.consultationTypeId);

    if (!consultationType) {
      const marked = await repository.markFailed(
        reminder.id,
        "Consultation type not found.",
      );

      if (marked) {
        failed.push(marked);
      }
      continue;
    }

    try {
      const managementLink = await createAppointmentManagementLink(appointment, now);

      await sendLifecycleEmail({
        email: createAppointmentReminderEmail({
          appointment,
          consultationType,
          managementUrl: managementLink.url,
          reminderType: reminder.type,
        }),
        sendEmail: options.sendEmail ?? defaultSendEmail,
      });
      const marked = await repository.markSent(reminder.id, now.toISOString());

      if (marked) {
        sent.push(marked);
      }
      recordAuditEntry({
        action: "REMINDER_SENT",
        adminId: "scheduler",
        entity: "appointment",
        entityId: appointment.id,
        timestamp: now.toISOString(),
      });
    } catch (error) {
      const marked = await repository.markFailed(
        reminder.id,
        error instanceof Error ? error.message : "Reminder send failed.",
      );

      if (marked) {
        failed.push(marked);
      }
      recordAuditEntry({
        action: "REMINDER_FAILED",
        adminId: "scheduler",
        entity: "appointment",
        entityId: appointment.id,
        timestamp: now.toISOString(),
      });
    }
  }

  return { failed, sent };
}

export async function sendManagementLinkToClient({
  appointment,
  identity,
  options = {},
}: {
  appointment: AppointmentRecord;
  identity: AdminIdentity;
  options?: LifecycleOptions;
}) {
  const consultationType = getConsultationType(appointment.consultationTypeId);

  if (!consultationType) {
    throw new AppointmentLifecycleError(
      "MISSING_APPOINTMENT",
      "Consultation type not found.",
    );
  }

  const now = options.now?.() ?? new Date();
  const managementLink = await createAppointmentManagementLink(appointment, now);

  await sendLifecycleEmail({
    email: createManagementLinkEmail({
      appointment,
      consultationType,
      managementUrl: managementLink.url,
    }),
    sendEmail: options.sendEmail ?? defaultSendEmail,
  });
  recordAuditEntry({
    action: "MANAGEMENT_LINK_SENT",
    adminId: identity.id,
    entity: "appointment",
    entityId: appointment.id,
    timestamp: now.toISOString(),
  });

  return managementLink;
}

export function groupSlotsByDate(slots: AvailabilitySlot[]) {
  return slots.reduce<Record<string, AvailabilitySlot[]>>((groups, slot) => {
    groups[slot.date] ??= [];
    groups[slot.date].push(slot);

    return groups;
  }, {});
}
