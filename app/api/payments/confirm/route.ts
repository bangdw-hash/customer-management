import { confirmPayment } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// 고객이 결제 내역을 확인(공동 확인)할 때 호출
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b?.id) return Response.json({ error: "id is required" }, { status: 400 });
  await confirmPayment(b.id);
  return Response.json({ ok: true });
}
