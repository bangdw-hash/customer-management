// 캘린더 어댑터: 확정 일정을 iCalendar(.ics, RFC5545)로 생성(항상 동작) +
// CALENDAR_WEBHOOK_URL 이 있으면 구글/네이버 캘린더 연동 엔드포인트로 전달.

export interface CalEvent {
  title: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  location?: string;
  description?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function toICSDate(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

// RFC5545 .ics 문자열 생성 (고객/트레이너 모두 "캘린더에 추가" 가능)
export function buildICS(ev: CalEvent): string {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@fitflow`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FitFlow//PT//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toICSDate(ev.date, ev.start)}`,
    `DTEND:${toICSDate(ev.date, ev.end)}`,
    `SUMMARY:${ev.title}`,
    ev.location ? `LOCATION:${ev.location}` : "",
    ev.description ? `DESCRIPTION:${ev.description}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function createCalendarEvent(
  ev: CalEvent
): Promise<{ ok: boolean; simulated: boolean; ics: string; error?: string }> {
  const ics = buildICS(ev);
  const url = process.env.CALENDAR_WEBHOOK_URL;
  if (!url) return { ok: true, simulated: true, ics };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: ev, ics }),
    });
    return { ok: res.ok, simulated: false, ics, error: res.ok ? undefined : `status ${res.status}` };
  } catch (e) {
    return { ok: false, simulated: false, ics, error: e instanceof Error ? e.message : "calendar_error" };
  }
}
