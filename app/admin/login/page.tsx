import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Sign In",
};

export default function AdminLoginPage() {
  return (
    <section className="bg-surface-soft py-16 md:py-24">
      <Container className="max-w-xl">
        <Card>
          <div className="grid size-12 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
            <LockKeyhole aria-hidden="true" size={24} />
          </div>
          <CardHeader className="mt-5">
            <CardTitle>Admin sign in</CardTitle>
            <CardDescription>
              Access is limited to the internal Switch North Immigration admin
              account. Public registration is not available.
            </CardDescription>
          </CardHeader>
          <div className="mt-6">
            <LoginForm />
          </div>
        </Card>
      </Container>
    </section>
  );
}
