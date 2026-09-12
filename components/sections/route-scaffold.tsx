import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageHeader } from "@/components/ui/page-header";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";
import { Section } from "@/components/ui/section";
import type { NavigationItem } from "@/types/site";

type RouteScaffoldProps = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: NavigationItem[];
  children?: React.ReactNode;
};

export function RouteScaffold({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: RouteScaffoldProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Section containerClassName="grid gap-8">
        <Breadcrumbs items={breadcrumbs} />
        {children ?? <PlaceholderPanel />}
      </Section>
    </>
  );
}
