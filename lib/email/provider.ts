import nodemailer from "nodemailer";

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
  provider: "resend" | "smtp" | "zoho" | "disabled";
};

type EmailProvider = "resend" | "smtp" | "zoho" | "disabled";

function readEmailProvider(value: string | undefined): EmailProvider {
  const normalized = value?.toLowerCase();

  if (normalized === "resend" || normalized === "smtp" || normalized === "zoho") {
    return normalized;
  }

  return "disabled";
}

function readBoolean(value: string | undefined) {
  return ["1", "true", "yes", "on"].includes(value?.toLowerCase() ?? "");
}

function readPort(value: string | undefined) {
  const port = Number(value);

  return Number.isInteger(port) && port > 0 ? port : undefined;
}

function assertHeaderSafe(value: string | undefined, label: string) {
  if (value && /[\r\n]/.test(value)) {
    throw new Error(`${label} contains invalid header characters.`);
  }
}

function assertSafeEmailMessage(message: EmailMessage) {
  assertHeaderSafe(message.to, "Email recipient");
  assertHeaderSafe(message.from, "Email sender");
  assertHeaderSafe(message.replyTo, "Email reply-to");
  assertHeaderSafe(message.subject, "Email subject");
}

function getRequiredEmailConfig() {
  return {
    provider: readEmailProvider(process.env.EMAIL_PROVIDER),
    from: process.env.EMAIL_FROM ?? "",
    notificationTo:
      process.env.CONTACT_RECIPIENT ?? process.env.LEAD_NOTIFICATION_TO ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    smtpHost: process.env.SMTP_HOST ?? "",
    smtpPassword: process.env.SMTP_PASSWORD ?? "",
    smtpPort: readPort(process.env.SMTP_PORT),
    smtpSecure: readBoolean(process.env.SMTP_SECURE),
    smtpSecureConfigured: process.env.SMTP_SECURE !== undefined,
    smtpUser: process.env.SMTP_USER ?? "",
  };
}

async function sendWithResend(message: EmailMessage): Promise<EmailSendResult> {
  const config = getRequiredEmailConfig();

  assertSafeEmailMessage(message);

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

async function sendWithSmtp(message: EmailMessage): Promise<EmailSendResult> {
  const config = getRequiredEmailConfig();

  assertSafeEmailMessage(message);

  if (
    !config.smtpHost ||
    !config.smtpPort ||
    !config.smtpUser ||
    !config.smtpPassword ||
    !config.smtpSecureConfigured
  ) {
    throw new Error(
      "SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, and SMTP_PASSWORD are required when EMAIL_PROVIDER=smtp or zoho.",
    );
  }

  const transport = nodemailer.createTransport({
    auth: {
      pass: config.smtpPassword,
      user: config.smtpUser,
    },
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
  });

  await transport.sendMail({
    attachments: message.attachments?.map((attachment) => ({
      content: attachment.content,
      contentType: attachment.contentType,
      filename: attachment.filename,
    })),
    from: message.from,
    html: message.html,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    to: message.to,
  });

  return {
    delivery: "sent",
    provider: config.provider === "zoho" ? "zoho" : "smtp",
  };
}

export function getLeadNotificationRecipient() {
  return process.env.CONTACT_RECIPIENT ?? process.env.LEAD_NOTIFICATION_TO ?? "";
}

export function getEmailFromAddress() {
  return process.env.EMAIL_FROM ?? "";
}

export function isEmailConfigured() {
  const config = getRequiredEmailConfig();

  return (
    ((config.provider === "resend" && Boolean(config.resendApiKey)) ||
      ((config.provider === "smtp" || config.provider === "zoho") &&
        Boolean(config.smtpHost) &&
        Boolean(config.smtpPort) &&
        Boolean(config.smtpUser) &&
        Boolean(config.smtpPassword) &&
        config.smtpSecureConfigured)) &&
    Boolean(config.from) &&
    Boolean(config.notificationTo)
  );
}

export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const config = getRequiredEmailConfig();

  if (config.provider === "resend") {
    return sendWithResend(message);
  }

  if (config.provider === "smtp" || config.provider === "zoho") {
    return sendWithSmtp(message);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Email delivery is not configured.");
  }

  return {
    delivery: "development-disabled",
    provider: "disabled",
  };
}
