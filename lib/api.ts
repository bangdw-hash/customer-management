// 클라이언트 컴포넌트용 간단 API 헬퍼.
// 읽기: DB 연결 시 실데이터, 실패/데모 시 null → 호출부에서 목업 유지.
// 쓰기: 낙관적 UI + 백그라운드 저장(DB 연결 시 영속).

export async function apiGet<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export async function apiPost<T = any>(url: string, body: unknown): Promise<T | null> {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await r.json().catch(() => ({}))) as T;
  } catch {
    return null;
  }
}

export async function apiPut<T = any>(url: string, body: unknown): Promise<T | null> {
  try {
    const r = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await r.json().catch(() => ({}))) as T;
  } catch {
    return null;
  }
}
