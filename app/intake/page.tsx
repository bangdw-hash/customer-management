"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { trainer } from "@/lib/mock";
import { Check, ShieldCheck } from "lucide-react";

export default function IntakePage() {
  const [done, setDone] = useState(false);
  const [agree, setAgree] = useState(false);

  if (done) {
    return (
      <div className="phone-frame flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
          <Check size={44} className="text-brand-600" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-ink-900">등록 완료!</h1>
        <p className="mt-2 text-sm text-ink-500">
          {trainer.name} 코치님에게 정보가 전달되었어요.
          <br />곧 연락드릴게요 😊
        </p>
      </div>
    );
  }

  return (
    <div className="phone-frame min-h-[100dvh] pb-10">
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-6 pb-6 pt-10 text-white">
        <p className="text-xs text-brand-100">고객 정보 입력</p>
        <h1 className="mt-1 text-xl font-extrabold">{trainer.name} 코치님과 함께 시작해요</h1>
        <p className="mt-1 text-sm text-brand-100">{trainer.studio}</p>
      </div>

      <div className="px-5 pt-5">
        <Card className="space-y-3 p-4">
          <Field label="이름 *" placeholder="홍길동" />
          <Field label="연락처 *" placeholder="010-0000-0000" />
          <Field label="생년월일" placeholder="1995-06-18" />
          <div>
            <label className="text-xs font-semibold text-ink-500">운동 목표</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {["체지방 감량", "근육 증가", "체형 교정", "체력 향상", "재활"].map((g) => (
                <Chip key={g} label={g} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500">건강 특이사항 / 부상 이력</label>
            <textarea
              rows={3}
              placeholder="예: 오른쪽 무릎 수술 이력"
              className="mt-1 w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
            />
          </div>
        </Card>

        {/* 동의 */}
        <button
          onClick={() => setAgree((v) => !v)}
          className="mt-4 flex w-full items-start gap-2.5 rounded-xl bg-white p-3.5 text-left shadow-card"
        >
          <span
            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border ${
              agree ? "border-brand-600 bg-brand-600" : "border-ink-300"
            }`}
          >
            {agree && <Check size={14} className="text-white" />}
          </span>
          <span className="flex-1 text-xs text-ink-600">
            <span className="font-semibold text-ink-900">[필수]</span> 개인정보 및 민감 건강정보
            수집·이용에 동의합니다. 정보는 암호화되어 안전하게 보관됩니다.
          </span>
        </button>

        <div className="mt-2 flex items-center gap-1 px-1 text-[11px] text-ink-400">
          <ShieldCheck size={12} /> 개인정보보호법(PIPA)에 따라 보호됩니다
        </div>

        <Button className="mt-5 w-full disabled:opacity-40" disabled={!agree} onClick={() => setDone(true)}>
          등록 신청하기
        </Button>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink-500">{label}</label>
      <input
        className="mt-1 w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
        placeholder={placeholder}
      />
    </div>
  );
}

function Chip({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        on ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600"
      }`}
    >
      {label}
    </button>
  );
}
