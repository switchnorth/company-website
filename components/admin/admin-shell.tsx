import Link from "next/link";
import { CalendarDays, LayoutDashboard, LogOut, Users } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { AdminIdentity } from "@/types/admin";

const links = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/appointments", icon: CalendarDays, label: "Appointments" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
];

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminIdentity;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface-soft">
      <Container className="py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-brand-teal">
              Internal admin
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-deep-ink md:text-3xl">
              Appointment operations
            </h1>
            <p className="mt-2 text-sm text-muted">
              Signed in as {admin.username}
            </p>
          </div>
          <form action={logoutAdmin}>
            <Button className="w-full md:w-auto" size="sm" type="submit" variant="outline">
              <LogOut aria-hidden="true" size={16} />
              Sign out
            </Button>
          </form>
        </div>
        <nav
          aria-label="Admin navigation"
          className="mt-7 flex flex-wrap gap-2 border-t border-border pt-5"
        >
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-white px-3.5 py-2 text-sm font-semibold text-deep-ink transition hover:border-brand-teal hover:bg-brand-teal-soft"
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden="true" size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </Container>
      <div className="bg-background">{children}</div>
    </div>
  );
}
