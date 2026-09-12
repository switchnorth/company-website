import type { Metadata } from "next";
import { ClipboardList, LockKeyhole, ShieldCheck } from "lucide-react";
import { AssessmentForm } from "@/components/sections/assessment-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Free Immigration Assessment",
  description:
    "Complete a free Canadian immigration assessment for Switch North Immigration to review possible options and next steps.",
  path: "/assessment",
});

const notes = [
  {
    title: "No eligibility promise",
    description:
      "The assessment collects intake details only. It does not calculate eligibility or guarantee an outcome.",
    icon: ShieldCheck,
  },
  {
    title: "Reviewed for next steps",
    description:
      "Your answers help identify which immigration service or consultation path may be appropriate to discuss.",
    icon: ClipboardList,
  },
  {
    title: "Privacy aware",
    description:
      "Share helpful context, but avoid sensitive document numbers or unnecessary personal records in this form.",
    icon: LockKeyhole,
  },
];

export default function AssessmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free Assessment"
        title="Share your background so we can review possible immigration options."
        description={`${siteConfig.businessName} uses this assessment to understand your goals, education, work history, language background, and Canada connections before recommending a sensible next step.`}
      />

      <Section containerClassName="grid gap-8">
        <Breadcrumbs
          items={[{ label: "Free Assessment", href: "/assessment" }]}
        />
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <aside className="grid gap-5">
            {notes.map((note) => {
              const Icon = note.icon;

              return (
                <Card key={note.title}>
                  <div className="grid size-11 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <CardHeader className="mt-5">
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>{note.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </aside>

          <AssessmentForm />
        </div>
      </Section>
    </>
  );
}
