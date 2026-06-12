import { sendMessage } from "@/lib/kakao";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b?.to || !b?.text) {
    return Response.json({ error: "to and text are required" }, { status: 400 });
  }
  const result = await sendMessage({
    to: b.to,
    channel: b.channel,
    text: b.text,
    templateId: b.templateId,
    variables: b.variables,
  });
  return Response.json(result);
}
