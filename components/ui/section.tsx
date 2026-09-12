import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  tone?: "default" | "soft" | "white" | "brand";
};

const tones: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-background",
  soft: "bg-surface-soft",
  white: "bg-white",
  brand: "bg-brand-navy text-white",
};

export function Section({
  children,
  className,
  containerClassName,
  tone = "default",
}: SectionProps) {
  return (
    <section className={cn("py-16 md:py-20 lg:py-24", tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
