"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Avatar, Button, Card } from "@/components/ui";
import { clients } from "@/lib/mock";
import { apiPost } from "@/lib/api";
import { ArrowLeft, Check, Mic, Send, Sparkles, Square } from "lucide-react";

type Step = "select" | "record" | "transcribed" | "generated";

const SAMPLE_TRANSCRIPT =
  "오늘 서연님 하체 저충격 루틴 진행했고 무릎 통증 없이 잘 따라왔어요. 스쿼트 폼이 지난주보다 훨씬 안정적이었고 코어 플랭크 1분 버텼습니다. 체지방이 많이 빠져서 컨디션도 좋아 보였어요. 다음 주는 유산소 인터벌 추가할 예정. 잔여 세션 3회 남았다고 안내했습니다.";

export default function NewReport() {
  const [step, setStep] = useState<Step>("select");
  const [clientId, setClientId] = useState(clients[0].id);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState("");
  const [scheduled, setScheduled] = useState(false);

  const client = clients.find((c) => c.id === clientId)!;

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const startRec = () => {
    setRecording(true);
    setSeconds(0);
  };
  const stopRec = () => {
    setRecording(false);
    // STT 시뮬레이션
    setTimeout(() => {
      setTranscript(SAMPLE_TRANSCRIPT);
      setStep("transcribed");
    }, 600);
  };

  const generate = async () => {
    setGenerating(true);
    // 실제 백엔드 호출: 키가 설정돼 있으면 AI 생성, 없으면 서버가 템플릿으로 폴백
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client.name,
          transcript,
          remainingSessions: client.remainingSessions,
        }),
      });
      const data = await res.json();
      setReport(data.report ?? "");
    } catch {
      setReport(`${client.name}님, 오늘도 수고 많으셨어요! 💪\n\n오늘 세션 잘 소화하셨어요. 다음에도 함께 목표까지 가요!`);
    } finally {
      setGenerating(false);
      setStep("generated");
    }
  };

  return (
    <AppShell>
      <div className="flex items-center gap-2 py-3">
        <Link href="/" className="text-ink-500">
          <ArrowLeft size={22} />
        </Link>
        <span className="text-sm font-semibold text-ink-500">음성 → AI 리포트</span>
      </div>

      {/* 진행 단계 */}
      <div className="mb-4 flex items-center gap-1.5 px-1">
        {["고객 선택", "음성 녹음", "AI 리포트", "발송"].map((label, i) => {
          const order = ["select", "record", "transcribed", "generated"];
          const cur = order.indexOf(step);
          const done = i < cur || (step === "generated" && i <= 3);
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full ${done || i === cur ? "bg-brand-500" : "bg-ink-200"}`} />
              <span className="text-[9px] text-ink-400">{label}</span>
            </div>
          );
        })}
      </div>

      {/* 고객 선택 */}
      {step === "select" && (
        <>
          <Card className="p-2">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setClientId(c.id)}
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 ${
                  clientId === c.id ? "bg-brand-50" : ""
                }`}
              >
                <Avatar name={c.name} gradient={c.grad} size={40} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-ink-900">{c.name}</p>
                  <p className="text-xs text-ink-400">{c.goal}</p>
                </div>
                {clientId === c.id && <Check size={18} className="text-brand-600" />}
              </button>
            ))}
          </Card>
          <Button className="mt-4 w-full" onClick={() => setStep("record")}>
            다음 — 음성 녹음
          </Button>
        </>
      )}

      {/* 음성 녹음 */}
      {step === "record" && (
        <div className="flex flex-col items-center pt-6">
          <div className="flex items-center gap-2">
            <Avatar name={client.name} gradient={client.grad} size={32} />
            <p className="text-sm font-bold text-ink-900">{client.name}님 세션 피드백</p>
          </div>
          <p className="mb-8 mt-1 text-xs text-ink-400">자유롭게 말하면 AI가 리포트로 정리해요</p>

          <button
            onClick={recording ? stopRec : startRec}
            className={`flex h-32 w-32 items-center justify-center rounded-full text-white ${
              recording ? "recording bg-rose-500" : "bg-brand-600"
            }`}
          >
            {recording ? <Square size={44} fill="white" /> : <Mic size={52} />}
          </button>

          <p className="mt-6 text-2xl font-extrabold tabular-nums text-ink-900">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </p>
          <p className="text-xs text-ink-400">{recording ? "녹음 중… 탭하여 종료" : "탭하여 녹음 시작"}</p>
        </div>
      )}

      {/* 전사 결과 + 생성 */}
      {step === "transcribed" && (
        <>
          <Card className="p-4">
            <p className="mb-2 text-xs font-semibold text-ink-400">🎙️ 음성 인식 결과 (수정 가능)</p>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={6}
              className="w-full rounded-xl bg-ink-50 p-3 text-sm leading-relaxed text-ink-700 outline-none"
            />
          </Card>
          <Button className="mt-4 w-full" onClick={generate} disabled={generating}>
            {generating ? (
              <>생성 중…</>
            ) : (
              <>
                <Sparkles size={18} /> AI로 고객 리포트 생성
              </>
            )}
          </Button>
          <p className="mt-2 text-center text-[11px] text-ink-400">
            관리자 화면에 등록된 AI 모델/키로 생성됩니다
          </p>
        </>
      )}

      {/* 생성된 리포트 + 발송 */}
      {step === "generated" && (
        <>
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-600" />
              <p className="text-xs font-semibold text-brand-600">AI 생성 리포트</p>
            </div>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={12}
              className="w-full whitespace-pre-line rounded-xl bg-ink-50 p-3 text-sm leading-relaxed text-ink-800 outline-none"
            />
          </Card>

          <Card className="mt-3 p-4">
            <p className="text-sm font-bold text-ink-900">발송 설정</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="flex-1">지금 발송</Button>
              <Button variant="outline" className="flex-1">예약 발송</Button>
            </div>
            <div className="mt-2 flex gap-2 text-[11px]">
              <span className="rounded-full bg-brand-50 px-2 py-1 font-semibold text-brand-700">카카오 알림톡</span>
              <span className="rounded-full bg-ink-100 px-2 py-1 text-ink-500">SMS</span>
              <span className="rounded-full bg-ink-100 px-2 py-1 text-ink-500">이메일</span>
            </div>
          </Card>

          <Button
            className="mt-4 w-full"
            onClick={() => {
              // 리포트 저장 + 고객에게 발송(키 있으면 실제, 없으면 시뮬레이션)
              apiPost("/api/reports", {
                clientId,
                title: `PT 리포트 — ${client.name}님`,
                body: report,
                status: "sent",
                channel: "kakao",
              });
              apiPost("/api/messages/send", { to: client.phone, channel: "kakao_alimtalk", text: report });
              setScheduled(true);
              setTimeout(() => setScheduled(false), 2000);
            }}
          >
            {scheduled ? <><Check size={18} /> 저장 & 발송 예약됨</> : <><Send size={18} /> 리포트 저장하고 보내기</>}
          </Button>
        </>
      )}
    </AppShell>
  );
}
