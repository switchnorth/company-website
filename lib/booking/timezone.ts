function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const zonedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return zonedAsUtc - date.getTime();
}

export function zonedDateTimeToUtc({
  date,
  time,
  timeZone,
}: {
  date: string;
  time: string;
  timeZone: string;
}) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let instant = new Date(localAsUtc);

  for (let index = 0; index < 3; index += 1) {
    instant = new Date(localAsUtc - getTimeZoneOffsetMs(instant, timeZone));
  }

  return instant;
}

export function addMinutesToTime(time: string, durationMinutes: number) {
  const [hours, minutes] = time.split(":").map(Number);
  const total = hours * 60 + minutes + durationMinutes;

  return `${Math.floor(total / 60)
    .toString()
    .padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}`;
}

export function appointmentStartInstant({
  date,
  startTime,
  timeZone,
}: {
  date: string;
  startTime: string;
  timeZone: string;
}) {
  return zonedDateTimeToUtc({
    date,
    time: startTime,
    timeZone,
  });
}
