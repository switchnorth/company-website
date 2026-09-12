import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, CreditCard } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { formatConsultationPrice } from "@/data/booking";
import { getConsultationType } from "@/lib/booking/availability";
import { getAppointmentForConfirmation } from "@/lib/booking/service";
import { createPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Consultation Confirmation",
  description:
    "Review the confirmation status for a Switch North Immigration consultation booking.",
  path: "/consultation/confirmation",
});

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ConsultationConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = readParam(params.session_id);
  const appointmentId = readParam(params.appointment_id);
  const cancelled = readParam(params.cancelled) === "1";
  const appointment = await getAppointmentForConfirmation({
    appointmentId,
    checkoutSessionId: sessionId,
  });
  const consultationType = appointment
    ? getConsultationType(appointment.consultationTypeId)
    : null;
  const isConfirmed =
    appointment?.status === "CONFIRMED" && appointment.paymentStatus === "PAID";
  const isExpired = appointment?.paymentStatus === "EXPIRED";
  const isFailed = appointment?.paymentStatus === "FAILED";
  const statusTitle = isConfirmed
    ? "Your consultation is confirmed."
    : isExpired
      ? "This payment hold has expired."
      : isFailed || cancelled
        ? "Payment was not completed."
        : "Payment verification is pending.";

  return (
    <>
      <PageHeader
        eyebrow="Consultation Confirmation"
        title={statusTitle}
        description="Payment status is based on the server-side appointment record updated by Stripe webhooks. Browser redirects alone do not confirm payment."
      />

      <Section containerClassName="grid gap-8">
        <Breadcrumbs
          items={[
            { label: "Consultation", href: "/consultation" },
            { label: "Confirmation", href: "/consultation/confirmation" },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <Card>
            <div
              className={`grid size-12 place-items-center rounded-md ${
                isConfirmed
                  ? "bg-brand-teal-soft text-brand-teal"
                  : "bg-accent-red-soft text-accent-red"
              }`}
            >
              {isConfirmed ? (
                <CheckCircle2 aria-hidden="true" size={26} />
              ) : (
                <AlertCircle aria-hidden="true" size={26} />
              )}
            </div>
            <CardHeader className="mt-5">
              <CardTitle>{statusTitle}</CardTitle>
              <CardDescription>
                {isConfirmed
                  ? "Stripe payment has been verified and the appointment status is confirmed."
                  : "If you just completed payment, webhook verification may still be processing. Refresh shortly or contact the office if the status does not update."}
              </CardDescription>
            </CardHeader>

            {appointment && consultationType ? (
              <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-[15px] leading-7 text-muted md:grid-cols-2">
                <div>
                  <dt className="font-semibold text-deep-ink">Client</dt>
                  <dd>{appointment.client.fullName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Consultation</dt>
                  <dd>{consultationType.title}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Date</dt>
                  <dd>{appointment.date}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Time</dt>
                  <dd>
                    {appointment.startTime} - {appointment.endTime}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Timezone</dt>
                  <dd>{appointment.timeZone}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-deep-ink">Payment</dt>
                  <dd>
                    {isConfirmed
                      ? `Confirmed ${formatConsultationPrice(consultationType)}`
                      : appointment.paymentStatus.replaceAll("_", " ").toLowerCase()}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-6 border-t border-border pt-6 text-base leading-7 text-muted">
                We could not find a matching appointment record for this
                confirmation link. Contact the office if you completed payment.
              </p>
            )}
          </Card>

          <Card>
            <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
              {isConfirmed ? (
                <Clock aria-hidden="true" size={22} />
              ) : (
                <CreditCard aria-hidden="true" size={22} />
              )}
            </div>
            <CardHeader className="mt-5">
              <CardTitle>Next steps</CardTitle>
              <CardDescription>
                {isConfirmed
                  ? "Prepare relevant immigration documents, timelines, and questions before the consultation."
                  : "Return to the consultation flow if payment was cancelled, failed, or expired."}
              </CardDescription>
            </CardHeader>
            <div className="mt-6 grid gap-3">
              <ButtonLink href="/consultation">
                Book Another Time
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Contact the Office
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              This page does not show card details, payment intent IDs, or other
              sensitive payment references.
            </p>
          </Card>
        </div>

        <p className="text-sm leading-6 text-muted">
          Need help? Visit the{" "}
          <Link className="font-semibold text-brand-teal hover:text-accent-red" href="/contact">
            contact page
          </Link>{" "}
          with your appointment reference.
        </p>
      </Section>
    </>
  );
}
