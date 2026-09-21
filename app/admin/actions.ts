"use server";

import { redirect } from "next/navigation";
import { featureFlags } from "@/data/features";
import { clearAdminSession } from "@/lib/admin/auth";

export async function logoutAdmin() {
  if (!featureFlags.adminPortal) {
    redirect("/");
  }

  await clearAdminSession();
  redirect("/admin/login");
}
