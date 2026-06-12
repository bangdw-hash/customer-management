import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Avatar, Badge, Button, Card, SectionTitle } from "@/components/ui";
import { atRiskClients, bookings, clientById, reEnrollTargets, trainer } from "@/lib/mock";
import { AlertTriangle, CalendarClock, Mic, QrCode, Sparkles, TrendingUp, UserPlus } from "lucide-react";

export default function Dashboard() {
  const today = bookings.filter((b) => b.date === "2026-06-12");
  const targets = reEnrollTargets();
  const atRisk = atRiskClients();

  return (
    <AppShell>
      {/* 헤더 영역 */}
      <div className="rounded-b-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-5 pb-6 pt-8 text-white">
        <p className="text-sm text-brand-100">2026년 6월 12일 금요일</p>
        <h1 className="mt-1 text-2xl font-extrabold">안녕하세요, {trainer.name} 코치님 👋</h1>
        <p className="mt-1 text-sm text-brand-100">{trainer.studio}</p>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/15 py-3">
            <p className="text-xl font-extrabold">{today.length}</p>
            <p className="text-[11px] text-brand-100">오늘 세션</p>
          </div>
          <div className="rounded-2xl bg-white/15 py-3">
            <p className="text-xl font-extrabold">{targets.length}</p>
            <p className="text-[11px] text-brand-100">재등록 대상</p>
          </div>
          <div className="rounded-2xl bg-white/15 py-3">
            <p className="text-xl font-extrabold">{atRisk.length}</p>
            <p className="text-[11px] text-brand-100">이탈 위험</p>
          </div>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="-mt-4 grid grid-cols-4 gap-2 px-1">
        {[
          { href: "/reports/new", label: "음성 리포트", icon: Mic, tone: "bg-brand-50 text-brand-600" },
          { href: "/clients/new", label: "고객 등록", icon: UserPlus, tone: "bg-sky-50 text-sky-600" },
          { href: "/schedule", label: "예약 링크", icon: QrCode, tone: "bg-violet-50 text-violet-600" },
          { href: "/clients", label: "고객 현황", icon: TrendingUp, tone: "bg-amber-50 text-amber-600" },
        ].map((q) => (
          <Link key={q.href} href={q.href} className="flex flex-col items-center gap-1.5">
            <span className={`flex h-14 w-full items-center justify-center rounded-2xl shadow-card ${q.tone}`}>
              <q.icon size={22} />
            </span>
            <span className="text-[11px] font-semibold text-ink-600">{q.label}</span>
          </Link>
        ))}
      </div>

      {/* 오늘 일정 */}
      <SectionTitle title="오늘 일정" action="전체 보기" href="/schedule" />
      <Card className="divide-y divide-ink-100">
        {today.map((b) => {
          const c = b.clientId ? clientById(b.clientId) : undefined;
          return (
            <div key={b.id} className="flex items-center gap-3 p-3.5">
              <div className="w-12 text-center">
                <p className="text-sm font-bold text-ink-900">{b.start}</p>
                <p className="text-[10px] text-ink-400">{b.end}</p>
              </div>
              <div className="h-8 w-px bg-ink-100" />
              <Avatar name={b.clientName} color={c?.avatarColor ?? "#94a3b8"} size={36} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">{b.clientName}</p>
                <p className="text-xs text-ink-400">{c?.goal ?? "신규 예약 요청"}</p>
              </div>
              {b.status === "requested" ? (
                <Badge tone="amber">승인 대기</Badge>
              ) : (
                <Badge tone="brand">확정</Badge>
              )}
            </div>
          );
        })}
      </Card>

      {/* 재등록 유도 — 핵심 가치 */}
      <SectionTitle title="재등록 제안 대상" action="목적: 전환율 ↑" />
      <div className="space-y-2.5">
        {targets.map((c) => (
          <Card key={c.id} className="p-3.5">
            <div className="flex items-center gap-3">
              <Avatar name={c.name} color={c.avatarColor} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-ink-900">{c.name}</p>
                  {c.status === "past" ? (
                    <Badge tone="slate">수료 고객</Badge>
                  ) : (
                    <Badge tone="rose">잔여 {c.remainingSessions}회</Badge>
                  )}
                </div>
                <p className="text-xs text-ink-400">
                  {c.status === "past"
                    ? "지난 시즌 -9kg 성공 · 재등록 제안 적기"
                    : `최근 성과 좋음 · 흐름 유지 권장`}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 p-2.5">
              <Sparkles size={16} className="text-brand-600" />
              <p className="flex-1 text-[11px] font-medium text-brand-800">
                AI 추천 제안: “성과 리포트 + 30회 패키지 10% 할인”
              </p>
              <Link href={`/clients/${c.id}`}>
                <Button className="px-3 py-1.5 text-xs">제안 보내기</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* 이탈 위험 */}
      <SectionTitle title="이탈 위험 감지" action="휴먼터치 케어" />
      <div className="space-y-2.5">
        {atRisk.map((c) => (
          <Link key={c.id} href={`/clients/${c.id}`}>
            <Card className="flex items-center gap-3 border border-amber-100 p-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
                <AlertTriangle size={18} className="text-amber-500" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900">{c.name}</p>
                <p className="text-xs text-ink-400">최근 방문 {c.lastVisit} · 14일 미방문</p>
              </div>
              <CalendarClock size={18} className="text-ink-400" />
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-6 px-1 text-center text-[11px] text-ink-400">
        프론트엔드 데모 · 데이터는 목업입니다
      </p>
    </AppShell>
  );
}
