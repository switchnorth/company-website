import { bookingAvailability, consultationTypes } from "../../data/booking";
import type {
  AppointmentRecord,
  AvailabilitySlot,
  BookingAvailabilityConfig,
  ConsultationType,
} from "../../types/booking";

const activeStatuses = new Set(["PENDING_PAYMENT", "CONFIRMED"]);

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

function timeFromMinutes(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

function dateOrdinal(dateKey: string) {
  return Math.floor(new Date(`${dateKey}T00:00:00Z`).getTime() / 86_400_000);
}

function getZonedParts(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(now);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

function formatSlotLabel(startTime: string, endTime: string) {
  return `${startTime} - ${endTime}`;
}

function overlaps(
  startMinutes: number,
  endMinutes: number,
  busyStart: string,
  busyEnd: string,
) {
  return startMinutes < minutesFromTime(busyEnd) && endMinutes > minutesFromTime(busyStart);
}

export function getConsultationType(typeId: string) {
  return consultationTypes.find((type) => type.id === typeId);
}

export function isUnavailableDate(
  date: string,
  config: BookingAvailabilityConfig = bookingAvailability,
) {
  return config.unavailableDates.some((item) => item.date === date);
}

export function isSlotAvailable({
  appointments,
  config = bookingAvailability,
  consultationType,
  date,
  now = new Date(),
  startTime,
}: {
  appointments: AppointmentRecord[];
  config?: BookingAvailabilityConfig;
  consultationType: ConsultationType;
  date: string;
  now?: Date;
  startTime: string;
}) {
  if (isUnavailableDate(date, config)) {
    return false;
  }

  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const windows = config.businessHours[weekday] ?? [];
  const startMinutes = minutesFromTime(startTime);
  const endMinutes = startMinutes + consultationType.durationMinutes;
  const nowParts = getZonedParts(now, config.timeZone);
  const noticeMinutes =
    (dateOrdinal(date) - dateOrdinal(nowParts.date)) * 1440 +
    startMinutes -
    nowParts.minutes;

  if (noticeMinutes < config.minimumNoticeHours * 60) {
    return false;
  }

  const fitsBusinessHours = windows.some(
    (window) =>
      startMinutes >= minutesFromTime(window.start) &&
      endMinutes <= minutesFromTime(window.end),
  );

  if (!fitsBusinessHours) {
    return false;
  }

  const blocked = config.blockedTimes.some(
    (blockedTime) =>
      blockedTime.date === date &&
      overlaps(startMinutes, endMinutes, blockedTime.start, blockedTime.end),
  );

  if (blocked) {
    return false;
  }

  return !appointments.some(
    (appointment) =>
      appointment.date === date &&
      activeStatuses.has(appointment.status) &&
      overlaps(
        startMinutes,
        endMinutes,
        appointment.startTime,
        appointment.endTime,
      ),
  );
}

export function getAvailableSlots({
  appointments,
  config = bookingAvailability,
  consultationType,
  now = new Date(),
}: {
  appointments: AppointmentRecord[];
  config?: BookingAvailabilityConfig;
  consultationType: ConsultationType;
  now?: Date;
}) {
  const slots: AvailabilitySlot[] = [];
  const today = getZonedParts(now, config.timeZone).date;

  for (let dayOffset = 0; dayOffset <= config.bookingHorizonDays; dayOffset += 1) {
    const date = addDays(today, dayOffset);
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    const windows = config.businessHours[weekday] ?? [];

    for (const window of windows) {
      const firstSlot = minutesFromTime(window.start);
      const lastStart = minutesFromTime(window.end) - consultationType.durationMinutes;

      for (
        let startMinutes = firstSlot;
        startMinutes <= lastStart;
        startMinutes += config.slotIntervalMinutes
      ) {
        const startTime = timeFromMinutes(startMinutes);
        const endTime = timeFromMinutes(
          startMinutes + consultationType.durationMinutes,
        );

        if (
          isSlotAvailable({
            appointments,
            config,
            consultationType,
            date,
            now,
            startTime,
          })
        ) {
          slots.push({
            date,
            startTime,
            endTime,
            timeZone: config.timeZone,
            label: formatSlotLabel(startTime, endTime),
          });
        }
      }
    }
  }

  return slots;
}
