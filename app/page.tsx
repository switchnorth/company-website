import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Languages,
  MapPinned,
  MessageSquareText,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Cta } from "@/components/sections/cta";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Switch North Immigration provides Canadian immigration consulting for workers, students, families, visitors, permanent residence applicants, and future citizens.",
});

const trustItems = [
  {
    title: "Personalized Guidance",
    icon: Compass,
  },
  {
    title: "Transparent Process",
    icon: ClipboardCheck,
  },
  {
    title: "Canada-Wide Services",
    icon: MapPinned,
  },
  {
    title: "Multilingual Support",
    icon: Languages,
  },
];

const trustSignals = [
  {
    title: "Personalized guidance",
    body: "Advice starts with your facts, goals, family context, and documents.",
    icon: Compass,
  },
  {
    title: "Clear communication",
    body: "Next steps are explained in plain language, with realistic expectations.",
    icon: MessageSquareText,
  },
  {
    title: "Privacy-conscious process",
    body: "Forms ask for useful intake details without requesting unnecessary document numbers.",
    icon: ShieldCheck,
  },
  {
    title: "Multilingual support",
    body: `Current development languages: ${siteConfig.languages.join(", ")}.`,
    icon: Languages,
  },
  {
    title: "Canada-wide and international",
    body: "The demo service area supports planning conversations from Canada and abroad.",
    icon: Globe2,
  },
  {
    title: "Official-source awareness",
    body: "Program pages stay general and point users back to current official instructions.",
    icon: ClipboardCheck,
  },
];

const featuredServiceSlugs = [
  "express-entry",
  "provincial-nominee-program",
  "family-sponsorship",
  "study-permits",
  "work-permits",
  "visitor-visas",
];

const serviceSummaries: Record<string, string> = {
  "express-entry":
    "Organized guidance for skilled workers exploring federal economic immigration options.",
  "provincial-nominee-program":
    "Support for candidates considering province or territory nomination pathways.",
  "family-sponsorship":
    "Careful preparation support for families planning sponsorship applications.",
  "study-permits":
    "Practical guidance for students preparing for study in Canada.",
  "work-permits":
    "Document and pathway support for temporary workers and employers.",
  "visitor-visas":
    "Clear preparation for short-term travel, family visits, and temporary stays.",
};

const valueProps = [
  {
    title: "Personalized immigration strategy",
    body: "Your goals, timeline, family context, and documents shape the plan instead of forcing you into a generic checklist.",
    icon: Route,
  },
  {
    title: "Clear communication",
    body: "You get plain-language guidance, direct next steps, and a process that respects how important these decisions are.",
    icon: MessageSquareText,
  },
  {
    title: "Organized application support",
    body: "Forms, evidence, and follow-up items are approached with structure so the path forward feels manageable.",
    icon: FileCheck2,
  },
  {
    title: "Client-focused guidance",
    body: "The work centers on informed decisions, careful preparation, and realistic expectations. No outcome is guaranteed.",
    icon: HeartHandshake,
  },
];

const processSteps = [
  {
    title: "Initial Assessment",
    body: "Share the basics so the right immigration topics and documents can be identified.",
  },
  {
    title: "Strategy & Consultation",
    body: "Review your goals and discuss practical options based on your situation.",
  },
  {
    title: "Application Preparation",
    body: "Organize forms, supporting documents, and submission-ready details.",
  },
  {
    title: "Ongoing Support",
    body: "Receive guidance on next steps, updates, and follow-up requests where applicable.",
  },
];

const pathways = [
  {
    title: "Work in Canada",
    href: "/services/work-permits",
    icon: Handshake,
  },
  {
    title: "Study in Canada",
    href: "/services/study-permits",
    icon: GraduationCap,
  },
  {
    title: "Reunite with Family",
    href: "/services/family-sponsorship",
    icon: UsersRound,
  },
  {
    title: "Become a Permanent Resident",
    href: "/services/permanent-residence",
    icon: Globe2,
  },
  {
    title: "Visit Canada",
    href: "/services/visitor-visas",
    icon: Plane,
  },
  {
    title: "Become a Canadian Citizen",
    href: "/services/citizenship",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Do I need an immigration consultant?",
    answer:
      "Some people prepare applications on their own, while others prefer professional support for strategy, document organization, and review. A consultation can help you understand where guidance may be useful.",
  },
  {
    question: "Can Switch North guarantee my application will be approved?",
    answer:
      "No. Immigration outcomes depend on the facts of the application and the decision-maker. The role of professional support is to help you prepare clearly and carefully, not to promise a result.",
  },
  {
    question: "What should I prepare before an assessment?",
    answer:
      "Bring or summarize your current status, immigration history, education, work experience, family details, timelines, and any important documents or deadlines.",
  },
  {
    question: "Can you help clients outside Canada?",
    answer:
      "The current demo service area is Canada and international clients. Final service availability should be confirmed before production launch.",
  },
  {
    question: "Will the website show current program requirements?",
    answer:
      "Program-specific information should be reviewed against current official sources before publication. This homepage intentionally keeps guidance general.",
  },
  {
    question: "Is the demo RCIC number real?",
    answer:
      "No. DEMO-RCIC-000000 is development placeholder data and must be replaced with verified professional information before production.",
  },
];

export default function Home() {
  const featuredServices = siteConfig.serviceCategories.filter((service) =>
    featuredServiceSlugs.includes(service.slug),
  );

  return (
    <>
      <section className="relative isolate overflow-hidden bg-deep-ink text-white">
        <Image
          src="/images/consultation-hero.png"
          alt="Canadian immigration consultation in a modern office"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(23,42,80,0.94)_0%,rgba(15,120,148,0.76)_46%,rgba(23,42,80,0.18)_82%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[7vw] top-1/2 -z-10 hidden size-80 -translate-y-1/2 lg:block"
        >
          <div className="absolute inset-0 rounded-full border border-white/18" />
          <div className="absolute inset-10 rounded-full border border-brand-mint/24" />
          <div className="absolute left-1/2 top-5 h-[17rem] w-px origin-bottom -rotate-45 bg-brand-mint/45" />
          <div className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rotate-45 border-r-2 border-t-2 border-brand-mint/60" />
          <div className="absolute bottom-10 left-12 h-px w-48 rotate-[-18deg] bg-white/20" />
        </div>
        <Container className="flex min-h-[560px] flex-col justify-center py-16 md:min-h-[640px] md:py-20">
          <div className="max-w-2xl">
            <Badge tone="mint" className="border-white/20 bg-white/10 text-white">
              Canadian Immigration Consulting
            </Badge>
            <h1 className="text-balance mt-5 font-serif text-[clamp(2.5rem,5.3vw,4rem)] leading-[1.06]">
              Move forward with a clearer Canadian immigration plan.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/86 md:text-[17px] md:leading-8">
              Switch North Immigration helps workers, students, families,
              visitors, and future citizens understand their options and prepare
              with confidence.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={siteConfig.bookingUrl} variant="light" size="lg">
                {siteConfig.consultationCta}
                <ArrowRight aria-hidden="true" size={19} />
              </ButtonLink>
              <ButtonLink
                href="/assessment"
                size="lg"
                variant="outlineOnDark"
              >
                {siteConfig.secondaryCta}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-white py-6">
        <Container className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div className="flex items-center gap-3" key={item.title}>
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                  <Icon aria-hidden="true" size={20} />
                </span>
                <p className="text-base font-semibold text-deep-ink">{item.title}</p>
              </div>
            );
          })}
        </Container>
      </section>

      <Section>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Services"
            title="Support for common Canadian immigration needs."
            description="Start with the area closest to your goal. Detailed program-specific information should be reviewed before it is published."
          />
          <ButtonLink href="/services" variant="outline" className="shrink-0">
            View All Services
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                href={`/services/${service.slug}`}
                className="focus-ring group rounded-md"
                key={service.slug}
              >
                <Card className="h-full hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-soft">
                  <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal transition group-hover:bg-brand-teal group-hover:text-white">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <CardHeader className="mt-5">
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>
                      {serviceSummaries[service.slug]}
                    </CardDescription>
                  </CardHeader>
                  <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-brand-teal group-hover:text-accent-red">
                    Learn more
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Why Switch North"
            title="Calm, organized support for important decisions."
            description="Immigration planning can feel complicated. The service experience is designed around clarity, preparation, and realistic expectations."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {valueProps.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title}>
                  <div className="grid size-10 place-items-center rounded-md bg-white text-accent-red ring-1 ring-border">
                    <Icon aria-hidden="true" size={20} />
                  </div>
                  <CardHeader className="mt-5">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.body}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <SectionHeading
            eyebrow="Trust"
            title="Grounded guidance without inflated promises."
            description="Switch North can build credibility through clarity, privacy, languages, service coverage, and current-review discipline instead of fabricated proof points."
          />
          <div className="rounded-md border border-border bg-white">
            {trustSignals.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="grid gap-4 border-b border-border p-5 last:border-b-0 sm:grid-cols-[2.2rem_1fr]"
                  key={item.title}
                >
                  <span className="grid size-9 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 text-deep-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-7 text-muted">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="How It Works"
          title="A straightforward path from questions to preparation."
          description="The process is structured enough to keep details organized and flexible enough to fit your situation."
          align="center"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Card key={step.title} className="relative overflow-hidden">
              <span className="absolute right-5 top-5 font-serif text-4xl text-brand-teal-soft">
                {index + 1}
              </span>
              <div className="relative">
                <div className="grid size-10 place-items-center rounded-md bg-brand-teal text-white">
                  <CheckCircle2 aria-hidden="true" size={20} />
                </div>
                <CardHeader className="mt-5">
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.body}</CardDescription>
                </CardHeader>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="brand">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="About"
            title="A modern immigration practice built around careful guidance."
            description={`${siteConfig.businessName} is represented in development by ${siteConfig.consultantName}, ${siteConfig.consultantTitle}. This profile uses demo information that must be verified before production.`}
            inverse
          />
          <Card className="border-white/15 bg-white/8 text-white shadow-none">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[15px] font-semibold uppercase text-brand-mint">Consultant</p>
                <p className="mt-2 text-lg font-semibold">{siteConfig.consultantName}</p>
                <p className="mt-1 text-base text-white/74">{siteConfig.consultantTitle}</p>
              </div>
              <div>
                <p className="text-[15px] font-semibold uppercase text-brand-mint">Languages</p>
                <p className="mt-2 text-base text-white/80">
                  {siteConfig.languages.join(", ")}
                </p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-6 text-white/62">
              Development licence placeholder: {siteConfig.consultantLicense}.
            </p>
            <ButtonLink href="/about" variant="light" className="mt-6">
              Learn About Us
              <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Pathways"
          title="What are you hoping to do in Canada?"
          description="Choose a goal to start exploring the matching service area."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((pathway) => {
            const Icon = pathway.icon;

            return (
              <Link
                href={pathway.href}
                className="focus-ring group flex items-center justify-between rounded-md border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-soft"
                key={pathway.title}
              >
                <span className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal transition group-hover:bg-brand-teal group-hover:text-white">
                    <Icon aria-hidden="true" size={22} />
                  </span>
                  <span className="font-semibold text-deep-ink">{pathway.title}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="shrink-0 text-muted group-hover:text-accent-red"
                  size={18}
                />
              </Link>
            );
          })}
        </div>
      </Section>

      <Cta
        title="Discuss your immigration goals with Switch North."
        description="Start with a free assessment or book a consultation to talk through your situation, documents, and possible next steps."
        primaryHref={siteConfig.bookingUrl}
        primaryLabel={siteConfig.consultationCta}
        secondaryHref="/assessment"
        secondaryLabel={siteConfig.secondaryCta}
      />

      <Section tone="white">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions before you begin."
          description="These answers are general and avoid time-sensitive program details."
        />
        <div className="mt-10 grid gap-4">
          {faqs.map((faq) => (
            <details
              className="group rounded-md border border-border bg-background p-5 shadow-sm"
              key={faq.question}
            >
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-left font-semibold text-deep-ink">
                {faq.question}
                <Sparkles
                  aria-hidden="true"
                  className="shrink-0 text-accent-red transition group-open:rotate-45"
                  size={18}
                />
              </summary>
              <p className="mt-4 text-base leading-8 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <div className="flex flex-col gap-5 rounded-md border border-border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-accent-red">General Information</p>
            <p className="mt-2 max-w-3xl text-base leading-8 text-muted">
              Website information is general in nature and is not a substitute
              for individualized professional advice. Immigration outcomes are
              never guaranteed.
            </p>
          </div>
          <ButtonLink href="/contact" variant="outline" className="shrink-0">
            Contact
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
