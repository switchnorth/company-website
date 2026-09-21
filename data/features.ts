function readFeatureFlag(value: string | undefined, defaultValue = false) {
  if (!value) {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

// V1 PUBLIC WEBSITE CONFIGURATION:
// Future booking/payment/admin/agreement systems are preserved in the codebase,
// but disabled by default so the public marketing site can deploy safely.
export const featureFlags = {
  adminPortal: readFeatureFlag(process.env.FEATURE_ADMIN_PORTAL, false),
  agreementPortal: readFeatureFlag(process.env.FEATURE_AGREEMENT_PORTAL, false),
  appointmentManagement: readFeatureFlag(
    process.env.FEATURE_APPOINTMENT_MANAGEMENT,
    false,
  ),
  appointments: readFeatureFlag(
    process.env.FEATURE_APPOINTMENTS ?? process.env.NEXT_PUBLIC_FEATURE_APPOINTMENTS,
    false,
  ),
  payments: readFeatureFlag(process.env.FEATURE_PAYMENTS, false),
};

export function getConsultationCtaHref() {
  return featureFlags.appointments ? "/consultation" : "/contact";
}
