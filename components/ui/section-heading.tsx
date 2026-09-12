import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? <Badge tone={inverse ? "mint" : "brand"}>{eyebrow}</Badge> : null}
      <h2
        className={cn(
          "mt-4 font-serif text-[clamp(1.75rem,3vw,2.625rem)] leading-[1.12]",
          inverse ? "text-white" : "text-deep-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-7 md:text-[17px] md:leading-8",
            inverse ? "text-white/78" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
