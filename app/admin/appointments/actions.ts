"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { featureFlags } from "@/data/features";
import { requireAdmin } from "@/lib/admin/auth";
import {
  cancelAppointment,
  confirmAppointmentManually,
  markAppointmentCompleted,
  markAppointmentNoShow,
  resendAgreementEmail,
  resendAppointmentConfirmation,
} from "@/lib/admin/service";

function getAppointmentId(formData: FormData) {
  return String(formData.get("appointmentId") ?? "").trim();
}

function assertAdminFeatureEnabled() {
  if (!featureFlags.adminPortal) {
    redirect("/");
  }
}

function revalidateAdminAppointment(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${id}`);
  revalidatePath("/admin/clients");
}

export async function confirmAppointmentAction(formData: FormData) {
  assertAdminFeatureEnabled();
  const admin = await requireAdmin();
  const id = getAppointmentId(formData);

  await confirmAppointmentManually(admin, id);
  revalidateAdminAppointment(id);
}

export async function cancelAppointmentAction(formData: FormData) {
  assertAdminFeatureEnabled();
  const admin = await requireAdmin();
  const id = getAppointmentId(formData);

  await cancelAppointment(admin, id);
  revalidateAdminAppointment(id);
}

export async function completeAppointmentAction(formData: FormData) {
  assertAdminFeatureEnabled();
  const admin = await requireAdmin();
  const id = getAppointmentId(formData);

  await markAppointmentCompleted(admin, id);
  revalidateAdminAppointment(id);
}

export async function noShowAppointmentAction(formData: FormData) {
  assertAdminFeatureEnabled();
  const admin = await requireAdmin();
  const id = getAppointmentId(formData);

  await markAppointmentNoShow(admin, id);
  revalidateAdminAppointment(id);
}

export async function resendConfirmationAction(formData: FormData) {
  assertAdminFeatureEnabled();
  const admin = await requireAdmin();
  const id = getAppointmentId(formData);

  await resendAppointmentConfirmation(admin, id);
  revalidateAdminAppointment(id);
}

export async function resendAgreementAction(formData: FormData) {
  assertAdminFeatureEnabled();
  const admin = await requireAdmin();
  const id = getAppointmentId(formData);

  await resendAgreementEmail(admin, id);
  revalidateAdminAppointment(id);
}
