import assert from "node:assert/strict";
import test from "node:test";
import { createContactNotificationEmail } from "../lib/email/templates";
import { getContactHoneypot, validateContactLead } from "../lib/contact-validation";
import { sendEmail, type EmailMessage, type EmailSendResult } from "../lib/email/provider";
import { submitContactLead } from "../lib/lead-workflow";
import type { ContactLead } from "../types/lead";

const validLead: ContactLead = {
  fullName: "Priya Client",
  email: "priya.client@example.com",
  phone: "+1 604 555 0101",
  country: "Canada",
  interest: "express-entry",
  message: "I would like help understanding my options for permanent residence.",
  consent: true,
};

function sentResult(provider: EmailSendResult["provider"] = "zoho"): EmailSendResult {
  return { delivery: "sent", provider };
}

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}

test("valid contact submission passes server-side validation", () => {
  assert.deepEqual(validateContactLead(validLead), {});
});

test("invalid email and missing required contact fields are rejected", () => {
  const errors = validateContactLead({
    ...validLead,
    consent: false,
    country: "",
    email: "not-an-email",
    fullName: "",
    interest: "other",
    message: "Too short",
  });

  assert.equal(errors.fullName, "Enter your full name using 2 to 100 characters.");
  assert.equal(errors.email, "Enter a valid email address.");
  assert.equal(errors.country, "Enter your country of residence.");
  assert.equal(
    errors.message,
    "Enter a message between 20 and 2000 characters without promotional links.",
  );
  assert.equal(
    errors.consent,
    "Confirm that Switch North can use this information to respond.",
  );
});

test("honeypot values are detected before sending", () => {
  const formData = new FormData();
  formData.set("company", "spam-company");

  assert.equal(getContactHoneypot(formData), "spam-company");
});

test("contact notification includes business recipient context and reply-to behaviour", async () => {
  const messages: EmailMessage[] = [];

  const result = await submitContactLead(validLead, {
    from: "Switch North Immigration <info@switchnorth.ca>",
    notificationTo: "info@switchnorth.ca",
    sendEmail: async (message) => {
      messages.push(message);

      return sentResult();
    },
  });

  assert.equal(result.delivery, "sent");
  assert.equal(messages.length, 2);
  assert.equal(messages[0].from, "Switch North Immigration <info@switchnorth.ca>");
  assert.equal(messages[0].to, "info@switchnorth.ca");
  assert.equal(messages[0].replyTo, "priya.client@example.com");
  assert.match(messages[0].subject, /^New Website Inquiry/);
  assert.match(messages[0].text, /Source: Switch North Immigration Website/);
  assert.equal(messages[1].to, "priya.client@example.com");
  assert.equal(
    messages[1].subject,
    "We received your inquiry — Switch North Immigration",
  );
});

test("business notification failure rejects the contact workflow", async () => {
  await assert.rejects(
    () =>
      submitContactLead(validLead, {
        from: "Switch North Immigration <info@switchnorth.ca>",
        notificationTo: "info@switchnorth.ca",
        sendEmail: async () => {
          throw new Error("SMTP unavailable");
        },
      }),
    /SMTP unavailable/,
  );
});

test("acknowledgement-only failure still accepts delivered inquiry", async () => {
  const messages: EmailMessage[] = [];
  let acknowledgementFailure: unknown;

  const originalWarn = console.warn;
  console.warn = () => {};

  const result = await submitContactLead(validLead, {
    from: "Switch North Immigration <info@switchnorth.ca>",
    notificationTo: "info@switchnorth.ca",
    onConfirmationFailure(error) {
      acknowledgementFailure = error;
    },
    sendEmail: async (message) => {
      messages.push(message);

      if (messages.length === 2) {
        throw new Error("Client mailbox rejected acknowledgement");
      }

      return sentResult();
    },
  });

  console.warn = originalWarn;

  assert.equal(result.delivery, "sent");
  assert.equal(messages.length, 2);
  assert.ok(acknowledgementFailure instanceof Error);
});

test("header injection attempts are rejected before email delivery", () => {
  const errors = validateContactLead({
    ...validLead,
    fullName: "Bad Actor\r\nBcc: attacker@example.com",
  });

  assert.equal(errors.fullName, "Enter your full name using 2 to 100 characters.");
});

test("email provider rejects unsafe header values without sending", async () => {
  const previousProvider = process.env.EMAIL_PROVIDER;
  const previousFrom = process.env.EMAIL_FROM;
  const previousRecipient = process.env.CONTACT_RECIPIENT;
  const previousHost = process.env.SMTP_HOST;
  const previousPort = process.env.SMTP_PORT;
  const previousSecure = process.env.SMTP_SECURE;
  const previousUser = process.env.SMTP_USER;
  const previousPassword = process.env.SMTP_PASSWORD;

  process.env.EMAIL_PROVIDER = "zoho";
  process.env.EMAIL_FROM = "Switch North Immigration <info@switchnorth.ca>";
  process.env.CONTACT_RECIPIENT = "info@switchnorth.ca";
  process.env.SMTP_HOST = "smtp.example.invalid";
  process.env.SMTP_PORT = "465";
  process.env.SMTP_SECURE = "true";
  process.env.SMTP_USER = "info@switchnorth.ca";
  process.env.SMTP_PASSWORD = "test-password";

  await assert.rejects(
    () =>
      sendEmail({
        from: "Switch North Immigration <info@switchnorth.ca>",
        html: "<p>Test</p>",
        subject: "Injected\r\nBcc: attacker@example.com",
        text: "Test",
        to: "info@switchnorth.ca",
      }),
    /Email subject contains invalid header characters/,
  );

  restoreEnv("EMAIL_PROVIDER", previousProvider);
  restoreEnv("EMAIL_FROM", previousFrom);
  restoreEnv("CONTACT_RECIPIENT", previousRecipient);
  restoreEnv("SMTP_HOST", previousHost);
  restoreEnv("SMTP_PORT", previousPort);
  restoreEnv("SMTP_SECURE", previousSecure);
  restoreEnv("SMTP_USER", previousUser);
  restoreEnv("SMTP_PASSWORD", previousPassword);
});

test("contact notification escapes submitted HTML content", () => {
  const template = createContactNotificationEmail({
    ...validLead,
    message: "<script>alert('xss')</script> I need help with a work permit.",
  });

  assert.match(template.html, /&lt;script&gt;alert\(&#039;xss&#039;\)&lt;\/script&gt;/);
  assert.doesNotMatch(template.html, /<script>alert/);
});
