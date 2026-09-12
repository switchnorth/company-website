import {
  getEmailFromAddress,
  getLeadNotificationRecipient,
  sendEmail as defaultSendEmail,
} from "../email/provider";
import { createServiceAgreementEmail } from "../email/templates";
import { getConsultationType } from "../booking/availability";
import { getAppointmentRepository } from "../booking/repository";
import {
  createServiceAgreementData,
  generateServiceAgreementPdf,
} from "./generator";
import { createAppointmentManagementLink } from "../booking/lifecycle";
import type { AppointmentRepository } from "../booking/repository";
import type { EmailMessage, EmailSendResult } from "../email/provider";
import type { AppointmentRecord } from "../../types/booking";

export type AgreementWorkflowResult = {
  agreementId?: string;
  delivery?: "sent" | "development-disabled";
  status: "already_sent" | "missing_consultation_type" | "sent";
};

export type AgreementWorkflowOptions = {
  managementUrl?: string;
  repository?: AppointmentRepository;
  sendEmail?: (message: EmailMessage) => Promise<EmailSendResult>;
  now?: () => Date;
};

export async function generateAndSendServiceAgreement(
  appointment: AppointmentRecord,
  options: AgreementWorkflowOptions = {},
): Promise<AgreementWorkflowResult> {
  if (appointment.agreementSentAt) {
    return {
      agreementId: appointment.agreementId,
      delivery: appointment.agreementDelivery,
      status: "already_sent",
    };
  }

  const repository = options.repository ?? getAppointmentRepository();
  const sendEmail = options.sendEmail ?? defaultSendEmail;
  const consultationType = getConsultationType(appointment.consultationTypeId);

  if (!consultationType) {
    return { status: "missing_consultation_type" };
  }

  const agreementData = createServiceAgreementData({
    appointment,
    consultationType,
  });
  const generated = await generateServiceAgreementPdf(agreementData);
  const managementUrl =
    options.managementUrl ??
    (await createAppointmentManagementLink(
      appointment,
      options.now?.() ?? new Date(),
    )).url;
  const email = createServiceAgreementEmail({
    agreement: agreementData,
    appointment,
    consultationType,
    managementUrl,
  });
  const from = getEmailFromAddress();
  const notificationTo = getLeadNotificationRecipient();
  const recipient = appointment.client.email;
  const message = {
    ...email,
    attachments: [
      {
        content: generated.pdf,
        contentType: "application/pdf" as const,
        filename: generated.fileName,
      },
    ],
    from: from || "disabled@example.invalid",
    to: recipient,
  };
  const deliveryResult = await sendEmail(message);
  const delivery = deliveryResult.delivery;

  if (from && notificationTo) {
    await sendEmail({
      ...email,
      attachments: message.attachments,
      from,
      replyTo: recipient,
      subject: `Service Agreement sent: ${appointment.client.fullName}`,
      to: notificationTo,
    });
  }

  const sentAt = (options.now?.() ?? new Date()).toISOString();

  await repository.markAgreementSent(appointment.id, {
    agreementId: generated.agreementId,
    delivery,
    generatedAt: generated.generatedAt,
    sentAt,
    version: generated.agreementVersion,
  });

  return {
    agreementId: generated.agreementId,
    delivery,
    status: "sent",
  };
}
