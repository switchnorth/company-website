import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/admin/auth";
import { listAdminClients } from "@/lib/admin/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Clients",
};

function appointmentLabel(date?: string, time?: string) {
  return date ? `${date}${time ? `, ${time}` : ""}` : "None";
}

export default async function AdminClientsPage() {
  const admin = await requireAdmin();
  const clients = await listAdminClients(admin);

  return (
    <AdminShell admin={admin}>
      <Container className="grid gap-6 py-8 md:py-10">
        <div>
          <h2 className="text-2xl font-semibold text-deep-ink">Clients</h2>
          <p className="mt-2 text-sm text-muted">
            A simple client index grouped from appointment records.
          </p>
        </div>

        <Card className="overflow-hidden p-0">
          {clients.length ? (
            <div className="divide-y divide-border">
              {clients.map((client) => (
                <article
                  className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto] md:items-center"
                  key={client.id}
                >
                  <div>
                    <h3 className="font-semibold text-deep-ink">{client.name}</h3>
                    <p className="mt-1 text-sm text-muted">{client.email}</p>
                    <p className="text-sm text-muted">{client.phone}</p>
                  </div>
                  <div className="text-sm text-muted">
                    <span className="font-semibold text-deep-ink">Appointments:</span>{" "}
                    {client.appointmentCount}
                  </div>
                  <div className="text-sm text-muted">
                    <span className="font-semibold text-deep-ink">Last:</span>{" "}
                    {appointmentLabel(
                      client.lastAppointment?.date,
                      client.lastAppointment?.startTime,
                    )}
                  </div>
                  <div className="text-sm text-muted">
                    <span className="font-semibold text-deep-ink">Next:</span>{" "}
                    {appointmentLabel(
                      client.nextAppointment?.date,
                      client.nextAppointment?.startTime,
                    )}
                  </div>
                  <ButtonLink href={`/admin/clients/${client.id}`} size="sm" variant="outline">
                    View History
                  </ButtonLink>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-6 text-sm text-muted">No clients found.</div>
          )}
        </Card>

        <p className="text-sm text-muted">
          Need a specific appointment? Open{" "}
          <Link className="font-semibold text-brand-teal" href="/admin/appointments">
            appointments
          </Link>
          .
        </p>
      </Container>
    </AdminShell>
  );
}
