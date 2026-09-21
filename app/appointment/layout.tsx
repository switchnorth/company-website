import { notFound } from "next/navigation";
import { featureFlags } from "@/data/features";

export default function AppointmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!featureFlags.appointmentManagement) {
    notFound();
  }

  return children;
}
