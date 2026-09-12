import { ArrowRight, CalendarCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/data/site";

type CtaProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function Cta({
  title = "Ready for a clearer next step?",
  description = "Book a consultation to discuss your immigration goals, or start with the free assessment if you are still exploring your options.",
  primaryHref = siteConfig.bookingUrl,
  primaryLabel = siteConfig.consultationCta,
  secondaryHref = "/assessment",
  secondaryLabel = siteConfig.secondaryCta,
}: CtaProps) {
  return (
    <Section tone="brand" className="border-y border-brand-teal/25">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[15px] font-semibold uppercase text-brand-mint">
            <CalendarCheck aria-hidden="true" size={18} />
            Next step
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.875rem,3.2vw,2.75rem)] leading-[1.12] text-white">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/80 md:text-[17px] md:leading-8">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={primaryHref} variant="light">
            {primaryLabel}
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
          <ButtonLink
            href={secondaryHref}
            variant="outlineOnDark"
          >
            {secondaryLabel}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
