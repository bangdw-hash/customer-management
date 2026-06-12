import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// DATABASE_URL 이 설정되면 실제 Postgres 사용, 없으면 null → 호출부에서 목업 폴백.
// (지금 배포 링크는 DATABASE_URL 미설정 → 데모 데이터로 동작)
const url = process.env.DATABASE_URL;
export const hasDb = !!url;

type DB = ReturnType<typeof drizzle<typeof schema>>;
let _db: DB | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export function getDb(): DB | null {
  if (!url) return null;
  if (!_db) {
    _client = postgres(url, { prepare: false, max: 1 });
    _db = drizzle(_client, { schema });
  }
  return _db;
}

export { schema };
