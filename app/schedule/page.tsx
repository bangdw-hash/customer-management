"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Avatar, Badge, Button, Card, SectionTitle } from "@/components/ui";
import { clientById, formatKShort, getBookings, toISODate, trainer } from "@/lib/mock";
import { useNow } from "@/lib/useNow";
import { CalendarCheck, Check, Copy, ExternalLink, Link2 } from "lucide-react";

const days = ["월", "화", "수", "목", "금", "토", "일"];

export default function SchedulePage() {
  const now = useNow();
  const todayBookings = now ? getBookings(now).filter((b) => b.date === toISODate(now)) : [];
  const [copied, setCopied] = useState(false);
  const [avail, setAvail] = useState<Record<string, boolean>>({
    월: true, 화: true, 수: true, 목: true, 금: true, 토: true, 일: false,
  });
  const [gcal, setGcal] = useState(true);
  const [requested, setRequested] = useState<string[]>([]);

  const copy = () => {
    navigator.clipboard?.writeText(`https://${trainer.bookingUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell title="일정 관리" subtitle="가용 시간 · 예약 · 구글캘린더 동기화">
      {/* 예약 링크 공유 */}
      <SectionTitle title="고객 예약 링크" />
      <Card className="p-4">
        <p className="text-xs text-ink-400">
          고객은 예약 가능한 빈 시간만 보고 직접 선택합니다. 확정 시 양쪽 일정에 자동 등록됩니다.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-3">
          <Link2 size={16} className="text-ink-400" />
          <span className="flex-1 truncate text-xs text-ink-700">https://{trainer.bookingUrl}</span>
          <button onClick={copy} className="text-brand-600">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link href="/book">
            <Button variant="outline" className="w-full">
              <ExternalLink size={16} /> 고객 화면 보기
            </Button>
          </Link>
          <Button className="w-full">카카오로 보내기</Button>
        </div>
      </Card>

      {/* 구글 캘린더 연동 */}
      <SectionTitle title="구글 캘린더 연동" />
      <Card className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
          <CalendarCheck size={20} className="text-sky-600" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink-900">확정 일정 자동 등록</p>
          <p className="text-[11px] text-ink-400">
            {gcal ? "연결됨 · 모든 확정 예약이 구글캘린더에 등록됩니다" : "연결 안 됨"}
          </p>
        </div>
        <button
          onClick={() => setGcal((v) => !v)}
          className={`h-7 w-12 rounded-full p-0.5 transition ${gcal ? "bg-brand-500" : "bg-ink-200"}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white shadow transition ${gcal ? "translate-x-5" : ""}`} />
        </button>
      </Card>
      <p className="mt-1 px-1 text-[11px] text-ink-400">
        ※ 로그인은 구글이 아니어도 됩니다. 확정 일정은 iCalendar(.ics) 포맷으로 고객에게도 전달돼요.
      </p>

      {/* 가용 요일 설정 */}
      <SectionTitle title="예약 가능 요일" />
      <Card className="flex justify-between gap-1 p-3">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setAvail((a) => ({ ...a, [d]: !a[d] }))}
            className={`flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-bold ${
              avail[d] ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-400"
            }`}
          >
            {d}
          </button>
        ))}
      </Card>
      <p className="mt-1 px-1 text-[11px] text-ink-400">기본 운영 06:00–22:00 · 세션 60분 · 버퍼 15분</p>

      {/* 오늘 예약 */}
      <SectionTitle title="오늘 예약" action={now ? formatKShort(now) : ""} />
      <div className="space-y-2.5">
        {todayBookings
          .map((b) => {
            const c = b.clientId ? clientById(b.clientId) : undefined;
            const handled = requested.includes(b.id);
            return (
              <Card key={b.id} className="flex items-center gap-3 p-3.5">
                <div className="w-12 text-center">
                  <p className="text-sm font-bold text-ink-900">{b.start}</p>
                  <p className="text-[10px] text-ink-400">{b.end}</p>
                </div>
                <Avatar name={b.clientName} gradient={c?.grad} color="#94a3b8" size={36} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">{b.clientName}</p>
                  <p className="text-xs text-ink-400">{c?.goal ?? "신규 예약 요청"}</p>
                </div>
                {b.status === "requested" && !handled ? (
                  <Button
                    className="px-3 py-1.5 text-xs"
                    onClick={() => setRequested((r) => [...r, b.id])}
                  >
                    승인
                  </Button>
                ) : (
                  <Badge tone="brand">{handled ? "확정됨" : "확정"}</Badge>
                )}
              </Card>
            );
          })}
      </div>
    </AppShell>
  );
}
