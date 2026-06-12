"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { KRW, trainer } from "@/lib/mock";
import { apiPost } from "@/lib/api";
import { BadgeCheck, Check, ShieldCheck } from "lucide-react";

// 데모 결제 id (실제로는 링크 파라미터로 전달)
const DEMO_PAYMENT_ID = "p3";

// 데모용 확인 대상 결제 (실제로는 링크 파라미터로 특정 결제 전달)
const demo = {
  client: "박지민",
  item: "16회권",
  amount: 980000,
  method: "현금",
  sessionsAdded: 16,
  date: "2026-02-20",
};

export default function PayConfirmPage() {
  const [done, setDone] = useState(false);

  return (
    <div className="phone-frame min-h-[100dvh] pb-10">
      <div className="bg-gradient-to-br from-brand-600 via-fuchsia-600 to-pink-600 px-6 pb-7 pt-10 text-white">
        <p className="text-xs text-white/80">결제 확인</p>
        <h1 className="mt-1 text-xl font-extrabold">
          {trainer.name} {trainer.honorific}님이 보낸 결제 내역이에요
        </h1>
        <p className="mt-1 text-sm text-white/80">{trainer.studio}</p>
      </div>

      <div className="px-5 pt-5">
        <Card className="p-5">
          <p className="text-center text-3xl font-extrabold text-ink-900">{KRW(demo.amount)}</p>
          <p className="mb-4 text-center text-xs text-ink-400">{demo.method} 결제</p>

          <div className="space-y-2.5 border-t border-ink-100 pt-4 text-sm">
            <Row label="상품" value={demo.item} />
            <Row label="추가 세션" value={`${demo.sessionsAdded}회`} />
            <Row label="결제일" value={demo.date} />
            <Row label="결제자" value={demo.client} />
          </div>
        </Card>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3">
          <ShieldCheck size={16} className="mt-0.5 text-emerald-600" />
          <p className="text-[12px] leading-relaxed text-emerald-800">
            결제는 센터에서 진행되었고, 이 화면은 <b>내역 확인용</b>이에요. 내용이 맞으면 아래
            <b> “내역 확인”</b>을 눌러주세요. 누르면 트레이너와 같은 기록을 공유하게 됩니다.
          </p>
        </div>

        {done ? (
          <Card className="mt-5 flex flex-col items-center gap-2 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <BadgeCheck size={36} className="text-emerald-600" />
            </div>
            <p className="text-base font-extrabold text-ink-900">확인 완료!</p>
            <p className="text-xs text-ink-500">잔여 세션에 {demo.sessionsAdded}회가 반영됐어요.</p>
          </Card>
        ) : (
          <Button
            className="mt-5 w-full"
            onClick={() => {
              apiPost("/api/payments/confirm", { id: DEMO_PAYMENT_ID });
              setDone(true);
            }}
          >
            <Check size={18} /> 내역 확인
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}
