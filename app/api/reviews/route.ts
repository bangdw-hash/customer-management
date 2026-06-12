import { listReviews, addReview } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const reviews = await listReviews();
  return Response.json({ reviews });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b?.rating) {
    return Response.json({ error: "rating is required" }, { status: 400 });
  }
  const review = await addReview({
    clientId: b.clientId ?? "",
    rating: Number(b.rating),
    text: b.text ?? "",
    date: b.date ?? new Date().toISOString().slice(0, 10),
    consentMarketing: !!b.consentMarketing,
    beforeAfter: !!b.beforeAfter,
  });
  return Response.json({ review }, { status: 201 });
}
