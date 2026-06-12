import { resetData } from "@/lib/repo";
import { hasDb } from "@/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// 고객/관련 데이터 전체 비우기. POST /api/reset?token=<SEED_TOKEN>
export async function POST(req: Request) {
  if (!hasDb) return Response.json({ error: "DATABASE_URL 미설정" }, { status: 400 });
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  await resetData();
  return Response.json({ ok: true, message: "전체 데이터 비움" });
}
