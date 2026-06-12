import { getTrainer, updateTrainer } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const trainer = await getTrainer();
  return Response.json({ trainer });
}

export async function PUT(req: Request) {
  const b = await req.json().catch(() => ({}));
  const trainer = await updateTrainer({
    name: b.name,
    honorific: b.honorific,
    studio: b.studio,
  });
  return Response.json({ trainer });
}
