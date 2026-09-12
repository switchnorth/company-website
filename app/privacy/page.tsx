import type { Metadata } from "next";
import { RouteScaffold } from "@/components/sections/route-scaffold";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <RouteScaffold
      eyebrow="Privacy"
      title="Privacy Policy Scaffold"
      description="Placeholder route for a future reviewed privacy policy."
      breadcrumbs={[{ label: "Privacy", href: "/privacy" }]}
    />
  );
}
