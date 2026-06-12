"use client";

import { useEffect, useState } from "react";

// 접속한 사용자의 실제 현재 시각을 반환 (마운트 전엔 null → 서버/클라이언트 hydration 불일치 방지)
// 기본 1분마다 갱신.
export function useNow(intervalMs = 60000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
