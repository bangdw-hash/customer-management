import { listClients, createClient } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const clients = await listClients();
  return Response.json({ clients });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body?.name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }
  const client = await createClient(body);
  return Response.json({ client }, { status: 201 });
}
