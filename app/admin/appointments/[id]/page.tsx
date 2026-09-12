import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/admin/auth";
import {
  AdminRecordNotFoundError,
  formatPaymentAmount,
  getAdminAppointmentDetail,
} from "@/lib/admin/service";
import {
  cancelAppointmentAction,
  completeAppointmentAction,
  confirmAppointmentAction,
  noShowAppointmentAction,
  resendAgreementAction,
  resendConfirmationAction,
} from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Appointment Detail",
};

function DetailGrid({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
      {items.map((item) => (
        <div className="rounded-md border border-border p-3" key={item.label}>
          <dt className="font-semibold text-deep-ink">{item.label}</dt>
          <dd className="mt-1 text-muted">{item.value || "Not recorded"}</dd>
        </div>
      ))}
    </dl>
  );
}

function ActionForm({
  action,
  children,
  confirmMessage,
  id,
  variant,
}: {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  confirmMessage?: string;
  id: string;
  variant?: "outline" | "primary" | "secondary";
}) {
  return (
    <form action={action}>
      <input name="appointmentId" type="hidden" value={id} />
      <AdminActionButton confirmMessage={confirmMessage} variant={variant}>
        {children}
      </AdminActionButton>
    </form>
  );
}

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

export default async function AdminAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  let row;

  try {
    row = await getAdminAppointmentDetail(admin, id);
  } catch (error) {
    if (error instanceof AdminRecordNotFoundError) {
      notFound();
    }

    throw error;
  }

  const appointment = row.appointment;
  const duration = `${appointment.startTime} - ${appointment.endTime}`;
  const durationMinutes =
    minutesFromTime(appointment.endTime) - minutesFromTime(appointment.startTime);

  return (
    <AdminShell admin={admin}>
      <Container className="grid gap-6 py-8 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-brand-teal hover:text-accent-red"
              href="/admin/appointments"
            >
              Back to appointments
            </Link>
            <h2 className="mt-3 text-2xl font-semibold text-deep-ink">
              {appointment.client.fullName}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {appointment.date}, {duration} {appointment.timeZone}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={appointment.status} />
            <StatusBadge value={appointment.paymentStatus} />
            <StatusBadge value={row.agreementStatus} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-start">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
                <CardDescription>Contact and intake context.</CardDescription>
              </CardHeader>
              <DetailGrid
                items={[
                  { label: "Name", value: appointment.client.fullName },
                  { label: "Email", value: appointment.client.email },
                  { label: "Phone", value: appointment.client.phone },
                  { label: "Country", value: appointment.client.country },
                  { label: "Immigration interest", value: appointment.client.interest },
                  { label: "Preferred language", value: appointment.client.preferredLanguage },
                  { label: "Situation", value: appointment.client.situation },
                ]}
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment</CardTitle>
                <CardDescription>Consultation scheduling details.</CardDescription>
              </CardHeader>
              <DetailGrid
                items={[
                  { label: "Consultation type", value: row.consultationTitle },
                  { label: "Date", value: appointment.date },
                  { label: "Time", value: duration },
                  { label: "Timezone", value: appointment.timeZone },
                  { label: "Duration", value: `${durationMinutes} minutes` },
                  { label: "Status", value: <StatusBadge value={appointment.status} /> },
                ]}
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>
                  Financial records are read-only here. No card information is stored
                  or displayed.
                </CardDescription>
              </CardHeader>
              <DetailGrid
                items={[
                  { label: "Amount", value: formatPaymentAmount(appointment) },
                  { label: "Currency", value: appointment.paymentCurrency?.toUpperCase() },
                  { label: "Payment status", value: <StatusBadge value={appointment.paymentStatus} /> },
                  { label: "Stripe checkout session", value: appointment.stripeCheckoutSessionId },
                  { label: "Stripe payment reference", value: appointment.stripePaymentIntentId },
                  { label: "Paid date", value: appointment.paymentPaidAt },
                ]}
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Google Calendar details appear here when integration metadata exists.
                </CardDescription>
              </CardHeader>
              <DetailGrid
                items={[
                  { label: "Calendar status", value: <StatusBadge value={row.calendarStatus} /> },
                  { label: "Event ID", value: appointment.calendarEventId },
                  {
                    label: "Calendar event",
                    value: appointment.calendarEventUrl ? (
                      <a
                        className="inline-flex items-center gap-1 font-semibold text-brand-teal hover:text-accent-red"
                        href={appointment.calendarEventUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open event <ExternalLink aria-hidden="true" size={14} />
                      </a>
                    ) : (
                      "Not connected"
                    ),
                  },
                ]}
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agreement and Email</CardTitle>
                <CardDescription>
                  Service agreement delivery and client email status.
                </CardDescription>
              </CardHeader>
              <DetailGrid
                items={[
                  { label: "Agreement status", value: <StatusBadge value={row.agreementStatus} /> },
                  { label: "Agreement version", value: appointment.agreementVersion },
                  { label: "Generated date", value: appointment.agreementGeneratedAt },
                  { label: "Sent date", value: appointment.agreementSentAt },
                  { label: "Signed/accepted status", value: row.agreementStatus },
                  { label: "Confirmation sent", value: appointment.confirmationSentAt },
                  { label: "Agreement email sent", value: appointment.agreementSentAt },
                ]}
              />
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>
                Safe appointment operations. Payment records cannot be deleted here.
              </CardDescription>
            </CardHeader>
            <div className="mt-5 grid gap-3">
              <ActionForm action={confirmAppointmentAction} id={appointment.id} variant="primary">
                Confirm Manually
              </ActionForm>
              <ActionForm
                action={cancelAppointmentAction}
                confirmMessage="Cancel this appointment? Payment records will remain intact."
                id={appointment.id}
              >
                Cancel Appointment
              </ActionForm>
              <ActionForm action={resendConfirmationAction} id={appointment.id}>
                Resend Confirmation Email
              </ActionForm>
              <ActionForm action={resendAgreementAction} id={appointment.id}>
                Resend Agreement Email
              </ActionForm>
              <ActionForm action={completeAppointmentAction} id={appointment.id}>
                Mark Completed
              </ActionForm>
              <ActionForm
                action={noShowAppointmentAction}
                confirmMessage="Mark this appointment as no-show?"
                id={appointment.id}
              >
                Mark No-Show
              </ActionForm>
              {appointment.calendarEventUrl ? (
                <ButtonLink
                  href={appointment.calendarEventUrl}
                  size="sm"
                  target="_blank"
                  variant="outline"
                >
                  Open Google Calendar Event
                </ButtonLink>
              ) : null}
            </div>
          </Card>
        </div>
      </Container>
    </AdminShell>
  );
}
