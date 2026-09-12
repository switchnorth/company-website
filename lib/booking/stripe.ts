import Stripe from "stripe";
import { siteConfig } from "../../data/site";
import type {
  AppointmentRecord,
  ConsultationType,
} from "../../types/booking";

export type CheckoutSessionDetails = {
  amountCents: number;
  checkoutSessionId: string;
  currency: string;
  expiresAt: string;
  paymentIntentId?: string;
  url: string;
};

function getSiteUrl() {
  return (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    siteConfig.domain
  ).replace(/\/$/, "");
}

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createStripeCheckoutSession({
  appointment,
  consultationType,
}: {
  appointment: AppointmentRecord;
  consultationType: ConsultationType;
}): Promise<CheckoutSessionDetails | null> {
  const stripe = getStripeClient();

  if (!stripe) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("STRIPE_SECRET_KEY is required for consultation payments.");
    }

    return null;
  }

  const siteUrl = getSiteUrl();
  const session = await stripe.checkout.sessions.create({
    cancel_url: `${siteUrl}/consultation/confirmation?appointment_id=${appointment.id}&cancelled=1`,
    client_reference_id: appointment.id,
    customer_email: appointment.client.email,
    expires_at: Math.floor(new Date(appointment.holdExpiresAt).getTime() / 1000),
    line_items: [
      {
        price_data: {
          currency: consultationType.currency.toLowerCase(),
          product_data: {
            description: `${consultationType.durationMinutes}-minute consultation with ${siteConfig.businessName}`,
            name: consultationType.title,
          },
          unit_amount: consultationType.samplePriceCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: appointment.id,
      consultationTypeId: consultationType.id,
    },
    mode: "payment",
    payment_intent_data: {
      metadata: {
        appointmentId: appointment.id,
        consultationTypeId: consultationType.id,
      },
    },
    success_url: `${siteUrl}/consultation/confirmation?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL.");
  }

  return {
    amountCents: session.amount_total ?? consultationType.samplePriceCents,
    checkoutSessionId: session.id,
    currency: session.currency ?? consultationType.currency.toLowerCase(),
    expiresAt: session.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : appointment.holdExpiresAt,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
    url: session.url,
  };
}

export function constructStripeWebhookEvent({
  payload,
  signature,
  webhookSecret,
}: {
  payload: string;
  signature: string | null;
  webhookSecret: string;
}) {
  const stripe = getStripeClient();

  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is required for webhook verification.");
  }

  if (!signature) {
    throw new Error("Missing Stripe-Signature header.");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
