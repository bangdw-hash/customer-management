"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Badge, Button, Card, SectionTitle } from "@/components/ui";
import { Check, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

const models = [
  { id: "claude-opus-4-8", label: "Claude Opus 4.8", desc: "최고 품질 리포트" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", desc: "빠르고 저렴 (권장)" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", desc: "초저가 · 대량" },
];

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [show, setShow] = useState(false);
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [saved, setSaved] = useState(false);
  const [prompt, setPrompt] = useState(
    "너는 따뜻하고 전문적인 퍼스널 트레이너야. 세션 메모를 바탕으로 고객이 동기부여를 느낄 수 있는 리포트를 작성해. 성과·다음 목표·격려를 포함하고, 친근한 존댓말과 적절한 이모지를 사용해."
  );

  return (
    <AppShell title="관리자" subtitle="AI · 발송 채널 · 결제 · 통계">
      {/* 운영 통계 */}
      <SectionTitle title="이번 달 현황" />
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "재등록 전환율", value: "68%", tone: "text-brand-600" },
          { label: "리포트 발송", value: "42건", tone: "text-ink-900" },
          { label: "노쇼율", value: "4%", tone: "text-ink-900" },
          { label: "메시지 도달률", value: "97%", tone: "text-ink-900" },
        ].map((s) => (
          <Card key={s.label} className="p-3.5">
            <p className="text-[11px] text-ink-400">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* AI API Key 관리 — 핵심 요구 */}
      <SectionTitle title="AI 리포트 설정" />
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <KeyRound size={16} className="text-ink-600" />
          <p className="text-sm font-bold text-ink-900">API Key</p>
          <span className="flex items-center gap-1 text-[10px] text-brand-600">
            <ShieldCheck size={12} /> 서버 암호화 저장
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-3">
          <input
            type={show ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full bg-transparent text-sm outline-none"
          />
          <button onClick={() => setShow((v) => !v)} className="text-ink-400">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold text-ink-500">생성 모델</p>
        <div className="space-y-2">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${
                model === m.id ? "border-brand-400 bg-brand-50" : "border-ink-200"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-ink-900">{m.label}</p>
                <p className="text-[11px] text-ink-400">{m.desc}</p>
              </div>
              {model === m.id && <Check size={18} className="text-brand-600" />}
            </button>
          ))}
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold text-ink-500">리포트 프롬프트 템플릿</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-ink-200 p-3 text-xs leading-relaxed text-ink-700 outline-none focus:border-brand-400"
        />

        <Button
          className="mt-4 w-full"
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}
        >
          {saved ? <><Check size={16} /> 저장됨</> : "AI 설정 저장"}
        </Button>
      </Card>

      {/* 발송 채널 */}
      <SectionTitle title="발송 채널" />
      <Card className="divide-y divide-ink-100">
        {[
          { label: "카카오 알림톡 (발송대행)", sub: "정보성 · 템플릿 승인 완료", on: true },
          { label: "카카오 브랜드 메시지", sub: "마케팅성 · 친구 대상", on: true },
          { label: "SMS / LMS 백업", sub: "도달 실패 시 자동 전환", on: true },
          { label: "이메일", sub: "리포트 PDF 첨부", on: false },
        ].map((ch) => (
          <div key={ch.label} className="flex items-center gap-3 p-3.5">
            <div className="flex-1">
              <p className="text-sm font-medium text-ink-900">{ch.label}</p>
              <p className="text-[11px] text-ink-400">{ch.sub}</p>
            </div>
            <Badge tone={ch.on ? "brand" : "slate"}>{ch.on ? "연결됨" : "미연결"}</Badge>
          </div>
        ))}
      </Card>

      {/* 세션 상품 */}
      <SectionTitle title="세션 상품 (횟수권)" />
      <Card className="divide-y divide-ink-100">
        {[
          { n: "10회권", price: "650,000원" },
          { n: "20회권", price: "1,200,000원" },
          { n: "30회권", price: "1,650,000원 (10% 할인)" },
        ].map((p) => (
          <div key={p.n} className="flex items-center justify-between p-3.5">
            <p className="text-sm font-semibold text-ink-900">{p.n}</p>
            <p className="text-sm text-ink-600">{p.price}</p>
          </div>
        ))}
      </Card>

      <p className="my-6 text-center text-[11px] text-ink-400">핏플로우 v0.1 · 프론트엔드 데모</p>
    </AppShell>
  );
}
