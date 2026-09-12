import type { AppointmentRecord, AppointmentStatus, PaymentStatus } from "./booking";

export type AdminIdentity = {
  id: string;
  username: string;
};

export type AgreementStatus =
  | "NOT_GENERATED"
  | "GENERATED"
  | "SENT"
  | "ACCEPTED"
  | "SIGNED";

export type CalendarStatus =
  | "NOT_CONNECTED"
  | "NOT_CREATED"
  | "CREATED"
  | "FAILED"
  | "PENDING"
  | "SYNCED";

export type AuditAction =
  | "APPOINTMENT_CONFIRMED"
  | "APPOINTMENT_CANCELLED"
  | "APPOINTMENT_COMPLETED"
  | "APPOINTMENT_NO_SHOW"
  | "APPOINTMENT_RESCHEDULED_CLIENT"
  | "APPOINTMENT_RESCHEDULED_ADMIN"
  | "APPOINTMENT_CANCELLED_CLIENT"
  | "APPOINTMENT_CANCELLED_ADMIN"
  | "CALENDAR_SYNC_FAILED"
  | "CONFIRMATION_RESENT"
  | "AGREEMENT_RESENT"
  | "AGREEMENT_REGENERATED"
  | "MANAGEMENT_LINK_SENT"
  | "PAYMENT_REFUND_RECORDED"
  | "REMINDER_SENT"
  | "REMINDER_FAILED";

export type AuditEntry = {
  action: AuditAction;
  adminId: string;
  entity: "appointment" | "payment" | "agreement";
  entityId: string;
  timestamp: string;
};

export type AdminAppointmentFilters = {
  date?: string;
  paymentStatus?: PaymentStatus | "all";
  search?: string;
  status?: AppointmentStatus | "all";
};

export type AdminAppointmentRow = {
  agreementStatus: AgreementStatus;
  appointment: AppointmentRecord;
  calendarStatus: CalendarStatus;
  consultationTitle: string;
};

export type AdminClientSummary = {
  appointmentCount: number;
  email: string;
  id: string;
  lastAppointment?: AppointmentRecord;
  name: string;
  nextAppointment?: AppointmentRecord;
  phone: string;
};

export type AdminDashboardSummary = {
  agreementsNotSent: number;
  appointmentsThisWeek: number;
  appointmentsToday: number;
  cancelledAppointments: AdminAppointmentRow[];
  confirmedAppointments: AdminAppointmentRow[];
  pendingPayments: AdminAppointmentRow[];
  recentPayments: AdminAppointmentRow[];
  todayAppointments: AdminAppointmentRow[];
  upcomingAppointments: AdminAppointmentRow[];
};
