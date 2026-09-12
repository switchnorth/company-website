import assert from "node:assert/strict";
import test from "node:test";
import Stripe from "stripe";
import { serviceAgreementVersion } from "../data/agreement";
import { getConsultationType } from "../lib/booking/availability";
import { processStripePaymentEvent } from "../lib/booking/payment-events";
import {
  clearDevelopmentAppointments,
  inMemoryAppointmentRepository,
} from "../lib/booking/repository";
import {
  createServiceAgreementData,
  generateServiceAgreementPdf,
} from "../lib/agreement/generator";
import { createServiceAgreementSections, validateAgreementData } from "../lib/agreement/template";
import { generateAndSendServiceAgreement } from "../lib/agreement/workflow";
import type { EmailMessage, EmailSendResult } from "../lib/email/provider";
import type { AppointmentRecord } from "../types/booking";

function appointment(
  overrides: Partial<AppointmentRecord> = {},
): AppointmentRecord {
  return {
    id: "appt-agreement-test",
    consultationTypeId: "initial-30",
    date: "2026-09-14",
    startTime: "09:00",
    endTime: "09:30",
    timeZone: "America/Vancouver",
    status: "PENDING_PAYMENT",
    paymentStatus: "PAYMENT_REQUIRED",
    stripeCheckoutSessionId: "cs_agreement_test",
    paymentAmountCents: 7500,
    paymentCurrency: "cad",
    paymentCreatedAt: "2026-09-13T19:00:00.000Z",
    paymentExpiresAt: "2026-09-13T19:35:00.000Z",
    holdExpiresAt: "2026-09-13T19:35:00.000Z",
    processedStripeEventIds: [],
    client: {
      fullName: "Priya Client",
      email: "priya@example.com",
      phone: "+1 604 555 0199",
      country: "India",
      interest: "express-entry",
      preferredLanguage: "English",
      situation: "I want to discuss Express Entry planning.",
      consent: true,
    },
    createdAt: "2026-09-13T19:00:00.000Z",
    updatedAt: "2026-09-13T19:00:00.000Z",
    ...overrides,
  };
}

function completedCheckoutEvent(eventId = "evt_agreement_paid"): Stripe.Event {
  return {
    id: eventId,
    object: "event",
    api_version: "2024-06-20",
    created: 1_789_330_000,
    data: {
      object: {
        id: "cs_agreement_test",
        object: "checkout.session",
        amount_total: 7500,
        client_reference_id: "appt-agreement-test",
        currency: "cad",
        metadata: {
          appointmentId: "appt-agreement-test",
        },
        payment_intent: "pi_agreement_test",
        payment_status: "paid",
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: null,
    type: "checkout.session.completed",
  } as unknown as Stripe.Event;
}

function getAgreementData() {
  const consultationType = getConsultationType("initial-30");

  assert.ok(consultationType);

  return createServiceAgreementData({
    appointment: appointment(),
    consultationType,
  });
}

test("agreement data replaces sample placeholders with configured site and client fields", () => {
  const data = getAgreementData();
  const text = createServiceAgreementSections(data)
    .flatMap((section) => [
      section.title,
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
    ])
    .join("\n");

  assert.equal(data.agreementVersion, serviceAgreementVersion);
  assert.equal(data.clientName, "Priya Client");
  assert.equal(data.businessName, "Switch North Immigration");
  assert.match(text, /Switch North Immigration/);
  assert.doesNotMatch(text, /ABC Immigration Inc/);
  assert.doesNotMatch(text, /info@abcimmigration\.com/);
  assert.doesNotMatch(text, /R123123/);
});

test("agreement validation reports missing required fields", () => {
  const data = {
    ...getAgreementData(),
    clientEmail: "",
    consultantLicenseNumber: "",
  };

  assert.deepEqual(validateAgreementData(data), [
    "clientEmail",
    "consultantLicenseNumber",
  ]);
  assert.rejects(() => generateServiceAgreementPdf(data), /clientEmail/);
});

test("agreement PDF generation creates a versioned PDF attachment payload", async () => {
  const generated = await generateServiceAgreementPdf(getAgreementData());

  assert.equal(generated.agreementVersion, serviceAgreementVersion);
  assert.match(generated.fileName, /Service-Agreement/);
  assert.match(generated.pdf.subarray(0, 4).toString("utf8"), /%PDF/);
  assert.ok(generated.pdf.length > 1_000);
});

test("successful payment triggers agreement email attachment and records version", async () => {
  clearDevelopmentAppointments();
  await inMemoryAppointmentRepository.create(appointment());

  const sentMessages: EmailMessage[] = [];
  const sendEmail = async (message: EmailMessage): Promise<EmailSendResult> => {
    sentMessages.push(message);

    return { delivery: "sent", provider: "resend" };
  };

  const result = await processStripePaymentEvent(completedCheckoutEvent(), {
    async onAppointmentConfirmed(confirmedAppointment) {
      await generateAndSendServiceAgreement(confirmedAppointment, {
        now: () => new Date("2026-09-13T19:10:00.000Z"),
        sendEmail,
      });
    },
  });
  const updated = await inMemoryAppointmentRepository.findById("appt-agreement-test");

  assert.equal(result.status, "payment_succeeded");
  assert.equal(updated?.status, "CONFIRMED");
  assert.equal(updated?.agreementVersion, serviceAgreementVersion);
  assert.equal(updated?.agreementDelivery, "sent");
  assert.equal(updated?.agreementSentAt, "2026-09-13T19:10:00.000Z");
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].to, "priya@example.com");
  assert.equal(sentMessages[0].attachments?.length, 1);
  assert.match(sentMessages[0].attachments?.[0].filename ?? "", /\.pdf$/);
  assert.equal(sentMessages[0].attachments?.[0].contentType, "application/pdf");
});

test("agreement workflow is idempotent after an agreement has been sent", async () => {
  const confirmed = appointment({
    agreementDelivery: "sent",
    agreementGeneratedAt: "2026-09-13T19:09:00.000Z",
    agreementId: "agr-existing",
    agreementSentAt: "2026-09-13T19:10:00.000Z",
    agreementVersion: serviceAgreementVersion,
    paymentStatus: "PAID",
    status: "CONFIRMED",
  });
  const sentMessages: EmailMessage[] = [];

  const result = await generateAndSendServiceAgreement(confirmed, {
    sendEmail: async (message) => {
      sentMessages.push(message);

      return { delivery: "sent", provider: "resend" };
    },
  });

  assert.equal(result.status, "already_sent");
  assert.equal(sentMessages.length, 0);
});
