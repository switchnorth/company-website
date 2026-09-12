import type { AppointmentRecord } from "../../types/booking";

export type CalendarOperationResult = {
  eventId?: string;
  eventUrl?: string;
  message?: string;
  status: "FAILED" | "PENDING" | "SYNCED";
};

export type CalendarAdapter = {
  cancelAppointment(appointment: AppointmentRecord): Promise<CalendarOperationResult>;
  updateAppointment(appointment: AppointmentRecord): Promise<CalendarOperationResult>;
};

function isGoogleCalendarConfigured() {
  return Boolean(process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
}

export const googleCalendarAdapter: CalendarAdapter = {
  async cancelAppointment(appointment) {
    if (!isGoogleCalendarConfigured()) {
      return {
        eventId: appointment.calendarEventId,
        eventUrl: appointment.calendarEventUrl,
        message: "Google Calendar is not configured.",
        status: "PENDING",
      };
    }

    return {
      eventId: appointment.calendarEventId,
      eventUrl: appointment.calendarEventUrl,
      message:
        "Google Calendar credentials are configured; provider API wiring should update/delete the event here.",
      status: "PENDING",
    };
  },
  async updateAppointment(appointment) {
    if (!isGoogleCalendarConfigured()) {
      return {
        eventId: appointment.calendarEventId,
        eventUrl: appointment.calendarEventUrl,
        message: "Google Calendar is not configured.",
        status: "PENDING",
      };
    }

    return {
      eventId: appointment.calendarEventId,
      eventUrl: appointment.calendarEventUrl,
      message:
        "Google Calendar credentials are configured; provider API wiring should update the existing event here.",
      status: "PENDING",
    };
  },
};
