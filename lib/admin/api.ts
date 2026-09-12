import { listAdminAppointmentRows } from "./service";
import type { AdminIdentity } from "../../types/admin";
import type { AppointmentStatus, PaymentStatus } from "../../types/booking";

export async function getAdminAppointmentsApiResponse(
  admin: AdminIdentity | null,
  url: string,
) {
  if (!admin) {
    return {
      body: { error: "Unauthorized" },
      status: 401,
    };
  }

  const requestUrl = new URL(url);
  const rows = await listAdminAppointmentRows(admin, {
    date: requestUrl.searchParams.get("date") ?? undefined,
    paymentStatus:
      (requestUrl.searchParams.get("paymentStatus") as PaymentStatus | "all" | null) ??
      undefined,
    search: requestUrl.searchParams.get("search") ?? undefined,
    status:
      (requestUrl.searchParams.get("status") as AppointmentStatus | "all" | null) ??
      undefined,
  });

  return {
    body: {
      appointments: rows.map((row) => ({
        agreementStatus: row.agreementStatus,
        appointment: {
          client: {
            email: row.appointment.client.email,
            fullName: row.appointment.client.fullName,
            phone: row.appointment.client.phone,
          },
          date: row.appointment.date,
          endTime: row.appointment.endTime,
          id: row.appointment.id,
          paymentStatus: row.appointment.paymentStatus,
          startTime: row.appointment.startTime,
          status: row.appointment.status,
          timeZone: row.appointment.timeZone,
        },
        calendarStatus: row.calendarStatus,
        consultationTitle: row.consultationTitle,
      })),
    },
    status: 200,
  };
}
