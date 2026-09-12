import type { Metadata } from "next";
import Link from "next/link";
import { AppointmentTable } from "@/components/admin/appointment-table";
import { AdminShell } from "@/components/admin/admin-shell";
import { MetricCard } from "@/components/admin/metric-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminDashboardSummary, listAdminAuditLog } from "@/lib/admin/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const summary = await getAdminDashboardSummary(admin);
  const auditLog = listAdminAuditLog(admin).slice(0, 6);

  return (
    <AdminShell admin={admin}>
      <Container className="grid gap-8 py-8 md:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Appointments Today" value={summary.appointmentsToday} />
          <MetricCard label="Appointments This Week" value={summary.appointmentsThisWeek} />
          <MetricCard label="Pending Payments" value={summary.pendingPayments.length} />
          <MetricCard label="Agreements Not Sent" value={summary.agreementsNotSent} />
        </div>

        <section className="grid gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-deep-ink">
                Today&apos;s Appointments
              </h2>
              <p className="mt-1 text-sm text-muted">
                Quick mobile-friendly view for the day&apos;s consultation schedule.
              </p>
            </div>
            <ButtonLink href="/admin/appointments" size="sm" variant="outline">
              View All Appointments
            </ButtonLink>
          </div>
          <AppointmentTable
            emptyMessage="No appointments are scheduled for today."
            rows={summary.todayAppointments}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                The next confirmed or pending consultations in chronological order.
              </CardDescription>
            </CardHeader>
            <div className="mt-5 grid gap-3">
              {summary.upcomingAppointments.length ? (
                summary.upcomingAppointments.slice(0, 5).map((row) => (
                  <Link
                    className="rounded-md border border-border p-4 transition hover:border-brand-teal hover:bg-brand-teal-soft"
                    href={`/admin/appointments/${row.appointment.id}`}
                    key={row.appointment.id}
                  >
                    <p className="font-semibold text-deep-ink">
                      {row.appointment.client.fullName}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {row.appointment.date}, {row.appointment.startTime} -{" "}
                      {row.appointment.endTime}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted">No upcoming appointments.</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>
                Paid appointment records only. No card information is displayed.
              </CardDescription>
            </CardHeader>
            <div className="mt-5 grid gap-3">
              {summary.recentPayments.length ? (
                summary.recentPayments.map((row) => (
                  <Link
                    className="rounded-md border border-border p-4 transition hover:border-brand-teal hover:bg-brand-teal-soft"
                    href={`/admin/appointments/${row.appointment.id}`}
                    key={row.appointment.id}
                  >
                    <p className="font-semibold text-deep-ink">
                      {row.appointment.client.fullName}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {row.appointment.paymentPaidAt ?? "Paid date not recorded"}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted">No recent paid appointments.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>{summary.pendingPayments.length} records</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Appointments</CardTitle>
              <CardDescription>
                {summary.confirmedAppointments.length} recent records
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Appointments</CardTitle>
              <CardDescription>
                {summary.cancelledAppointments.length} recent records
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Log</CardTitle>
            <CardDescription>
              Important admin actions without storing unnecessary personal details.
            </CardDescription>
          </CardHeader>
          <div className="mt-5 grid gap-3 text-sm">
            {auditLog.length ? (
              auditLog.map((entry) => (
                <div
                  className="grid gap-1 rounded-md border border-border p-3 md:grid-cols-[1fr_auto]"
                  key={`${entry.action}-${entry.entityId}-${entry.timestamp}`}
                >
                  <span className="font-semibold text-deep-ink">
                    {entry.action.replaceAll("_", " ").toLowerCase()} on{" "}
                    {entry.entity} {entry.entityId}
                  </span>
                  <span className="text-muted">{entry.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-muted">No admin actions recorded yet.</p>
            )}
          </div>
        </Card>
      </Container>
    </AdminShell>
  );
}
