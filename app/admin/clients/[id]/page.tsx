import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppointmentTable } from "@/components/admin/appointment-table";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/admin/auth";
import {
  AdminRecordNotFoundError,
  getAdminClientDetail,
} from "@/lib/admin/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Client Detail",
};

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  let detail;

  try {
    detail = await getAdminClientDetail(admin, id);
  } catch (error) {
    if (error instanceof AdminRecordNotFoundError) {
      notFound();
    }

    throw error;
  }

  return (
    <AdminShell admin={admin}>
      <Container className="grid gap-6 py-8 md:py-10">
        <div>
          <Link
            className="text-sm font-semibold text-brand-teal hover:text-accent-red"
            href="/admin/clients"
          >
            Back to clients
          </Link>
          <h2 className="mt-3 text-2xl font-semibold text-deep-ink">
            {detail.client.fullName}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {detail.client.email} | {detail.client.phone}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Snapshot</CardTitle>
            <CardDescription>
              Basic client information from appointment intake.
            </CardDescription>
          </CardHeader>
          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-3">
            <div className="rounded-md border border-border p-3">
              <dt className="font-semibold text-deep-ink">Country</dt>
              <dd className="mt-1 text-muted">{detail.client.country}</dd>
            </div>
            <div className="rounded-md border border-border p-3">
              <dt className="font-semibold text-deep-ink">Immigration interest</dt>
              <dd className="mt-1 text-muted">{detail.client.interest}</dd>
            </div>
            <div className="rounded-md border border-border p-3">
              <dt className="font-semibold text-deep-ink">Preferred language</dt>
              <dd className="mt-1 text-muted">{detail.client.preferredLanguage}</dd>
            </div>
          </dl>
        </Card>

        <section className="grid gap-4">
          <h3 className="text-xl font-semibold text-deep-ink">Appointment History</h3>
          <AppointmentTable rows={detail.appointments} />
        </section>
      </Container>
    </AdminShell>
  );
}
