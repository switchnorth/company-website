import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { appointmentLifecyclePolicy } from "@/data/booking";
import {
  AppointmentLifecycleError,
  getManagementPageData,
  groupSlotsByDate,
} from "@/lib/booking/lifecycle";
import {
  cancelManagedAppointmentAction,
  rescheduleManagedAppointmentAction,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Manage Appointment",
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "short",
    weekday: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}

function messageFor(code?: string) {
  if (code === "rescheduled") {
    return "Your appointment was rescheduled. A confirmation email has been sent.";
  }

  if (code === "cancelled") {
    return "Your appointment was cancelled. Cancellation does not automatically issue a refund.";
  }

  return "";
}

function errorFor(code?: string) {
  const messages: Record<string, string> = {
    cancel:
      "This appointment cannot be cancelled online. Please contact Switch North Immigration.",
    "confirm-cancel": "Confirm cancellation before submitting.",
    "rate-limited": "Too many attempts. Please wait before trying again.",
    reschedule:
      "This appointment cannot be rescheduled online. Please contact Switch North Immigration.",
  };

  return code ? messages[code] : "";
}

export default async function ManageAppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await params;
  const query = await searchParams;
  let data;

  try {
    data = await getManagementPageData(token);
  } catch (error) {
    if (error instanceof AppointmentLifecycleError) {
      notFound();
    }

    throw error;
  }

  const { appointment, canCancel, canReschedule, consultationType, slots } = data;
  const slotsByDate = groupSlotsByDate(slots);
  const updatedMessage = messageFor(readParam(query.updated));
  const errorMessage = errorFor(readParam(query.error));

  return (
    <section className="bg-surface-soft py-12 md:py-16">
      <Container className="grid gap-8">
        <div className="max-w-3xl">
          <div className="inline-grid size-12 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
            <ShieldCheck aria-hidden="true" size={24} />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-deep-ink md:text-4xl">
            Manage Your Consultation
          </h1>
          <p className="mt-3 text-base leading-7 text-muted">
            This secure page shows only the appointment details needed to manage
            your consultation.
          </p>
        </div>

        {updatedMessage ? (
          <p className="rounded-md border border-brand-teal/20 bg-brand-teal-soft px-4 py-3 text-sm font-semibold text-brand-teal">
            {updatedMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="rounded-md border border-accent-red/20 bg-accent-red-soft px-4 py-3 text-sm font-semibold text-accent-red-dark">
            {errorMessage}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <Card>
            <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
              <CalendarClock aria-hidden="true" size={22} />
            </div>
            <CardHeader className="mt-5">
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                {consultationType?.title ?? appointment.consultationTypeId}
              </CardDescription>
            </CardHeader>
            <dl className="mt-6 grid gap-4 text-sm">
              <div className="rounded-md border border-border p-3">
                <dt className="font-semibold text-deep-ink">Date</dt>
                <dd className="mt-1 text-muted">{formatDate(appointment.date)}</dd>
              </div>
              <div className="rounded-md border border-border p-3">
                <dt className="font-semibold text-deep-ink">Time</dt>
                <dd className="mt-1 text-muted">
                  {appointment.startTime} - {appointment.endTime}
                </dd>
              </div>
              <div className="rounded-md border border-border p-3">
                <dt className="font-semibold text-deep-ink">Timezone</dt>
                <dd className="mt-1 text-muted">{appointment.timeZone}</dd>
              </div>
              <div className="rounded-md border border-border p-3">
                <dt className="font-semibold text-deep-ink">Duration</dt>
                <dd className="mt-1 text-muted">
                  {consultationType
                    ? `${consultationType.durationMinutes} minutes`
                    : "Not available"}
                </dd>
              </div>
              <div className="rounded-md border border-border p-3">
                <dt className="font-semibold text-deep-ink">Status</dt>
                <dd className="mt-2">
                  <StatusBadge value={appointment.status} />
                </dd>
              </div>
            </dl>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reschedule</CardTitle>
                <CardDescription>
                  Online rescheduling requires at least{" "}
                  {appointmentLifecyclePolicy.minimumRescheduleNoticeHours} hours
                  notice. Contact the office if your appointment is sooner.
                </CardDescription>
              </CardHeader>
              {canReschedule && slots.length ? (
                <form
                  action={rescheduleManagedAppointmentAction.bind(null, token)}
                  className="mt-5 grid gap-4"
                >
                  <label className="text-sm font-semibold text-deep-ink" htmlFor="slot">
                    New appointment time
                  </label>
                  <select
                    className="focus-ring min-h-11 rounded-md border border-border bg-white px-3 text-sm text-deep-ink"
                    id="slot"
                    name="slot"
                    required
                  >
                    {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                      <optgroup key={date} label={formatDate(date)}>
                        {dateSlots.map((slot) => (
                          <option
                            key={`${slot.date}-${slot.startTime}`}
                            value={`${slot.date}|${slot.startTime}`}
                          >
                            {slot.label} {slot.timeZone}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <Button type="submit">Confirm Reschedule</Button>
                </form>
              ) : (
                <p className="mt-5 rounded-md border border-border bg-surface-soft p-4 text-sm leading-6 text-muted">
                  Self-service rescheduling is unavailable for this appointment.
                  Please contact Switch North Immigration.
                </p>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancel Appointment</CardTitle>
                <CardDescription>
                  Cancellation does not automatically issue a Stripe refund.
                  Refunds are separate business operations.
                </CardDescription>
              </CardHeader>
              {canCancel ? (
                <form
                  action={cancelManagedAppointmentAction.bind(null, token)}
                  className="mt-5 grid gap-4"
                >
                  <label className="flex gap-3 text-sm leading-6 text-muted">
                    <input
                      className="mt-1 size-4"
                      name="confirmCancel"
                      required
                      type="checkbox"
                    />
                    I understand this cancels the appointment and does not
                    automatically issue a refund.
                  </label>
                  <Button type="submit" variant="secondary">
                    Cancel Appointment
                  </Button>
                </form>
              ) : (
                <p className="mt-5 rounded-md border border-border bg-surface-soft p-4 text-sm leading-6 text-muted">
                  Self-service cancellation is unavailable for this appointment.
                  Please contact Switch North Immigration.
                </p>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
