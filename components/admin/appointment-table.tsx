import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import type { AdminAppointmentRow } from "@/types/admin";

export function AppointmentTable({
  emptyMessage = "No appointments found.",
  rows,
}: {
  emptyMessage?: string;
  rows: AdminAppointmentRow[];
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-border bg-white p-6 text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-border bg-surface-soft text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Consultation</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Agreement</th>
              <th className="px-4 py-3">Calendar</th>
              <th className="px-4 py-3">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr className="align-top" key={row.appointment.id}>
                <td className="px-4 py-4 font-semibold text-deep-ink">
                  {row.appointment.client.fullName}
                </td>
                <td className="px-4 py-4 text-muted">
                  <div>{row.appointment.client.email}</div>
                  <div>{row.appointment.client.phone}</div>
                </td>
                <td className="px-4 py-4 text-muted">{row.consultationTitle}</td>
                <td className="px-4 py-4 text-muted">
                  <div>{row.appointment.date}</div>
                  <div>
                    {row.appointment.startTime} - {row.appointment.endTime}
                  </div>
                  <div>{row.appointment.timeZone}</div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={row.appointment.paymentStatus} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={row.appointment.status} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={row.agreementStatus} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={row.calendarStatus} />
                </td>
                <td className="px-4 py-4">
                  <Link
                    className="font-semibold text-brand-teal hover:text-accent-red"
                    href={`/admin/appointments/${row.appointment.id}`}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-0 divide-y divide-border md:hidden">
        {rows.map((row) => (
          <article className="grid gap-4 p-4" key={row.appointment.id}>
            <div>
              <h3 className="font-semibold text-deep-ink">
                {row.appointment.client.fullName}
              </h3>
              <p className="mt-1 text-sm text-muted">{row.appointment.client.email}</p>
            </div>
            <dl className="grid gap-3 text-sm text-muted">
              <div>
                <dt className="font-semibold text-deep-ink">Time</dt>
                <dd>
                  {row.appointment.date}, {row.appointment.startTime} -{" "}
                  {row.appointment.endTime}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={row.appointment.status} />
                <StatusBadge value={row.appointment.paymentStatus} />
                <StatusBadge value={row.agreementStatus} />
              </div>
            </dl>
            <ButtonLink
              href={`/admin/appointments/${row.appointment.id}`}
              size="sm"
              variant="outline"
            >
              View Details
            </ButtonLink>
          </article>
        ))}
      </div>
    </div>
  );
}
