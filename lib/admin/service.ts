import { agreementDefaults, serviceAgreementVersion } from "../../data/agreement";
import { formatConsultationPrice } from "../../data/booking";
import { getConsultationType } from "../booking/availability";
import { getAppointmentRepository } from "../booking/repository";
import { sendAppointmentConfirmation } from "../lead-workflow";
import {
  getEmailFromAddress,
  getLeadNotificationRecipient,
  sendEmail as defaultSendEmail,
} from "../email/provider";
import { createServiceAgreementEmail } from "../email/templates";
import {
  createServiceAgreementData,
  generateServiceAgreementPdf,
} from "../agreement/generator";
import { assertAdmin } from "./auth";
import { listAuditEntries, recordAuditEntry } from "./audit";
import type { EmailMessage, EmailSendResult } from "../email/provider";
import type {
  AdminAppointmentFilters,
  AdminAppointmentRow,
  AdminClientSummary,
  AdminDashboardSummary,
  AdminIdentity,
  AgreementStatus,
  CalendarStatus,
} from "../../types/admin";
import type {
  AppointmentRecord,
  AppointmentStatus,
  PaymentStatus,
} from "../../types/booking";

export class AdminRecordNotFoundError extends Error {
  constructor(message = "The requested admin record could not be found.") {
    super(message);
    this.name = "AdminRecordNotFoundError";
  }
}

export type AdminActionResult = {
  message: string;
  status: "error" | "success";
};

type AdminActionOptions = {
  sendEmail?: (message: EmailMessage) => Promise<EmailSendResult>;
  now?: () => Date;
};

function dateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Vancouver",
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function startOfToday(now = new Date()) {
  return new Date(`${dateKey(now)}T00:00:00.000-08:00`);
}

function appointmentDateTime(appointment: AppointmentRecord) {
  return new Date(`${appointment.date}T${appointment.startTime}:00`);
}

function sortAppointments(
  left: AppointmentRecord,
  right: AppointmentRecord,
  direction: "asc" | "desc" = "asc",
) {
  const diff =
    appointmentDateTime(left).getTime() - appointmentDateTime(right).getTime();

  return direction === "asc" ? diff : -diff;
}

export function getAgreementStatus(
  appointment: AppointmentRecord,
): AgreementStatus {
  if (appointment.agreementSignedAt) {
    return "SIGNED";
  }

  if (appointment.agreementAcceptedAt) {
    return "ACCEPTED";
  }

  if (appointment.agreementSentAt) {
    return "SENT";
  }

  if (appointment.agreementGeneratedAt) {
    return "GENERATED";
  }

  return "NOT_GENERATED";
}

export function getCalendarStatus(
  appointment: AppointmentRecord,
): CalendarStatus {
  return appointment.calendarStatus ?? "NOT_CONNECTED";
}

function createAppointmentRow(appointment: AppointmentRecord): AdminAppointmentRow {
  return {
    agreementStatus: getAgreementStatus(appointment),
    appointment,
    calendarStatus: getCalendarStatus(appointment),
    consultationTitle:
      getConsultationType(appointment.consultationTypeId)?.title ??
      appointment.consultationTypeId,
  };
}

function matchesFilters(
  row: AdminAppointmentRow,
  filters: AdminAppointmentFilters,
) {
  const search = filters.search?.trim().toLowerCase();

  if (filters.date && row.appointment.date !== filters.date) {
    return false;
  }

  if (
    filters.status &&
    filters.status !== "all" &&
    row.appointment.status !== filters.status
  ) {
    return false;
  }

  if (
    filters.paymentStatus &&
    filters.paymentStatus !== "all" &&
    row.appointment.paymentStatus !== filters.paymentStatus
  ) {
    return false;
  }

  if (!search) {
    return true;
  }

  return (
    row.appointment.client.fullName.toLowerCase().includes(search) ||
    row.appointment.client.email.toLowerCase().includes(search)
  );
}

export async function listAdminAppointmentRows(
  identity: AdminIdentity | null,
  filters: AdminAppointmentFilters = {},
) {
  assertAdmin(identity);

  const appointments = await getAppointmentRepository().list();

  return appointments
    .map(createAppointmentRow)
    .filter((row) => matchesFilters(row, filters))
    .sort((left, right) => sortAppointments(left.appointment, right.appointment));
}

export async function getAdminAppointmentDetail(
  identity: AdminIdentity | null,
  id: string,
) {
  assertAdmin(identity);

  const appointment = await getAppointmentRepository().findById(id);

  if (!appointment) {
    throw new AdminRecordNotFoundError("Appointment not found.");
  }

  return createAppointmentRow(appointment);
}

export async function getAdminDashboardSummary(
  identity: AdminIdentity | null,
  now = new Date(),
): Promise<AdminDashboardSummary> {
  const rows = await listAdminAppointmentRows(identity);
  const today = dateKey(now);
  const weekEnd = new Date(startOfToday(now).getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    agreementsNotSent: rows.filter(
      (row) =>
        row.appointment.status === "CONFIRMED" &&
        row.agreementStatus !== "SENT" &&
        row.agreementStatus !== "ACCEPTED" &&
        row.agreementStatus !== "SIGNED",
    ).length,
    appointmentsThisWeek: rows.filter((row) => {
      const date = appointmentDateTime(row.appointment);

      return date >= startOfToday(now) && date < weekEnd;
    }).length,
    appointmentsToday: rows.filter((row) => row.appointment.date === today).length,
    cancelledAppointments: rows
      .filter((row) => row.appointment.status === "CANCELLED")
      .slice(0, 6),
    confirmedAppointments: rows
      .filter((row) => row.appointment.status === "CONFIRMED")
      .slice(0, 6),
    pendingPayments: rows
      .filter((row) => row.appointment.status === "PENDING_PAYMENT")
      .slice(0, 6),
    recentPayments: [...rows]
      .filter((row) => Boolean(row.appointment.paymentPaidAt))
      .sort((left, right) =>
        String(right.appointment.paymentPaidAt).localeCompare(
          String(left.appointment.paymentPaidAt),
        ),
      )
      .slice(0, 6),
    todayAppointments: rows
      .filter((row) => row.appointment.date === today)
      .slice(0, 6),
    upcomingAppointments: rows
      .filter((row) => appointmentDateTime(row.appointment) >= now)
      .slice(0, 8),
  };
}

function encodeClientId(email: string) {
  return Buffer.from(email.toLowerCase()).toString("base64url");
}

function decodeClientId(id: string) {
  return Buffer.from(id, "base64url").toString("utf8");
}

export async function listAdminClients(identity: AdminIdentity | null) {
  const rows = await listAdminAppointmentRows(identity);
  const clients = new Map<string, AdminClientSummary>();
  const now = new Date();

  for (const row of rows) {
    const appointment = row.appointment;
    const emailKey = appointment.client.email.toLowerCase();
    const existing = clients.get(emailKey);

    if (!existing) {
      clients.set(emailKey, {
        appointmentCount: 1,
        email: appointment.client.email,
        id: encodeClientId(appointment.client.email),
        lastAppointment: appointment,
        name: appointment.client.fullName,
        nextAppointment:
          appointmentDateTime(appointment) >= now ? appointment : undefined,
        phone: appointment.client.phone,
      });
      continue;
    }

    existing.appointmentCount += 1;

    if (
      !existing.lastAppointment ||
      sortAppointments(appointment, existing.lastAppointment, "desc") < 0
    ) {
      existing.lastAppointment = appointment;
    }

    if (
      appointmentDateTime(appointment) >= now &&
      (!existing.nextAppointment ||
        sortAppointments(appointment, existing.nextAppointment) < 0)
    ) {
      existing.nextAppointment = appointment;
    }
  }

  return [...clients.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

export async function getAdminClientDetail(
  identity: AdminIdentity | null,
  id: string,
) {
  const email = decodeClientId(id);
  const rows = await listAdminAppointmentRows(identity, { search: email });
  const matchingRows = rows.filter(
    (row) => row.appointment.client.email.toLowerCase() === email,
  );

  if (matchingRows.length === 0) {
    throw new AdminRecordNotFoundError("Client not found.");
  }

  return {
    appointments: matchingRows,
    client: matchingRows[0].appointment.client,
  };
}

async function updateAppointmentStatus({
  action,
  id,
  identity,
  paymentStatus,
  status,
}: {
  action:
    | "APPOINTMENT_CANCELLED"
    | "APPOINTMENT_COMPLETED"
    | "APPOINTMENT_CONFIRMED"
    | "APPOINTMENT_NO_SHOW";
  id: string;
  identity: AdminIdentity | null;
  paymentStatus?: PaymentStatus;
  status: AppointmentStatus;
}) {
  const admin = assertAdmin(identity);
  const repository = getAppointmentRepository();
  const appointment = await repository.findById(id);

  if (!appointment) {
    throw new AdminRecordNotFoundError("Appointment not found.");
  }

  const updated = paymentStatus
    ? await repository.updateStatus(id, status, paymentStatus)
    : await repository.updateAppointmentStatus(id, status);

  recordAuditEntry({
    action,
    adminId: admin.id,
    entity: "appointment",
    entityId: id,
  });

  return updated;
}

export async function confirmAppointmentManually(
  identity: AdminIdentity | null,
  id: string,
) {
  const appointment = await getAppointmentRepository().findById(id);
  const paymentStatus =
    appointment?.paymentStatus === "PAID" ? "PAID" : ("PENDING" as const);

  await updateAppointmentStatus({
    action: "APPOINTMENT_CONFIRMED",
    id,
    identity,
    paymentStatus,
    status: "CONFIRMED",
  });

  return { message: "Appointment confirmed.", status: "success" } satisfies AdminActionResult;
}

export async function cancelAppointment(identity: AdminIdentity | null, id: string) {
  await updateAppointmentStatus({
    action: "APPOINTMENT_CANCELLED",
    id,
    identity,
    status: "CANCELLED",
  });

  return { message: "Appointment cancelled.", status: "success" } satisfies AdminActionResult;
}

export async function markAppointmentCompleted(
  identity: AdminIdentity | null,
  id: string,
) {
  await updateAppointmentStatus({
    action: "APPOINTMENT_COMPLETED",
    id,
    identity,
    status: "COMPLETED",
  });

  return { message: "Appointment marked completed.", status: "success" } satisfies AdminActionResult;
}

export async function markAppointmentNoShow(
  identity: AdminIdentity | null,
  id: string,
) {
  await updateAppointmentStatus({
    action: "APPOINTMENT_NO_SHOW",
    id,
    identity,
    status: "NO_SHOW",
  });

  return { message: "Appointment marked no-show.", status: "success" } satisfies AdminActionResult;
}

export async function resendAppointmentConfirmation(
  identity: AdminIdentity | null,
  id: string,
) {
  const admin = assertAdmin(identity);
  const repository = getAppointmentRepository();
  const appointment = await repository.findById(id);

  if (!appointment) {
    throw new AdminRecordNotFoundError("Appointment not found.");
  }

  const consultationType = getConsultationType(appointment.consultationTypeId);

  if (!consultationType) {
    return {
      message: "Consultation type is missing.",
      status: "error",
    } satisfies AdminActionResult;
  }

  const delivery = await sendAppointmentConfirmation({ appointment, consultationType });

  await repository.markConfirmationSent(id, {
    delivery,
    sentAt: new Date().toISOString(),
  });
  recordAuditEntry({
    action: "CONFIRMATION_RESENT",
    adminId: admin.id,
    entity: "appointment",
    entityId: id,
  });

  return { message: "Confirmation email resent.", status: "success" } satisfies AdminActionResult;
}

export async function resendAgreementEmail(
  identity: AdminIdentity | null,
  id: string,
  options: AdminActionOptions = {},
) {
  const admin = assertAdmin(identity);
  const repository = getAppointmentRepository();
  const appointment = await repository.findById(id);

  if (!appointment) {
    throw new AdminRecordNotFoundError("Appointment not found.");
  }

  if (appointment.status !== "CONFIRMED" || appointment.paymentStatus !== "PAID") {
    return {
      message: "Agreement email can only be sent for paid, confirmed appointments.",
      status: "error",
    } satisfies AdminActionResult;
  }

  const consultationType = getConsultationType(appointment.consultationTypeId);

  if (!consultationType) {
    return {
      message: "Consultation type is missing.",
      status: "error",
    } satisfies AdminActionResult;
  }

  const agreement = createServiceAgreementData({ appointment, consultationType });

  agreement.agreementId = appointment.agreementId ?? agreement.agreementId;
  agreement.agreementVersion = appointment.agreementVersion ?? serviceAgreementVersion;
  agreement.tax = agreement.tax || agreementDefaults.tax;

  const generated = await generateServiceAgreementPdf(agreement);
  const email = createServiceAgreementEmail({
    agreement,
    appointment,
    consultationType,
  });
  const sendEmail = options.sendEmail ?? defaultSendEmail;
  const from = getEmailFromAddress() || "disabled@example.invalid";
  const delivery = await sendEmail({
    ...email,
    attachments: [
      {
        content: generated.pdf,
        contentType: "application/pdf",
        filename: generated.fileName,
      },
    ],
    from,
    to: appointment.client.email,
  });
  const notificationTo = getLeadNotificationRecipient();

  if (getEmailFromAddress() && notificationTo) {
    await sendEmail({
      ...email,
      attachments: [
        {
          content: generated.pdf,
          contentType: "application/pdf",
          filename: generated.fileName,
        },
      ],
      from: getEmailFromAddress(),
      replyTo: appointment.client.email,
      subject: `Service Agreement resent: ${appointment.client.fullName}`,
      to: notificationTo,
    });
  }

  await repository.markAgreementSent(id, {
    agreementId: generated.agreementId,
    delivery: delivery.delivery,
    generatedAt: generated.generatedAt,
    sentAt: (options.now?.() ?? new Date()).toISOString(),
    version: generated.agreementVersion,
  });
  recordAuditEntry({
    action: appointment.agreementSentAt ? "AGREEMENT_RESENT" : "AGREEMENT_REGENERATED",
    adminId: admin.id,
    entity: "agreement",
    entityId: id,
  });

  return { message: "Agreement email sent.", status: "success" } satisfies AdminActionResult;
}

export function listAdminAuditLog(identity: AdminIdentity | null) {
  assertAdmin(identity);

  return listAuditEntries();
}

export function formatPaymentAmount(appointment: AppointmentRecord) {
  if (!appointment.paymentAmountCents || !appointment.paymentCurrency) {
    const consultationType = getConsultationType(appointment.consultationTypeId);

    return consultationType ? formatConsultationPrice(consultationType) : "Not recorded";
  }

  return new Intl.NumberFormat("en-CA", {
    currency: appointment.paymentCurrency.toUpperCase(),
    style: "currency",
  }).format(appointment.paymentAmountCents / 100);
}
