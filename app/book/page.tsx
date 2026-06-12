"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { getBookingDates, trainer } from "@/lib/mock";
import { useNow } from "@/lib/useNow";
import { CalendarCheck, CalendarPlus, Check, Clock, MapPin } from "lucide-react";

export default function BookPage() {
  const now = useNow();
  const dates = now ? getBookingDates(now) : [];

  const [dateKey, setDateKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  // 접속 후 날짜가 준비되면 첫 날짜를 기본 선택
  const activeKey = dateKey ?? dates[0]?.key ?? null;
  const activeDate = dates.find((d) => d.key === activeKey);

  if (done && activeDate) {
    return (
      <div className="phone-frame flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
          <Check size={44} className="text-brand-600" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-ink-900">예약이 확정됐어요!</h1>
        <p className="mt-2 text-sm text-ink-500">
          {activeDate.label} ({activeDate.day}) {slot} · {trainer.name} {trainer.honorific}
        </p>
        <Card className="mt-6 w-full p-4 text-left">
          <div className="flex items-center gap-2 text-sm text-ink-700">
            <CalendarCheck size={18} className="text-brand-600" />
            트레이너 구글캘린더에 자동 등록됨
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-ink-700">
            <CalendarPlus size={18} className="text-pink-600" />
            내 캘린더에 추가 (.ics)
          </div>
        </Card>
        <Button className="mt-6 w-full">
          <CalendarPlus size={18} /> 내 구글 캘린더에 추가하기
        </Button>
        <p className="mt-3 text-[11px] text-ink-400">예약 확인 메시지를 카카오톡으로 보내드렸어요</p>
      </div>
    );
  }

  return (
    <div className="phone-frame min-h-[100dvh] pb-28">
      {/* 트레이너 헤더 */}
      <div className="bg-gradient-to-br from-brand-600 via-fuchsia-600 to-pink-600 px-6 pb-6 pt-10 text-white">
        <p className="text-xs text-white/80">PT 예약</p>
        <h1 className="mt-1 text-2xl font-extrabold">
          {trainer.name} {trainer.honorific}
        </h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
          <MapPin size={14} /> {trainer.studio}
        </p>
        <p className="mt-1 text-sm text-white/80">세션 60분 · 1:1 퍼스널 트레이닝</p>
      </div>

      <div className="px-5">
        {/* 날짜 선택 */}
        <p className="mb-2 mt-5 text-sm font-bold text-ink-900">날짜 선택</p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {dates.map((d) => (
            <button
              key={d.key}
              onClick={() => {
                setDateKey(d.key);
                setSlot(null);
              }}
              className={`flex min-w-[60px] flex-col items-center rounded-2xl px-4 py-3 ${
                activeKey === d.key ? "bg-brand-600 text-white" : "bg-white text-ink-600 shadow-card"
              }`}
            >
              <span className="text-[11px]">{d.day}</span>
              <span className="text-base font-extrabold">{d.label}</span>
            </button>
          ))}
          {!now && <span className="px-2 py-3 text-sm text-ink-400">불러오는 중…</span>}
        </div>

        {/* 시간 선택 */}
        <p className="mb-2 mt-5 flex items-center gap-1 text-sm font-bold text-ink-900">
          <Clock size={15} /> 예약 가능 시간
        </p>
        <div className="grid grid-cols-3 gap-2">
          {activeDate?.slots.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={`rounded-xl py-3 text-sm font-semibold ${
                slot === s ? "bg-brand-600 text-white" : "bg-white text-ink-700 shadow-card"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-ink-400">※ 예약 가능한 빈 시간만 표시됩니다</p>

        {/* 정보 입력 */}
        {slot && (
          <Card className="mt-5 space-y-3 p-4">
            <p className="text-sm font-bold text-ink-900">예약자 정보</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락처 (010-0000-0000)"
              className="w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
            />
          </Card>
        )}
      </div>

      {/* 하단 고정 확정 버튼 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[460px] -translate-x-1/2 border-t border-ink-100 bg-white/95 p-4 backdrop-blur">
        <Button
          className="w-full disabled:opacity-40"
          disabled={!slot || !name || !phone}
          onClick={() => setDone(true)}
        >
          {slot ? `${slot} 예약 확정하기` : "시간을 선택하세요"}
        </Button>
      </div>
    </div>
  );
}
