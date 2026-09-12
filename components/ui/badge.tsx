import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "accent" | "mint" | "neutral";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  brand: "border-brand-teal/15 bg-brand-teal-soft text-brand-teal",
  accent: "border-accent-red/15 bg-accent-red-soft text-accent-red-dark",
  mint: "border-brand-mint/25 bg-brand-mint-soft text-brand-navy",
  neutral: "border-border bg-white text-muted",
};

export function Badge({ children, className, tone = "brand" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-3 py-1.5 text-[13px] font-semibold uppercase tracking-normal",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
