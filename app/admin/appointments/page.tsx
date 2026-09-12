import type { Metadata } from "next";
import { AppointmentTable } from "@/components/admin/appointment-table";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/admin/auth";
import { listAdminAppointmentRows } from "@/lib/admin/service";
import type { AdminAppointmentFilters } from "@/types/admin";
import type { AppointmentStatus, PaymentStatus } from "@/types/booking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Appointments",
};

const appointmentStatusOptions: Array<AppointmentStatus | "all"> = [
  "all",
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
];

const paymentStatusOptions: Array<PaymentStatus | "all"> = [
  "all",
  "PENDING",
  "PAYMENT_REQUIRED",
  "PAID",
  "FAILED",
  "EXPIRED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const filters: AdminAppointmentFilters = {
    date: readParam(params.date),
    paymentStatus: readParam(params.paymentStatus) as PaymentStatus | "all",
    search: readParam(params.search),
    status: readParam(params.status) as AppointmentStatus | "all",
  };
  const rows = await listAdminAppointmentRows(admin, filters);

  return (
    <AdminShell admin={admin}>
      <Container className="grid gap-6 py-8 md:py-10">
        <div>
          <h2 className="text-2xl font-semibold text-deep-ink">Appointments</h2>
          <p className="mt-2 text-sm text-muted">
            Search and filter consultation appointments without opening the database.
          </p>
        </div>

        <Card className="p-5">
          <form className="grid gap-4 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_auto] md:items-end">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-deep-ink" htmlFor="search">
                Search
              </label>
              <input
                className="focus-ring min-h-11 rounded-md border border-border bg-white px-3 text-sm text-deep-ink"
                defaultValue={filters.search}
                id="search"
                name="search"
                placeholder="Name or email"
                type="search"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-deep-ink" htmlFor="date">
                Date
              </label>
              <input
                className="focus-ring min-h-11 rounded-md border border-border bg-white px-3 text-sm text-deep-ink"
                defaultValue={filters.date}
                id="date"
                name="date"
                type="date"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-deep-ink" htmlFor="status">
                Status
              </label>
              <select
                className="focus-ring min-h-11 rounded-md border border-border bg-white px-3 text-sm text-deep-ink"
                defaultValue={filters.status ?? "all"}
                id="status"
                name="status"
              >
                {appointmentStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {label(option)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-semibold text-deep-ink"
                htmlFor="paymentStatus"
              >
                Payment
              </label>
              <select
                className="focus-ring min-h-11 rounded-md border border-border bg-white px-3 text-sm text-deep-ink"
                defaultValue={filters.paymentStatus ?? "all"}
                id="paymentStatus"
                name="paymentStatus"
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {label(option)}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Filter</Button>
          </form>
        </Card>

        <AppointmentTable rows={rows} />
      </Container>
    </AdminShell>
  );
}
