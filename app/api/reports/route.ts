import { listReports, addReport } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const reports = await listReports();
  return Response.json({ reports });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b?.clientId || !b?.body) {
    return Response.json({ error: "clientId and body are required" }, { status: 400 });
  }
  const report = await addReport({
    clientId: b.clientId,
    date: b.date ?? new Date().toISOString().slice(0, 10),
    title: b.title ?? "PT 리포트",
    body: b.body,
    status: b.status ?? "sent",
    channel: b.channel ?? "kakao",
  });
  return Response.json({ report }, { status: 201 });
}
