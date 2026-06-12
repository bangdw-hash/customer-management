"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { apiGet, apiPost } from "@/lib/api";
import { Check, Database, KeyRound, Loader2, MessageSquare, Send, Trash2, X } from "lucide-react";

type Status = { db: boolean; ai: boolean; message: boolean; calendar: boolean };

export default function SetupPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState<"" | "migrate" | "seed">("");
  const [log, setLog] = useState<string[]>([]);

  // 테스트 문자 발송
  const [testPhone, setTestPhone] = useState("");
  const [testMsg, setTestMsg] = useState("[리피티] 테스트 문자입니다. 정상 수신되면 발송 설정 완료!");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  const refresh = () => apiGet<Status>("/api/status").then((s) => s && setStatus(s));
  useEffect(() => { refresh(); }, []);

  const addLog = (m: string) => setLog((l) => [m, ...l]);

  const run = async (kind: "migrate" | "seed") => {
    if (!token) return addLog("⚠️ SEED_TOKEN 을 먼저 입력하세요.");
    setBusy(kind);
    const url = kind === "migrate" ? "/api/migrate" : "/api/seed";
    const res = await apiPost<any>(`${url}?token=${encodeURIComponent(token)}`, {});
    setBusy("");
    if (res?.ok) addLog(kind === "migrate" ? "✅ 테이블 생성 완료" : "✅ 샘플 데이터 주입 완료");
    else addLog(`❌ 실패: ${res?.error ?? "알 수 없는 오류"}`);
    refresh();
  };

  const sendTest = async () => {
    if (!testPhone) return setTestResult("⚠️ 받는 번호를 입력하세요.");
    setTesting(true);
    setTestResult("");
    const res = await apiPost<any>("/api/messages/send", { to: testPhone, channel: "sms", text: testMsg });
    setTesting(false);
    if (res?.ok && res?.simulated) {
      setTestResult("🟡 시뮬레이션됨 — 아직 Solapi 키가 없어요. (SOLAPI_* 환경변수 등록 후 Redeploy 필요)");
    } else if (res?.ok) {
      setTestResult(`✅ 발송 성공! (${res?.provider ?? "provider"}) — 휴대폰을 확인하세요.`);
    } else {
      setTestResult(`❌ 실패: ${res?.error ?? "알 수 없는 오류"}`);
    }
  };

  const resetAll = async () => {
    if (!token) return addLog("⚠️ SEED_TOKEN 을 먼저 입력하세요.");
    if (typeof window !== "undefined" && !window.confirm("모든 고객·결제·리뷰·리포트를 삭제할까요? (되돌릴 수 없어요)")) return;
    const res = await apiPost<any>(`/api/reset?token=${encodeURIComponent(token)}`, {});
    if (res?.ok) addLog("🧹 전체 데이터 비움 완료");
    else addLog(`❌ 초기화 실패: ${res?.error ?? "알 수 없는 오류"}`);
  };

  const Dot = ({ on }: { on: boolean }) =>
    on ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-ink-300" />;

  return (
    <div className="phone-frame min-h-[100dvh] p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-pink-500 text-white">
          <Database size={20} />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">백엔드 설정</h1>
          <p className="text-xs text-ink-400">DB 연결 → 테이블 생성 → 데이터 주입</p>
        </div>
      </div>

      {/* 연결 상태 */}
      <Card className="p-4">
        <p className="mb-2 text-sm font-bold text-ink-900">연결 상태</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-600">데이터베이스 (DATABASE_URL)</span>
            <Dot on={!!status?.db} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-600">AI 리포트 (ANTHROPIC_API_KEY)</span>
            <Dot on={!!status?.ai} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-600">메시지 발송 (MESSAGE_WEBHOOK_URL)</span>
            <Dot on={!!status?.message} />
          </div>
        </div>
        {!status?.db && (
          <p className="mt-3 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-700">
            아직 DB가 연결되지 않았어요. Vercel 환경변수에 <b>DATABASE_URL</b> 과 <b>SEED_TOKEN</b> 을
            넣고 <b>Redeploy</b> 후 이 페이지를 새로고침하세요.
          </p>
        )}
      </Card>

      {/* 토큰 입력 */}
      <Card className="mt-3 p-4">
        <div className="mb-2 flex items-center gap-1.5">
          <KeyRound size={15} className="text-ink-600" />
          <p className="text-sm font-bold text-ink-900">SEED_TOKEN</p>
        </div>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Vercel에 등록한 SEED_TOKEN 값"
          className="w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
        />
      </Card>

      {/* 실행 버튼 */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full" onClick={() => run("migrate")} disabled={!!busy || !status?.db}>
          {busy === "migrate" ? <Loader2 size={16} className="animate-spin" /> : "①"} 테이블 생성
        </Button>
        <Button className="w-full" onClick={() => run("seed")} disabled={!!busy || !status?.db}>
          {busy === "seed" ? <Loader2 size={16} className="animate-spin" /> : "②"} 샘플 데이터
        </Button>
      </div>

      {/* 로그 */}
      {log.length > 0 && (
        <Card className="mt-3 p-4">
          <p className="mb-1.5 text-xs font-semibold text-ink-400">실행 기록</p>
          <div className="space-y-1 text-xs text-ink-700">
            {log.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </Card>
      )}

      {/* 테스트 문자 발송 (SMS 검증) */}
      <Card className="mt-4 p-4">
        <div className="mb-2 flex items-center gap-1.5">
          <MessageSquare size={15} className="text-ink-600" />
          <p className="text-sm font-bold text-ink-900">테스트 문자 발송</p>
        </div>
        <p className="mb-3 text-[11px] text-ink-400">
          Solapi 키를 넣고 Redeploy 한 뒤, 내 번호로 보내 정상 수신되는지 확인하세요.
        </p>
        <input
          value={testPhone}
          onChange={(e) => setTestPhone(e.target.value)}
          placeholder="받는 번호 (예: 01012345678)"
          inputMode="numeric"
          className="w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
        />
        <textarea
          value={testMsg}
          onChange={(e) => setTestMsg(e.target.value)}
          rows={2}
          className="mt-2 w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
        />
        <Button className="mt-2 w-full" onClick={sendTest} disabled={testing}>
          {testing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 테스트 발송
        </Button>
        {testResult && <p className="mt-2 text-center text-xs font-medium text-ink-700">{testResult}</p>}
      </Card>

      {/* 데이터 초기화 */}
      <Card className="mt-4 border border-rose-100 p-4">
        <p className="text-sm font-bold text-ink-900">데이터 초기화</p>
        <p className="mb-3 text-[11px] text-ink-400">
          샘플 고객을 포함한 <b>모든 고객·결제·리뷰·리포트</b>를 삭제합니다. 깨끗한 상태로 베타테스트할 때 사용하세요.
        </p>
        <Button variant="danger" className="w-full" onClick={resetAll} disabled={!status?.db}>
          <Trash2 size={16} /> 전체 데이터 비우기
        </Button>
      </Card>

      <p className="mt-4 text-center text-[11px] text-ink-400">
        설정 완료 후에는 이 페이지를 사용할 필요가 없어요.
      </p>
    </div>
  );
}
