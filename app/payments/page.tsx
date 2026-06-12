"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Avatar, Badge, Button, Card, SectionTitle } from "@/components/ui";
import { clientById, clients, KRW, payments, type Payment } from "@/lib/mock";
import { apiGet, apiPost } from "@/lib/api";
import { BadgeCheck, Check, Clock, Plus, Send } from "lucide-react";

export default function PaymentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [pmts, setPmts] = useState<Payment[]>(payments);
  const [draft, setDraft] = useState({ clientId: clients[0].id, item: "", amount: "", method: "현장카드" });

  useEffect(() => {
    apiGet<{ payments: Payment[] }>("/api/payments").then((d) => {
      if (d?.payments?.length) setPmts(d.payments);
    });
  }, []);

  const monthTotal = pmts.reduce((s, p) => s + p.amount, 0);
  const unconfirmed = pmts.filter((p) => !p.confirmedByClient);

  const record = async () => {
    const amount = Number(draft.amount) || 0;
    const optimistic: Payment = {
      id: "tmp_" + Date.now(),
      clientId: draft.clientId,
      date: new Date().toISOString().slice(0, 10),
      amount,
      method: draft.method as Payment["method"],
      item: draft.item || "회차권",
      sessionsAdded: 0,
      confirmedByClient: false,
    };
    setPmts((p) => [optimistic, ...p]);
    setShowForm(false);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    apiPost("/api/payments", {
      clientId: draft.clientId,
      item: draft.item,
      amount,
      method: draft.method,
    });
    setDraft({ clientId: clients[0].id, item: "", amount: "", method: "현장카드" });
  };

  return (
    <AppShell title="결제 내역" subtitle="현장 결제 기록 · 고객 공동 확인">
      {/* 요약 */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Card className="p-3.5">
          <p className="text-[11px] text-ink-400">누적 결제</p>
          <p className="text-lg font-extrabold text-ink-900">{KRW(monthTotal)}</p>
        </Card>
        <Card className="p-3.5">
          <p className="text-[11px] text-ink-400">고객 확인 대기</p>
          <p className="text-lg font-extrabold text-rose-500">{unconfirmed.length}건</p>
        </Card>
      </div>

      <div className="mt-2 flex items-start gap-2 rounded-xl bg-emerald-50 p-3">
        <BadgeCheck size={16} className="mt-0.5 text-emerald-600" />
        <p className="text-[12px] leading-relaxed text-emerald-800">
          센터에서 직접 결제(카드/현금/이체)하면 여기에 <b>기록만</b> 합니다. 고객에게 확인 링크가
          가고, 고객이 <b>“확인”</b>을 누르면 양쪽이 같은 내역을 공유해요. (실제 결제는 센터에서)
        </p>
      </div>

      {/* 결제 기록 추가 */}
      {!showForm ? (
        <Button className="mt-3 w-full" onClick={() => setShowForm(true)}>
          <Plus size={18} /> 결제 기록 추가
        </Button>
      ) : (
        <Card className="mt-3 space-y-3 p-4">
          <p className="text-sm font-bold text-ink-900">결제 기록 추가</p>
          <select
            value={draft.clientId}
            onChange={(e) => setDraft((d) => ({ ...d, clientId: e.target.value }))}
            className="w-full rounded-xl border border-ink-200 p-3 text-sm outline-none"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={draft.item}
              onChange={(e) => setDraft((d) => ({ ...d, item: e.target.value }))}
              placeholder="상품 (예: 30회권)"
              className="rounded-xl border border-ink-200 p-3 text-sm outline-none"
            />
            <input
              value={draft.amount}
              onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
              placeholder="금액"
              inputMode="numeric"
              className="rounded-xl border border-ink-200 p-3 text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["현장카드", "현금", "계좌이체"].map((m) => (
              <button
                key={m}
                onClick={() => setDraft((d) => ({ ...d, method: m }))}
                className={`flex-1 rounded-xl py-2.5 text-xs font-semibold ${
                  draft.method === m ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <Button className="w-full" onClick={record}>
            <Send size={16} /> 기록하고 고객에게 확인 요청
          </Button>
        </Card>
      )}
      {sent && (
        <p className="mt-2 text-center text-xs font-semibold text-emerald-600">
          ✓ 기록됨 · 고객에게 확인 링크를 보냈어요
        </p>
      )}

      {/* 내역 */}
      <SectionTitle title="결제 기록" action={`${pmts.length}건`} />
      <div className="space-y-2.5">
        {pmts.map((p) => {
          const c = clientById(p.clientId);
          return (
            <Card key={p.id} className="p-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={c?.name ?? "고객"} gradient={c?.grad} size={38} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink-900">{c?.name}</p>
                    <Badge tone="slate">{p.method}</Badge>
                  </div>
                  <p className="text-[11px] text-ink-400">
                    {p.item} · {p.sessionsAdded}회 · {p.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-ink-900">{KRW(p.amount)}</p>
                  {p.confirmedByClient ? (
                    <span className="flex items-center justify-end gap-0.5 text-[11px] font-semibold text-emerald-600">
                      <Check size={12} /> 고객 확인됨
                    </span>
                  ) : (
                    <span className="flex items-center justify-end gap-0.5 text-[11px] font-semibold text-rose-500">
                      <Clock size={12} /> 확인 대기
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Link href="/pay" className="mt-4 block">
        <Button variant="outline" className="w-full text-sm">
          고객이 보는 결제 확인 화면 미리보기
        </Button>
      </Link>
    </AppShell>
  );
}
