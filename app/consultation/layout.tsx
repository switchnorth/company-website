import { redirect } from "next/navigation";
import { featureFlags } from "@/data/features";

export default function ConsultationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!featureFlags.appointments) {
    redirect("/contact");
  }

  return children;
}
