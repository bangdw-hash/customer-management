import { deleteClient } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!params?.id) return Response.json({ error: "id required" }, { status: 400 });
  await deleteClient(params.id);
  return Response.json({ ok: true });
}
