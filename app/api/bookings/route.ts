import { listBookings, createBooking } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const bookings = await listBookings();
  return Response.json({ bookings });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b?.clientName || !b?.date || !b?.start) {
    return Response.json({ error: "clientName, date, start are required" }, { status: 400 });
  }
  const booking = await createBooking({
    clientId: b.clientId,
    clientName: b.clientName,
    date: b.date,
    start: b.start,
    end: b.end ?? b.start,
    status: b.status ?? "confirmed",
  });
  return Response.json({ booking }, { status: 201 });
}
