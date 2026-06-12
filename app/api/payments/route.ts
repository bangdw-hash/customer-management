import { listPayments, recordPayment } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const payments = await listPayments();
  return Response.json({ payments });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b?.clientId || !b?.amount) {
    return Response.json({ error: "clientId and amount are required" }, { status: 400 });
  }
  const payment = await recordPayment({
    clientId: b.clientId,
    date: b.date ?? new Date().toISOString().slice(0, 10),
    amount: Number(b.amount),
    method: b.method ?? "현장카드",
    item: b.item ?? "",
    sessionsAdded: Number(b.sessionsAdded ?? 0),
  });
  return Response.json({ payment }, { status: 201 });
}
