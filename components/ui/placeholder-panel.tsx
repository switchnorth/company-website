import { CircleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

type PlaceholderPanelProps = {
  title?: string;
  children?: React.ReactNode;
};

export function PlaceholderPanel({
  title = "Phase 0 placeholder",
  children,
}: PlaceholderPanelProps) {
  return (
    <Card>
      <div className="flex gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-teal-soft text-brand-teal">
          <CircleAlert aria-hidden="true" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-deep-ink">{title}</h2>
          <div className="mt-2 text-sm leading-7 text-muted">
            {children ?? (
              <p>
                Detailed copy, forms, integrations, and program-specific
                guidance will be added in later phases after review.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
