import {
  getEmailFromAddress,
  getLeadNotificationRecipient,
  sendEmail,
} from "./email/provider";
import {
  createAssessmentNotificationEmail,
  createAppointmentConfirmationEmail,
  createClientConfirmationEmail,
  createContactNotificationEmail,
} from "./email/templates";
import type { AssessmentFormData } from "../types/assessment";
import type { AppointmentRecord, ConsultationType } from "../types/booking";
import type { ContactLead, LeadWorkflowResult } from "../types/lead";

function createLeadId(prefix: "contact" | "assessment") {
  return `${prefix}-${Date.now().toString(36)}`;
}

async function sendLeadEmails({
  confirmationEmail,
  leadEmail,
  replyTo,
  userEmail,
}: {
  confirmationEmail: ReturnType<typeof createClientConfirmationEmail>;
  leadEmail:
    | ReturnType<typeof createContactNotificationEmail>
    | ReturnType<typeof createAssessmentNotificationEmail>;
  replyTo: string;
  userEmail: string;
}): Promise<LeadWorkflowResult["delivery"]> {
  const from = getEmailFromAddress();
  const notificationTo = getLeadNotificationRecipient();

  if (!from || !notificationTo) {
    await sendEmail({
      ...leadEmail,
      from: from || "disabled@example.invalid",
      replyTo,
      to: notificationTo || "disabled@example.invalid",
    });

    return "development-disabled";
  }

  const notificationResult = await sendEmail({
    ...leadEmail,
    from,
    replyTo,
    to: notificationTo,
  });

  await sendEmail({
    ...confirmationEmail,
    from,
    to: userEmail,
  });

  return notificationResult.delivery === "sent" ? "sent" : "development-disabled";
}

export async function submitContactLead(
  lead: ContactLead,
): Promise<LeadWorkflowResult> {
  const delivery = await sendLeadEmails({
    confirmationEmail: createClientConfirmationEmail(lead.fullName, "contact"),
    leadEmail: createContactNotificationEmail(lead),
    replyTo: lead.email,
    userEmail: lead.email,
  });

  return {
    id: createLeadId("contact"),
    delivery,
  };
}

export async function submitAssessmentLead(
  assessment: AssessmentFormData,
): Promise<LeadWorkflowResult> {
  const delivery = await sendLeadEmails({
    confirmationEmail: createClientConfirmationEmail(
      assessment.fullName,
      "assessment",
    ),
    leadEmail: createAssessmentNotificationEmail(assessment),
    replyTo: assessment.email,
    userEmail: assessment.email,
  });

  return {
    id: createLeadId("assessment"),
    delivery,
  };
}

export async function sendAppointmentConfirmation({
  appointment,
  consultationType,
}: {
  appointment: AppointmentRecord;
  consultationType: ConsultationType;
}): Promise<LeadWorkflowResult["delivery"]> {
  const from = getEmailFromAddress();
  const notificationTo = getLeadNotificationRecipient();
  const confirmationEmail = createAppointmentConfirmationEmail({
    appointment,
    consultationType,
  });

  if (!from || !notificationTo) {
    await sendEmail({
      ...confirmationEmail,
      from: from || "disabled@example.invalid",
      to: appointment.client.email,
    });

    return "development-disabled";
  }

  const result = await sendEmail({
    ...confirmationEmail,
    from,
    to: appointment.client.email,
  });

  await sendEmail({
    ...confirmationEmail,
    from,
    replyTo: appointment.client.email,
    subject: `Confirmed consultation: ${appointment.client.fullName}`,
    to: notificationTo,
  });

  return result.delivery === "sent" ? "sent" : "development-disabled";
}
