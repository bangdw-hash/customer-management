import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

// 단일 트레이너 MVP 스키마 (멀티 트레이너 확장 대비 trainerId 보유)
export const trainers = pgTable("trainers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  honorific: text("honorific").notNull().default("프로"),
  studio: text("studio"),
  slug: text("slug").notNull(),
  // 인증용(선택): 비밀번호 해시
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  trainerId: text("trainer_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  gradFrom: text("grad_from").notNull().default("#a855f7"),
  gradTo: text("grad_to").notNull().default("#ec4899"),
  photoUrl: text("photo_url"),
  goal: text("goal"),
  status: text("status").notNull().default("active"), // active | at-risk | past
  joinedAt: text("joined_at"),
  birthday: text("birthday"),
  anniversary: text("anniversary"),
  remainingSessions: integer("remaining_sessions").notNull().default(0),
  totalSessions: integer("total_sessions").notNull().default(0),
  lastVisit: text("last_visit"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const measurements = pgTable("measurements", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  date: text("date").notNull(),
  weight: doublePrecision("weight"),
  bodyFat: doublePrecision("body_fat"),
  muscle: doublePrecision("muscle"),
});

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  trainerId: text("trainer_id").notNull(),
  clientId: text("client_id"),
  clientName: text("client_name").notNull(),
  date: text("date").notNull(),
  start: text("start").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed|requested|done|no-show
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("draft"), // draft|scheduled|sent
  channel: text("channel"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  date: text("date").notNull(),
  amount: integer("amount").notNull(),
  method: text("method").notNull(),
  item: text("item"),
  sessionsAdded: integer("sessions_added").notNull().default(0),
  confirmedByClient: boolean("confirmed_by_client").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  clientId: text("client_id"),
  rating: integer("rating").notNull(),
  text: text("text"),
  date: text("date").notNull(),
  consentMarketing: boolean("consent_marketing").notNull().default(false),
  beforeAfter: boolean("before_after").notNull().default(false),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("default"),
  trainerId: text("trainer_id"),
  aiModel: text("ai_model").default("claude-sonnet-4-6"),
  aiPrompt: text("ai_prompt"),
  // API 키는 암호화 저장이 원칙 — 데모 스키마에선 컬럼만 정의
  aiKeyEnc: text("ai_key_enc"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
