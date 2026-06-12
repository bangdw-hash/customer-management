import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { Avatar, Badge, Button, Card, SectionTitle } from "@/components/ui";
import { clientById, reportsByClient } from "@/lib/mock";
import { ArrowLeft, Cake, Gift, Mic, Phone, Send, Sparkles } from "lucide-react";

export default function ClientDetail({ params }: { params: { id: string } }) {
  const c = clientById(params.id);
  if (!c) return notFound();
  const reports = reportsByClient(c.id);

  const first = c.measurements[0];
  const last = c.measurements[c.measurements.length - 1];
  const dWeight = (last.weight - first.weight).toFixed(1);
  const dFat = (last.bodyFat - first.bodyFat).toFixed(1);
  const dMuscle = (last.muscle - first.muscle).toFixed(1);

  const maxW = Math.max(...c.measurements.map((m) => m.weight));

  return (
    <AppShell>
      <div className="flex items-center gap-2 py-3">
        <Link href="/clients" className="text-ink-500">
          <ArrowLeft size={22} />
        </Link>
        <span className="text-sm font-semibold text-ink-500">고객 상세</span>
      </div>

      {/* 프로필 */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name={c.name} color={c.avatarColor} size={56} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-ink-900">{c.name}</h1>
              {c.status === "active" && <Badge tone="brand">관리중</Badge>}
              {c.status === "at-risk" && <Badge tone="amber">이탈위험</Badge>}
              {c.status === "past" && <Badge tone="slate">종료</Badge>}
            </div>
            <p className="text-xs text-ink-400">{c.goal}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
              <Phone size={12} /> {c.phone}
            </p>
          </div>
        </div>

        {c.note && (
          <p className="mt-3 rounded-xl bg-ink-50 p-2.5 text-xs text-ink-600">📌 {c.note}</p>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-brand-50 py-2.5">
            <p className="text-lg font-extrabold text-brand-700">{c.remainingSessions}</p>
            <p className="text-[10px] text-ink-500">잔여 세션</p>
          </div>
          <div className="rounded-xl bg-ink-50 py-2.5">
            <p className="text-lg font-extrabold text-ink-900">{c.totalSessions}</p>
            <p className="text-[10px] text-ink-500">총 세션</p>
          </div>
          <div className="rounded-xl bg-ink-50 py-2.5">
            <p className="text-lg font-extrabold text-ink-900">{c.joinedAt.slice(5)}</p>
            <p className="text-[10px] text-ink-500">등록일</p>
          </div>
        </div>
      </Card>

      {/* 휴먼터치 정보 */}
      <SectionTitle title="휴먼 터치" action="자동 알림 예약됨" />
      <Card className="flex gap-2 p-3.5">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-rose-50 p-2.5">
          <Cake size={18} className="text-rose-500" />
          <div>
            <p className="text-[10px] text-ink-400">생일</p>
            <p className="text-xs font-bold text-ink-900">{c.birthday}</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-violet-50 p-2.5">
          <Gift size={18} className="text-violet-500" />
          <div>
            <p className="text-[10px] text-ink-400">등록 기념일</p>
            <p className="text-xs font-bold text-ink-900">{c.anniversary?.slice(5)}</p>
          </div>
        </div>
      </Card>

      {/* 성과(비포/애프터) */}
      <SectionTitle title="성과 변화" action={`${first.date} → ${last.date}`} />
      <Card className="p-4">
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <Metric label="체중" value={`${last.weight}kg`} delta={`${dWeight}kg`} good={+dWeight <= 0} />
          <Metric label="체지방" value={`${last.bodyFat}%`} delta={`${dFat}%p`} good={+dFat <= 0} />
          <Metric label="근육량" value={`${last.muscle}kg`} delta={`+${dMuscle}kg`} good={+dMuscle >= 0} />
        </div>
        {/* 간단한 체중 추이 막대 */}
        <div className="flex items-end justify-between gap-2 pt-2">
          {c.measurements.map((m) => (
            <div key={m.date} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-ink-500">{m.weight}</span>
              <div
                className="w-full rounded-t-md bg-brand-400"
                style={{ height: `${(m.weight / maxW) * 80 + 20}px` }}
              />
              <span className="text-[9px] text-ink-400">{m.date.slice(5)}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full">
          <Send size={16} /> 비포/애프터 카드 공유하기
        </Button>
      </Card>

      {/* 리포트 타임라인 */}
      <SectionTitle title="리포트 타임라인" action="음성으로 작성" href="/reports/new" />
      <div className="space-y-2.5">
        {reports.map((r) => (
          <Card key={r.id} className="p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink-900">{r.title}</p>
              <Badge tone={r.status === "sent" ? "brand" : "amber"}>
                {r.status === "sent" ? "발송됨" : "예약"}
              </Badge>
            </div>
            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-ink-600 line-clamp-4">
              {r.body}
            </p>
            <p className="mt-2 text-[11px] text-ink-400">
              {r.date} · 카카오 알림톡
            </p>
          </Card>
        ))}
        {reports.length === 0 && (
          <Card className="p-6 text-center text-sm text-ink-400">
            아직 리포트가 없어요. 음성으로 첫 리포트를 만들어 보세요.
          </Card>
        )}
      </div>

      {/* 하단 액션 */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link href="/reports/new">
          <Button variant="outline" className="w-full">
            <Mic size={16} /> 음성 리포트
          </Button>
        </Link>
        <Button className="w-full">
          <Sparkles size={16} /> 재등록 제안
        </Button>
      </div>
    </AppShell>
  );
}

function Metric({ label, value, delta, good }: { label: string; value: string; delta: string; good: boolean }) {
  return (
    <div className="rounded-xl bg-ink-50 py-2.5">
      <p className="text-[10px] text-ink-500">{label}</p>
      <p className="text-base font-extrabold text-ink-900">{value}</p>
      <p className={`text-[11px] font-bold ${good ? "text-brand-600" : "text-rose-500"}`}>{delta}</p>
    </div>
  );
}
