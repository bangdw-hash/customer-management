import postgres from "postgres";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// 터미널 없이 테이블 생성: POST /api/migrate?token=<SEED_TOKEN>
const DDL = `
CREATE TABLE IF NOT EXISTS trainers (
  id text PRIMARY KEY,
  name text NOT NULL,
  honorific text NOT NULL DEFAULT '프로',
  studio text,
  slug text NOT NULL,
  password_hash text,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS clients (
  id text PRIMARY KEY,
  trainer_id text NOT NULL,
  name text NOT NULL,
  phone text,
  grad_from text NOT NULL DEFAULT '#a855f7',
  grad_to text NOT NULL DEFAULT '#ec4899',
  photo_url text,
  goal text,
  status text NOT NULL DEFAULT 'active',
  joined_at text,
  birthday text,
  anniversary text,
  remaining_sessions integer NOT NULL DEFAULT 0,
  total_sessions integer NOT NULL DEFAULT 0,
  last_visit text,
  note text,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS measurements (
  id text PRIMARY KEY,
  client_id text NOT NULL,
  date text NOT NULL,
  weight double precision,
  body_fat double precision,
  muscle double precision
);
CREATE TABLE IF NOT EXISTS bookings (
  id text PRIMARY KEY,
  trainer_id text NOT NULL,
  client_id text,
  client_name text NOT NULL,
  date text NOT NULL,
  "start" text NOT NULL,
  end_time text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reports (
  id text PRIMARY KEY,
  client_id text NOT NULL,
  date text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  channel text,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS payments (
  id text PRIMARY KEY,
  client_id text NOT NULL,
  date text NOT NULL,
  amount integer NOT NULL,
  method text NOT NULL,
  item text,
  sessions_added integer NOT NULL DEFAULT 0,
  confirmed_by_client boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
  id text PRIMARY KEY,
  client_id text,
  rating integer NOT NULL,
  text text,
  date text NOT NULL,
  consent_marketing boolean NOT NULL DEFAULT false,
  before_after boolean NOT NULL DEFAULT false,
  photo_url text,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY DEFAULT 'default',
  trainer_id text,
  ai_model text DEFAULT 'claude-sonnet-4-6',
  ai_prompt text,
  ai_key_enc text,
  updated_at timestamptz DEFAULT now()
);
-- 기존 테이블에도 사진 컬럼 추가(있으면 무시)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photo_url text;
`;

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "DATABASE_URL 미설정" }, { status: 400 });
  }
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  try {
    await sql.unsafe(DDL);
    return Response.json({ ok: true, message: "테이블 생성 완료" });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "migrate_error" }, { status: 500 });
  } finally {
    await sql.end({ timeout: 5 });
  }
}
