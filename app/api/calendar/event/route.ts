import { createCalendarEvent } from "@/lib/calendar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b?.title || !b?.date || !b?.start) {
    return Response.json({ error: "title, date, start are required" }, { status: 400 });
  }
  const result = await createCalendarEvent({
    title: b.title,
    date: b.date,
    start: b.start,
    end: b.end ?? b.start,
    location: b.location,
    description: b.description,
  });
  return Response.json(result);
}
