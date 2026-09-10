const INDIA_TIME_ZONE = "Asia/Kolkata";

function toDateKey(value, timeZone = INDIA_TIME_ZONE) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(value));
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function getEventStatus(eventDate, now = new Date()) {
  if (!eventDate) return "";
  return toDateKey(eventDate) >= toDateKey(now) ? "upcoming" : "past";
}

module.exports = { getEventStatus, toDateKey };
