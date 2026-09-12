import type { Metadata } from "next";
import { CalendarCheck, ClipboardList, CreditCard, MessageSquareText } from "lucide-react";
import { BookingForm } from "@/components/sections/booking-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { consultationTypes } from "@/data/booking";
import { getBookingSlots } from "@/lib/booking/service";
import { createPageMetadata } from "@/lib/metadata";
import type { AvailabilitySlot } from "@/types/booking";

export const metadata: Metadata = createPageMetadata({
  title: "Consultation",
  description:
    "Book a consultation with Switch North Immigration through an integrated appointment flow with configurable availability and a payment-ready handoff.",
  path: "/consultation",
});

export const dynamic = "force-dynamic";

const expectations = [
  {
    title: "Choose the right session",
    description:
      "Select a sample consultation type and review the duration before choosing a slot.",
    icon: ClipboardList,
  },
  {
    title: "Pick an available time",
    description:
      "Availability uses business hours, minimum notice, blocked times, and appointment holds.",
    icon: CalendarCheck,
  },
  {
    title: "Payment-ready handoff",
    description:
      "The appointment remains pending until payment succeeds in the future payment phase.",
    icon: CreditCard,
  },
];

export default async function ConsultationPage() {
  const slotsByType = {} as Record<string, AvailabilitySlot[]>;

  for (const type of consultationTypes) {
    slotsByType[type.id] = await getBookingSlots(type.id);
  }

  return (
    <>
      <PageHeader
        eyebrow="Consultation Booking"
        title="Book a consultation time with a clear payment-ready workflow."
        description="Choose a consultation type, select an available time, enter your details, and continue to the payment handoff. A slot is not fully confirmed until payment succeeds."
      />

      <Section containerClassName="grid gap-8">
        <Breadcrumbs items={[{ label: "Consultation", href: "/consultation" }]} />
        <div className="grid gap-5 md:grid-cols-3">
          {expectations.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                  <Icon aria-hidden="true" size={22} />
                </div>
                <CardHeader className="mt-5">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="p-5 sm:p-7">
          <BookingForm
            consultationTypes={[...consultationTypes]}
            slotsByType={slotsByType}
          />
        </Card>
      </Section>

      <Section tone="soft">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Architecture"
            title="Built for production persistence without locking in infrastructure."
            description="The current adapter stores appointment holds in memory for development only. For production, connect the repository interface to managed Postgres through Supabase or Neon before accepting paid bookings."
          />
          <Card>
            <CardHeader>
              <CardTitle>Payment phase boundary</CardTitle>
              <CardDescription>
                Phase 10 creates pending-payment holds and prevents slot overlap.
                Phase 11 can create a payment session, redirect the client, and
                mark the appointment confirmed only after a verified payment
                webhook succeeds.
              </CardDescription>
            </CardHeader>
            <div className="mt-5 flex gap-3 text-[15px] leading-7 text-muted">
              <MessageSquareText
                aria-hidden="true"
                className="mt-1 shrink-0 text-brand-teal"
                size={18}
              />
              <p>
                No appointment should be considered confirmed until payment
                status is updated from the future payment provider integration.
              </p>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
