"use server";

import { redirect } from "next/navigation";
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin/auth";

export type AdminLoginState = {
  error: string;
};

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const identity = verifyAdminCredentials(username, password);

  if (!identity) {
    return {
      error: "The admin username or password is incorrect.",
    };
  }

  await setAdminSession(identity);
  redirect("/admin");
}
