import { NextResponse } from "next/server";
import { processStripePaymentEvent } from "@/lib/booking/payment-events";
import {
  constructStripeWebhookEvent,
  isStripeConfigured,
} from "@/lib/booking/stripe";
import { scheduleAppointmentReminders } from "@/lib/booking/lifecycle";
import { generateAndSendServiceAgreement } from "@/lib/agreement/workflow";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!isStripeConfigured() || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  let event;

  try {
    event = constructStripeWebhookEvent({
      payload,
      signature,
      webhookSecret,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature or payload." },
      { status: 400 },
    );
  }

  try {
    const result = await processStripePaymentEvent(event, {
      async onAppointmentConfirmed(appointment) {
        try {
          await generateAndSendServiceAgreement(appointment);
          await scheduleAppointmentReminders(appointment);
        } catch {
          // Payment fulfillment must remain idempotent even if agreement delivery fails.
        }
      },
    });

    return NextResponse.json({
      received: true,
      status: result.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Stripe webhook processing failed." },
      { status: 500 },
    );
  }
}
