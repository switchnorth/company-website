import { Badge } from "@/components/ui/badge";
import type { AgreementStatus, CalendarStatus } from "@/types/admin";
import type { AppointmentStatus, PaymentStatus } from "@/types/booking";

type StatusBadgeProps = {
  value: AgreementStatus | AppointmentStatus | CalendarStatus | PaymentStatus;
};

function getTone(value: StatusBadgeProps["value"]) {
  if (
    value === "CONFIRMED" ||
    value === "PAID" ||
    value === "SENT" ||
    value === "SIGNED" ||
    value === "ACCEPTED" ||
    value === "COMPLETED" ||
    value === "CREATED"
  ) {
    return "brand" as const;
  }

  if (
    value === "CANCELLED" ||
    value === "FAILED" ||
    value === "EXPIRED" ||
    value === "NO_SHOW"
  ) {
    return "accent" as const;
  }

  return "neutral" as const;
}

export function formatStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}

export function StatusBadge({ value }: StatusBadgeProps) {
  return <Badge tone={getTone(value)}>{formatStatus(value)}</Badge>;
}
