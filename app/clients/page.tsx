"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Avatar, Badge, Card } from "@/components/ui";
import { clients, ClientStatus } from "@/lib/mock";
import { Search, UserPlus } from "lucide-react";

const tabs: { key: ClientStatus | "all"; label: string }[] = [
  { key: "active", label: "현재 관리" },
  { key: "at-risk", label: "이탈 위험" },
  { key: "past", label: "예전 고객" },
  { key: "all", label: "전체" },
];

const statusBadge: Record<ClientStatus, { tone: string; label: string }> = {
  active: { tone: "brand", label: "관리중" },
  "at-risk": { tone: "amber", label: "이탈위험" },
  past: { tone: "slate", label: "종료" },
};

export default function ClientsPage() {
  const [tab, setTab] = useState<ClientStatus | "all">("active");
  const [q, setQ] = useState("");

  const list = clients
    .filter((c) => (tab === "all" ? true : c.status === tab))
    .filter((c) => c.name.includes(q) || c.phone.includes(q));

  return (
    <AppShell title="고객 현황" subtitle={`총 ${clients.length}명 관리 중`}>
      <Link
        href="/clients/new"
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white"
      >
        <UserPlus size={18} /> 고객 등록 (QR · 링크 · 직접입력)
      </Link>

      {/* 검색 */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2.5">
        <Search size={18} className="text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="이름 또는 연락처 검색"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* 세그먼트 탭 */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              tab === t.key ? "bg-ink-900 text-white" : "bg-white text-ink-500 shadow-card"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2.5">
        {list.map((c) => {
          const sb = statusBadge[c.status];
          return (
            <Link key={c.id} href={`/clients/${c.id}`}>
              <Card className="flex items-center gap-3 p-3.5">
                <Avatar name={c.name} color={c.avatarColor} size={44} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink-900">{c.name}</p>
                    <Badge tone={sb.tone}>{sb.label}</Badge>
                  </div>
                  <p className="text-xs text-ink-400">{c.goal}</p>
                  <p className="mt-0.5 text-[11px] text-ink-400">
                    잔여 {c.remainingSessions}/{c.totalSessions}회 · 최근 {c.lastVisit}
                  </p>
                </div>
                {c.remainingSessions <= 3 && c.status === "active" && (
                  <Badge tone="rose">재등록 임박</Badge>
                )}
              </Card>
            </Link>
          );
        })}
        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">해당 고객이 없습니다.</p>
        )}
      </div>
    </AppShell>
  );
}
