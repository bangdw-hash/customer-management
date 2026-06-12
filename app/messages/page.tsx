"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Avatar, Badge, Card, SectionTitle } from "@/components/ui";
import { clientById, getMessageJobs } from "@/lib/mock";
import { useNow } from "@/lib/useNow";
import { Cake, CalendarClock, Gift, HeartHandshake, MessageCircle, TrendingUp } from "lucide-react";

const typeMeta: Record<string, { label: string; tone: string; icon: any }> = {
  report: { label: "리포트", tone: "brand", icon: MessageCircle },
  reminder: { label: "예약 알림", tone: "sky", icon: CalendarClock },
  birthday: { label: "생일", tone: "rose", icon: Cake },
  reengage: { label: "재참여 유도", tone: "amber", icon: TrendingUp },
  care: { label: "케어", tone: "violet", icon: HeartHandshake },
};

const triggers = [
  { key: "birthday", label: "생일 자동 축하 메시지", icon: Cake, on: true },
  { key: "anniv", label: "등록 기념일 축하", icon: Gift, on: true },
  { key: "reminder", label: "예약 24h/2h 전 리마인드", icon: CalendarClock, on: true },
  { key: "reengage", label: "14일 미방문 시 케어 메시지", icon: HeartHandshake, on: true },
  { key: "reenroll", label: "잔여 3회 이하 재등록 제안", icon: TrendingUp, on: false },
];

export default function MessagesPage() {
  const now = useNow();
  const messageJobs = now ? getMessageJobs(now) : [];
  const [trg, setTrg] = useState(() => Object.fromEntries(triggers.map((t) => [t.key, t.on])));

  return (
    <AppShell title="메시지" subtitle="자동 발송 · 휴먼터치 · 카카오 연동">
      {/* 채널 상태 */}
      <Card className="mt-3 flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-lg">💬</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink-900">카카오 비즈메시지 연결됨</p>
          <p className="text-[11px] text-ink-400">알림톡(정보성) · 브랜드 메시지(마케팅) · SMS 백업</p>
        </div>
        <Badge tone="brand">활성</Badge>
      </Card>
      <p className="mt-1 px-1 text-[11px] text-ink-400">
        ※ 2026년 정책: 친구톡 종료 → 정보성은 알림톡, 마케팅성은 브랜드 메시지로 분리 발송
      </p>

      {/* 휴먼터치 자동화 트리거 */}
      <SectionTitle title="휴먼 터치 자동화" action="감동 = 재등록" />
      <Card className="divide-y divide-ink-100">
        {triggers.map((t) => (
          <div key={t.key} className="flex items-center gap-3 p-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-50">
              <t.icon size={18} className="text-ink-600" />
            </span>
            <p className="flex-1 text-sm font-medium text-ink-800">{t.label}</p>
            <button
              onClick={() => setTrg((s) => ({ ...s, [t.key]: !s[t.key] }))}
              className={`h-6 w-11 rounded-full p-0.5 transition ${trg[t.key] ? "bg-brand-500" : "bg-ink-200"}`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${trg[t.key] ? "translate-x-5" : ""}`} />
            </button>
          </div>
        ))}
      </Card>
      <p className="mt-1 px-1 text-[11px] text-ink-400">
        자동 메시지는 발송 전 “검수 모드”로 초안 확인 후 보낼 수 있어요 (기계적 느낌 방지).
      </p>

      {/* 예약된 메시지 */}
      <SectionTitle title="예약된 메시지" action={`${messageJobs.filter((m) => m.status === "scheduled").length}건 대기`} />
      <div className="space-y-2.5">
        {messageJobs.map((m) => {
          const c = clientById(m.clientId);
          const meta = typeMeta[m.type];
          return (
            <Card key={m.id} className="p-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={m.clientName} gradient={c?.grad} color="#94a3b8" size={36} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink-900">{m.clientName}</p>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                  <p className="text-[11px] text-ink-400">{m.scheduledAt} · 카카오</p>
                </div>
                <Badge tone={m.status === "sent" ? "slate" : "brand"}>
                  {m.status === "sent" ? "발송완료" : "예약됨"}
                </Badge>
              </div>
              <p className="mt-2 rounded-xl bg-ink-50 p-2.5 text-xs text-ink-600">{m.preview}</p>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
