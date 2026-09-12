import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarClock,
  Globe2,
  Languages,
  Mail,
  Map,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { Cta } from "@/components/sections/cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { contactInterestOptions } from "@/data/contact";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Switch North Immigration for Canadian immigration consultation inquiries, assessment requests, and general service questions.",
  path: "/contact",
});

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;

const contactMethods = [
  {
    title: "Phone",
    value: siteConfig.phone,
    href: phoneHref,
    icon: Phone,
  },
  {
    title: "Email",
    value: siteConfig.email,
    href: emailHref,
    icon: Mail,
  },
  {
    title: "Office",
    value: siteConfig.address,
    href: null,
    icon: MapPin,
  },
  {
    title: "Hours",
    value: siteConfig.businessHours,
    href: null,
    icon: CalendarClock,
  },
];

// Local SEO structure is intentionally conservative while the office address is demo data.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.businessName,
  url: siteConfig.domain,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  areaServed: siteConfig.serviceArea,
  address: {
    "@type": "PostalAddress",
    addressCountry: "CA",
  },
};

type ContactPageProps = {
  searchParams?: Promise<{
    interest?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const requestedInterest = params?.interest ?? "";
  const initialInterest = contactInterestOptions.some(
    (option) => option.value === requestedInterest,
  )
    ? requestedInterest
    : "";

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <PageHeader
        eyebrow="Contact"
        title="Start a clearer conversation about your Canadian immigration plans."
        description="Reach out with your immigration goal, current location, and the details you already have. Switch North will use that context to guide the next step without promising outcomes or fixed timelines."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={siteConfig.bookingUrl}>
            {siteConfig.consultationCta}
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
          <ButtonLink href="/assessment" variant="outline">
            {siteConfig.secondaryCta}
          </ButtonLink>
        </div>
      </PageHeader>

      <Section containerClassName="grid gap-8">
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <aside className="grid gap-5">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              const value = (
                <span className="whitespace-pre-line text-base leading-8 text-muted">
                  {method.value}
                </span>
              );

              return (
                <Card key={method.title}>
                  <div className="flex gap-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                      <Icon aria-hidden="true" size={22} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-deep-ink">
                        {method.title}
                      </h2>
                      {method.href ? (
                        <a
                          className="mt-1 inline-flex text-base font-semibold leading-8 text-brand-teal transition hover:text-accent-red"
                          href={method.href}
                        >
                          {method.value}
                        </a>
                      ) : (
                        <div className="mt-1">{value}</div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            <Card>
              <div className="grid size-11 place-items-center rounded-md bg-accent-red-soft text-accent-red">
                <Languages aria-hidden="true" size={22} />
              </div>
              <CardHeader className="mt-5">
                <CardTitle>Languages</CardTitle>
                <CardDescription>{siteConfig.languages.join(", ")}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <div className="grid size-11 place-items-center rounded-md bg-brand-mint-soft text-brand-teal">
                <Globe2 aria-hidden="true" size={22} />
              </div>
              <CardHeader className="mt-5">
                <CardTitle>Service Area</CardTitle>
                <CardDescription>{siteConfig.serviceArea}</CardDescription>
              </CardHeader>
            </Card>
          </aside>

          <Card className="p-5 sm:p-7">
            <SectionHeading
              eyebrow="Send A Message"
              title="Tell us what you are hoping to do next."
              description="Use this form for general inquiries, consultation requests, or to share context before a free assessment. A response expectation will be set after the inquiry is reviewed."
            />
            <div className="mt-8">
              <ContactForm initialInterest={initialInterest} />
            </div>
          </Card>
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <SectionHeading
            eyebrow="Office Location"
            title="Location details are ready for the real office address."
            description="The current address is development placeholder data. A real map pin should only be embedded after the office address has been confirmed."
          />
          <Card className="overflow-hidden p-0">
            <div className="relative min-h-80 bg-white">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,120,148,0.09)_1px,transparent_1px),linear-gradient(rgba(23,42,80,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="relative grid min-h-80 place-items-center p-8 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto grid size-14 place-items-center rounded-md bg-brand-teal text-white">
                    <Map aria-hidden="true" size={26} />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-deep-ink">
                    Map placeholder
                  </h2>
                  <p className="mt-3 text-base leading-8 text-muted">
                    Replace the demo address before enabling an embedded map or
                    location pin.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
              <ShieldCheck aria-hidden="true" size={22} />
            </div>
            <CardHeader className="mt-5">
              <CardTitle>Privacy-minded intake</CardTitle>
              <CardDescription>
                Share only the details needed to understand your inquiry. Full
                document review belongs in a proper consultation workflow.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <div className="grid size-11 place-items-center rounded-md bg-accent-red-soft text-accent-red">
              <CalendarClock aria-hidden="true" size={22} />
            </div>
            <CardHeader className="mt-5">
              <CardTitle>Clear next steps</CardTitle>
              <CardDescription>
                After your inquiry is reviewed, the next step may be a consultation,
                assessment follow-up, or request for additional context.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <div className="grid size-11 place-items-center rounded-md bg-brand-mint-soft text-brand-teal">
              <Mail aria-hidden="true" size={22} />
            </div>
            <CardHeader className="mt-5">
              <CardTitle>No outcome promises</CardTitle>
              <CardDescription>
                Immigration advice depends on facts and current requirements. The
                website does not guarantee approvals or processing timelines.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Cta
        title="Prefer to start with a guided assessment?"
        description="Book a consultation to discuss your goals, or use the free assessment if you want to organize your background first."
        primaryHref={siteConfig.bookingUrl}
        primaryLabel={siteConfig.consultationCta}
        secondaryHref="/assessment"
        secondaryLabel={siteConfig.secondaryCta}
      />
    </>
  );
}
