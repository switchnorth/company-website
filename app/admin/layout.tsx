import { notFound } from "next/navigation";
import { featureFlags } from "@/data/features";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!featureFlags.adminPortal) {
    notFound();
  }

  return children;
}
