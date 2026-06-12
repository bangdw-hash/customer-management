import { hasDb } from "@/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    db: hasDb,
    ai: !!process.env.ANTHROPIC_API_KEY,
    message: !!process.env.MESSAGE_WEBHOOK_URL,
    calendar: !!process.env.CALENDAR_WEBHOOK_URL,
  });
}
