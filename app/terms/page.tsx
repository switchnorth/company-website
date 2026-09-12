import type { Metadata } from "next";
import { RouteScaffold } from "@/components/sections/route-scaffold";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <RouteScaffold
      eyebrow="Terms"
      title="Terms of Use Scaffold"
      description="Placeholder route for future reviewed website terms."
      breadcrumbs={[{ label: "Terms", href: "/terms" }]}
    />
  );
}
