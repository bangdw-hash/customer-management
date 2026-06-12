// 데이터 접근 계층: DATABASE_URL 이 있으면 Postgres, 없으면 목업으로 폴백.
// API 라우트/서버에서 사용. (현재 배포는 목업 폴백으로 동작)
import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import {
  clients as mockClients,
  payments as mockPayments,
  reviews as mockReviews,
  reports as mockReports,
  getBookings,
  type Client,
  type Payment,
  type Review,
  type Report,
  type Booking,
} from "@/lib/mock";

function rowToClient(r: typeof schema.clients.$inferSelect): Client {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone ?? "",
    avatarColor: r.gradFrom,
    grad: [r.gradFrom, r.gradTo],
    goal: r.goal ?? "",
    status: (r.status as Client["status"]) ?? "active",
    joinedAt: r.joinedAt ?? "",
    birthday: r.birthday ?? undefined,
    anniversary: r.anniversary ?? undefined,
    remainingSessions: r.remainingSessions,
    totalSessions: r.totalSessions,
    lastVisit: r.lastVisit ?? "",
    note: r.note ?? undefined,
    measurements: [],
  };
}

export async function listClients(): Promise<Client[]> {
  const db = getDb();
  if (!db) return mockClients;
  const rows = await db.select().from(schema.clients);
  return rows.map(rowToClient);
}

export async function getClient(id: string): Promise<Client | undefined> {
  const db = getDb();
  if (!db) return mockClients.find((c) => c.id === id);
  const rows = await db.select().from(schema.clients).where(eq(schema.clients.id, id));
  return rows[0] ? rowToClient(rows[0]) : undefined;
}

export async function createClient(input: Partial<Client> & { name: string }): Promise<Client> {
  const db = getDb();
  const id = "c_" + Math.random().toString(36).slice(2, 9);
  const grad = input.grad ?? ["#a855f7", "#ec4899"];
  if (!db) {
    const c: Client = {
      id,
      name: input.name,
      phone: input.phone ?? "",
      avatarColor: grad[0],
      grad,
      goal: input.goal ?? "",
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      remainingSessions: 0,
      totalSessions: 0,
      lastVisit: new Date().toISOString().slice(0, 10),
      measurements: [],
    };
    mockClients.push(c);
    return c;
  }
  await db.insert(schema.clients).values({
    id,
    trainerId: "t_default",
    name: input.name,
    phone: input.phone,
    gradFrom: grad[0],
    gradTo: grad[1],
    goal: input.goal,
    status: "active",
    joinedAt: new Date().toISOString().slice(0, 10),
    remainingSessions: 0,
    totalSessions: 0,
    lastVisit: new Date().toISOString().slice(0, 10),
  });
  return (await getClient(id))!;
}

export async function listPayments(): Promise<Payment[]> {
  const db = getDb();
  if (!db) return mockPayments;
  const rows = await db.select().from(schema.payments);
  return rows.map((r) => ({
    id: r.id,
    clientId: r.clientId,
    date: r.date,
    amount: r.amount,
    method: r.method as Payment["method"],
    item: r.item ?? "",
    sessionsAdded: r.sessionsAdded,
    confirmedByClient: r.confirmedByClient,
  }));
}

export async function recordPayment(input: Omit<Payment, "id" | "confirmedByClient">): Promise<Payment> {
  const db = getDb();
  const id = "p_" + Math.random().toString(36).slice(2, 9);
  const p: Payment = { id, confirmedByClient: false, ...input };
  if (!db) {
    mockPayments.push(p);
    return p;
  }
  await db.insert(schema.payments).values({
    id,
    clientId: input.clientId,
    date: input.date,
    amount: input.amount,
    method: input.method,
    item: input.item,
    sessionsAdded: input.sessionsAdded,
    confirmedByClient: false,
  });
  return p;
}

export async function confirmPayment(id: string): Promise<void> {
  const db = getDb();
  if (!db) {
    const p = mockPayments.find((x) => x.id === id);
    if (p) p.confirmedByClient = true;
    return;
  }
  await db
    .update(schema.payments)
    .set({ confirmedByClient: true })
    .where(eq(schema.payments.id, id));
}

export async function listReviews(): Promise<Review[]> {
  const db = getDb();
  if (!db) return mockReviews;
  const rows = await db.select().from(schema.reviews);
  return rows.map((r) => ({
    id: r.id,
    clientId: r.clientId ?? "",
    rating: r.rating,
    text: r.text ?? "",
    date: r.date,
    consentMarketing: r.consentMarketing,
    beforeAfter: r.beforeAfter,
  }));
}

export async function addReview(input: Omit<Review, "id">): Promise<Review> {
  const db = getDb();
  const id = "rv_" + Math.random().toString(36).slice(2, 9);
  const rv: Review = { id, ...input };
  if (!db) {
    mockReviews.push(rv);
    return rv;
  }
  await db.insert(schema.reviews).values({
    id,
    clientId: input.clientId || null,
    rating: input.rating,
    text: input.text,
    date: input.date,
    consentMarketing: input.consentMarketing,
    beforeAfter: input.beforeAfter ?? false,
  });
  return rv;
}

// ===== 예약 =====
export async function listBookings(): Promise<Booking[]> {
  const db = getDb();
  if (!db) return getBookings(new Date());
  const rows = await db.select().from(schema.bookings);
  return rows.map((r) => ({
    id: r.id,
    clientId: r.clientId ?? undefined,
    clientName: r.clientName,
    date: r.date,
    start: r.start,
    end: r.endTime,
    status: r.status as Booking["status"],
  }));
}

export async function createBooking(input: Omit<Booking, "id">): Promise<Booking> {
  const db = getDb();
  const id = "b_" + Math.random().toString(36).slice(2, 9);
  const b: Booking = { id, ...input };
  if (!db) return b;
  await db.insert(schema.bookings).values({
    id,
    trainerId: "t_default",
    clientId: input.clientId ?? null,
    clientName: input.clientName,
    date: input.date,
    start: input.start,
    endTime: input.end,
    status: input.status,
  });
  return b;
}

// ===== 리포트 =====
export async function listReports(): Promise<Report[]> {
  const db = getDb();
  if (!db) return mockReports;
  const rows = await db.select().from(schema.reports);
  return rows.map((r) => ({
    id: r.id,
    clientId: r.clientId,
    date: r.date,
    title: r.title,
    body: r.body,
    status: r.status as Report["status"],
    channel: (r.channel as Report["channel"]) ?? undefined,
  }));
}

export async function addReport(input: Omit<Report, "id">): Promise<Report> {
  const db = getDb();
  const id = "r_" + Math.random().toString(36).slice(2, 9);
  const r: Report = { id, ...input };
  if (!db) {
    mockReports.push(r);
    return r;
  }
  await db.insert(schema.reports).values({
    id,
    clientId: input.clientId,
    date: input.date,
    title: input.title,
    body: input.body,
    status: input.status,
    channel: input.channel,
  });
  return r;
}

// ===== 삭제 / 초기화 =====
export async function deleteClient(id: string): Promise<void> {
  const db = getDb();
  if (!db) {
    const ci = mockClients.findIndex((c) => c.id === id);
    if (ci >= 0) mockClients.splice(ci, 1);
    for (let i = mockPayments.length - 1; i >= 0; i--) if (mockPayments[i].clientId === id) mockPayments.splice(i, 1);
    for (let i = mockReviews.length - 1; i >= 0; i--) if (mockReviews[i].clientId === id) mockReviews.splice(i, 1);
    for (let i = mockReports.length - 1; i >= 0; i--) if (mockReports[i].clientId === id) mockReports.splice(i, 1);
    return;
  }
  await db.delete(schema.measurements).where(eq(schema.measurements.clientId, id));
  await db.delete(schema.reports).where(eq(schema.reports.clientId, id));
  await db.delete(schema.payments).where(eq(schema.payments.clientId, id));
  await db.delete(schema.reviews).where(eq(schema.reviews.clientId, id));
  await db.delete(schema.bookings).where(eq(schema.bookings.clientId, id));
  await db.delete(schema.clients).where(eq(schema.clients.id, id));
}

// 모든 고객/관련 데이터 비우기 (트레이너·설정은 유지)
export async function resetData(): Promise<void> {
  const db = getDb();
  if (!db) {
    mockClients.length = 0;
    mockPayments.length = 0;
    mockReviews.length = 0;
    mockReports.length = 0;
    return;
  }
  await db.delete(schema.measurements);
  await db.delete(schema.bookings);
  await db.delete(schema.reports);
  await db.delete(schema.payments);
  await db.delete(schema.reviews);
  await db.delete(schema.clients);
}
