"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Button, Card } from "@/components/ui";
import { trainer } from "@/lib/mock";
import { ArrowLeft, Check, Copy, CreditCard, Link2, QrCode, ScanLine, UserPlus } from "lucide-react";

type Method = "qr" | "link" | "manual" | "card";

export default function NewClient() {
  const [method, setMethod] = useState<Method>("qr");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(`https://${trainer.intakeUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell>
      <div className="flex items-center gap-2 py-3">
        <Link href="/clients" className="text-ink-500">
          <ArrowLeft size={22} />
        </Link>
        <span className="text-sm font-semibold text-ink-500">고객 등록</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { k: "qr", label: "내 QR", icon: QrCode },
          { k: "link", label: "입력 링크", icon: Link2 },
          { k: "manual", label: "직접 입력", icon: UserPlus },
          { k: "card", label: "명함", icon: CreditCard },
        ].map((m) => (
          <button
            key={m.k}
            onClick={() => setMethod(m.k as Method)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 text-[11px] font-semibold ${
              method === m.k ? "bg-brand-600 text-white" : "bg-white text-ink-500 shadow-card"
            }`}
          >
            <m.icon size={20} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {method === "qr" && (
          <Card className="p-6 text-center">
            <p className="text-sm font-bold text-ink-900">내 등록 QR 코드</p>
            <p className="mb-4 text-xs text-ink-400">고객이 스캔하면 정보 입력 폼이 열립니다</p>
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border-4 border-ink-900 bg-white">
              {/* QR 자리표시 (백엔드 연동 시 실제 QR 생성) */}
              <QrCode size={170} className="text-ink-900" strokeWidth={1} />
            </div>
            <p className="mt-4 text-xs font-medium text-brand-600">{trainer.intakeUrl}</p>
            <Button variant="outline" className="mt-4 w-full">
              QR 이미지 저장 / 인쇄
            </Button>
          </Card>
        )}

        {method === "link" && (
          <Card className="p-5">
            <p className="text-sm font-bold text-ink-900">고객 정보 입력 링크</p>
            <p className="mb-3 text-xs text-ink-400">
              링크를 카카오톡/문자로 보내면 고객이 직접 정보를 입력합니다.
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-3">
              <span className="flex-1 truncate text-xs text-ink-700">https://{trainer.intakeUrl}</span>
              <button onClick={copy} className="text-brand-600">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <Link href="/intake">
              <Button variant="outline" className="mt-3 w-full">
                <ScanLine size={16} /> 고객이 보는 화면 미리보기
              </Button>
            </Link>
            <Button className="mt-2 w-full">카카오톡으로 링크 보내기</Button>
          </Card>
        )}

        {method === "manual" && (
          <Card className="space-y-3 p-5">
            <p className="text-sm font-bold text-ink-900">직접 입력</p>
            <Field label="이름" placeholder="고객 이름" />
            <Field label="연락처" placeholder="010-0000-0000" />
            <Field label="목표" placeholder="예: 체지방 -5kg" />
            <Field label="생일 (MM-DD)" placeholder="06-18" />
            <div>
              <label className="text-xs font-semibold text-ink-500">건강 특이사항</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
                rows={2}
                placeholder="부상 이력, 주의사항 등"
              />
            </div>
            <Button className="w-full" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
              {saved ? <><Check size={16} /> 저장됨</> : "고객 저장하기"}
            </Button>
          </Card>
        )}

        {method === "card" && (
          <Card className="p-6 text-center">
            <p className="text-sm font-bold text-ink-900">명함 등록</p>
            <p className="mb-4 text-xs text-ink-400">사진을 올리면 연락처를 자동 인식(OCR)합니다</p>
            <div className="mx-auto flex h-40 w-full items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50">
              <div className="text-center text-ink-400">
                <CreditCard size={40} className="mx-auto" />
                <p className="mt-2 text-xs">명함 사진 촬영 / 업로드</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">사진 선택</Button>
          </Card>
        )}
      </div>

      <p className="mt-4 px-1 text-center text-[11px] text-ink-400">
        ※ 민감 건강정보는 별도 동의를 받아 암호화 저장됩니다 (PIPA)
      </p>
    </AppShell>
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
