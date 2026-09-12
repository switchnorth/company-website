export type EmailAttachment = {
  content: Buffer;
  contentType: "application/pdf";
  filename: string;
};

export type EmailMessage = {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
};

export type EmailSendResult = {
  delivery: "sent" | "development-disabled";
  provider: "resend" | "disabled";
};

function getRequiredEmailConfig() {
  return {
    provider: process.env.EMAIL_PROVIDER ?? "disabled",
    from: process.env.EMAIL_FROM ?? "",
    notificationTo: process.env.LEAD_NOTIFICATION_TO ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
  };
}

async function sendWithResend(message: EmailMessage): Promise<EmailSendResult> {
  const config = getRequiredEmailConfig();

  if (!config.resendApiKey) {
    throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: message.from,
      to: [message.to],
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments: message.attachments?.map((attachment) => ({
        content: attachment.content.toString("base64"),
        content_type: attachment.contentType,
        filename: attachment.filename,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error("Email provider rejected the message.");
  }

  return {
    delivery: "sent",
    provider: "resend",
  };
}

export function getLeadNotificationRecipient() {
  return process.env.LEAD_NOTIFICATION_TO ?? "";
}

export function getEmailFromAddress() {
  return process.env.EMAIL_FROM ?? "";
}

export function isEmailConfigured() {
  const config = getRequiredEmailConfig();

  return (
    config.provider === "resend" &&
    Boolean(config.from) &&
    Boolean(config.notificationTo) &&
    Boolean(config.resendApiKey)
  );
}

export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const config = getRequiredEmailConfig();

  if (config.provider === "resend") {
    return sendWithResend(message);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Email delivery is not configured.");
  }

  return {
    delivery: "development-disabled",
    provider: "disabled",
  };
}
