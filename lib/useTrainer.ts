"use client";

import { useEffect, useState } from "react";
import { trainer as fallback } from "@/lib/mock";

export type TrainerProfile = { name: string; honorific: string; studio: string; slug: string };

// 저장된 트레이너 프로필을 불러옴(DB 연결 시 실값, 아니면 기본값).
export function useTrainer(): TrainerProfile {
  const [t, setT] = useState<TrainerProfile>({
    name: fallback.name,
    honorific: fallback.honorific,
    studio: fallback.studio,
    slug: fallback.slug,
  });
  useEffect(() => {
    fetch("/api/trainer")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.trainer && setT(d.trainer))
      .catch(() => {});
  }, []);
  return t;
}
