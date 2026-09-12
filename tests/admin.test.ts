import assert from "node:assert/strict";
import test from "node:test";
import {
  AdminAuthorizationError,
  createAdminSessionToken,
  verifyAdminCredentials,
  verifyAdminSessionToken,
} from "../lib/admin/auth";
import { getAdminAppointmentsApiResponse } from "../lib/admin/api";
import { clearAuditEntries, listAuditEntries } from "../lib/admin/audit";
import {
  cancelAppointment,
  confirmAppointmentManually,
  getAdminAppointmentDetail,
  listAdminAppointmentRows,
  resendAgreementEmail,
  resendAppointmentConfirmation,
} from "../lib/admin/service";
import {
  clearDevelopmentAppointments,
  inMemoryAppointmentRepository,
} from "../lib/booking/repository";
import type { EmailMessage, EmailSendResult } from "../lib/email/provider";
import type { AdminIdentity } from "../types/admin";
import type { AppointmentRecord } from "../types/booking";

const admin: AdminIdentity = {
  id: "admin:admin",
  username: "admin",
};

function appointment(
  overrides: Partial<AppointmentRecord> = {},
): AppointmentRecord {
  return {
    id: "appt-admin-test",
    consultationTypeId: "initial-30",
    date: "2026-09-14",
    startTime: "09:00",
    endTime: "09:30",
    timeZone: "America/Vancouver",
    status: "PENDING_PAYMENT",
    paymentStatus: "PAYMENT_REQUIRED",
    stripeCheckoutSessionId: "cs_admin_test",
    stripePaymentIntentId: "pi_admin_test",
    paymentAmountCents: 7500,
    paymentCurrency: "cad",
    paymentCreatedAt: "2026-09-13T19:00:00.000Z",
    paymentExpiresAt: "2026-09-13T19:35:00.000Z",
    holdExpiresAt: "2026-09-13T19:35:00.000Z",
    processedStripeEventIds: [],
    client: {
      fullName: "Admin Client",
      email: "admin-client@example.com",
      phone: "+1 604 555 0166",
      country: "Canada",
      interest: "work-permit",
      preferredLanguage: "English",
      situation: "I need help reviewing consultation options.",
      consent: true,
    },
    createdAt: "2026-09-13T19:00:00.000Z",
    updatedAt: "2026-09-13T19:00:00.000Z",
    ...overrides,
  };
}

test("admin credentials create and verify a signed session token", () => {
  process.env.ADMIN_USERNAME = "admin";
  process.env.ADMIN_PASSWORD = "correct-password";
  process.env.ADMIN_SESSION_SECRET = "test-admin-session-secret";

  const identity = verifyAdminCredentials("admin", "correct-password");

  assert.deepEqual(identity, admin);

  const token = createAdminSessionToken(admin, new Date("2026-09-13T10:00:00Z"));

  assert.deepEqual(
    verifyAdminSessionToken(token, new Date("2026-09-13T10:01:00Z")),
    admin,
  );
  assert.equal(verifyAdminSessionToken(`${token}tampered`), null);
  assert.equal(verifyAdminCredentials("admin", "wrong-password"), null);
});

test("admin appointment listing and detail require authorization", async () => {
  clearDevelopmentAppointments();
  await inMemoryAppointmentRepository.create(appointment());

  await assert.rejects(
    () => listAdminAppointmentRows(null),
    AdminAuthorizationError,
  );
  await assert.rejects(
    () => getAdminAppointmentDetail(null, "appt-admin-test"),
    AdminAuthorizationError,
  );

  const rows = await listAdminAppointmentRows(admin, { search: "admin-client" });
  const detail = await getAdminAppointmentDetail(admin, "appt-admin-test");

  assert.equal(rows.length, 1);
  assert.equal(detail.appointment.client.email, "admin-client@example.com");
  assert.equal(detail.agreementStatus, "NOT_GENERATED");
});

test("admin appointment API response rejects unauthorized access", async () => {
  const response = await getAdminAppointmentsApiResponse(
    null,
    "https://switchnorth.ca/admin/api/appointments",
  );

  assert.equal(response.status, 401);
  assert.deepEqual(response.body, { error: "Unauthorized" });
});

test("admin status changes preserve payment records and write audit entries", async () => {
  clearAuditEntries();

  await confirmAppointmentManually(admin, "appt-admin-test");
  let updated = await inMemoryAppointmentRepository.findById("appt-admin-test");

  assert.equal(updated?.status, "CONFIRMED");
  assert.equal(updated?.paymentStatus, "PENDING");
  assert.equal(updated?.stripePaymentIntentId, "pi_admin_test");

  await cancelAppointment(admin, "appt-admin-test");
  updated = await inMemoryAppointmentRepository.findById("appt-admin-test");

  assert.equal(updated?.status, "CANCELLED");
  assert.equal(updated?.stripePaymentIntentId, "pi_admin_test");
  assert.deepEqual(
    listAuditEntries().map((entry) => entry.action),
    ["APPOINTMENT_CANCELLED", "APPOINTMENT_CONFIRMED"],
  );
});

test("admin can resend confirmation email and record delivery", async () => {
  await resendAppointmentConfirmation(admin, "appt-admin-test");

  const updated = await inMemoryAppointmentRepository.findById("appt-admin-test");

  assert.equal(updated?.confirmationDelivery, "development-disabled");
  assert.ok(updated?.confirmationSentAt);
});

test("admin can resend agreement email for paid confirmed appointments", async () => {
  await inMemoryAppointmentRepository.updateStatus(
    "appt-admin-test",
    "CONFIRMED",
    "PAID",
  );

  const sentMessages: EmailMessage[] = [];
  const sendEmail = async (message: EmailMessage): Promise<EmailSendResult> => {
    sentMessages.push(message);

    return { delivery: "sent", provider: "resend" };
  };

  const result = await resendAgreementEmail(admin, "appt-admin-test", {
    now: () => new Date("2026-09-13T20:00:00.000Z"),
    sendEmail,
  });
  const updated = await inMemoryAppointmentRepository.findById("appt-admin-test");

  assert.equal(result.status, "success");
  assert.equal(updated?.agreementDelivery, "sent");
  assert.equal(updated?.agreementSentAt, "2026-09-13T20:00:00.000Z");
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].attachments?.[0].contentType, "application/pdf");
});
