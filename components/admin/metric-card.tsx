import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-deep-ink">{value}</p>
    </Card>
  );
}
