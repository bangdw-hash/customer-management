import { getDb, hasDb, schema } from "@/db";
import {
  clients as mockClients,
  reports as mockReports,
  payments as mockPayments,
  reviews as mockReviews,
  trainer,
  getBookings,
} from "@/lib/mock";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// DB 초기 데이터 주입. 운영에서 1회 호출:
//   curl -X POST "https://<도메인>/api/seed?token=<SEED_TOKEN>"
export async function POST(req: Request) {
  if (!hasDb) {
    return Response.json({ error: "DATABASE_URL 미설정 (현재 데모 모드)" }, { status: 400 });
  }
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const db = getDb()!;

  await db
    .insert(schema.trainers)
    .values({ id: "t_default", name: trainer.name, honorific: trainer.honorific, studio: trainer.studio, slug: trainer.slug })
    .onConflictDoNothing();

  for (const c of mockClients) {
    await db
      .insert(schema.clients)
      .values({
        id: c.id,
        trainerId: "t_default",
        name: c.name,
        phone: c.phone,
        gradFrom: c.grad[0],
        gradTo: c.grad[1],
        goal: c.goal,
        status: c.status,
        joinedAt: c.joinedAt,
        birthday: c.birthday,
        anniversary: c.anniversary,
        remainingSessions: c.remainingSessions,
        totalSessions: c.totalSessions,
        lastVisit: c.lastVisit,
        note: c.note,
      })
      .onConflictDoNothing();
    for (const m of c.measurements) {
      await db
        .insert(schema.measurements)
        .values({ id: `${c.id}_${m.date}`, clientId: c.id, date: m.date, weight: m.weight, bodyFat: m.bodyFat, muscle: m.muscle })
        .onConflictDoNothing();
    }
  }

  for (const b of getBookings(new Date())) {
    await db
      .insert(schema.bookings)
      .values({ id: b.id, trainerId: "t_default", clientId: b.clientId, clientName: b.clientName, date: b.date, start: b.start, endTime: b.end, status: b.status })
      .onConflictDoNothing();
  }

  for (const r of mockReports) {
    await db
      .insert(schema.reports)
      .values({ id: r.id, clientId: r.clientId, date: r.date, title: r.title, body: r.body, status: r.status, channel: r.channel })
      .onConflictDoNothing();
  }

  for (const p of mockPayments) {
    await db
      .insert(schema.payments)
      .values({ id: p.id, clientId: p.clientId, date: p.date, amount: p.amount, method: p.method, item: p.item, sessionsAdded: p.sessionsAdded, confirmedByClient: p.confirmedByClient })
      .onConflictDoNothing();
  }

  for (const rv of mockReviews) {
    await db
      .insert(schema.reviews)
      .values({ id: rv.id, clientId: rv.clientId, rating: rv.rating, text: rv.text, date: rv.date, consentMarketing: rv.consentMarketing, beforeAfter: rv.beforeAfter ?? false })
      .onConflictDoNothing();
  }

  return Response.json({ ok: true, seeded: { clients: mockClients.length, payments: mockPayments.length, reviews: mockReviews.length } });
}
