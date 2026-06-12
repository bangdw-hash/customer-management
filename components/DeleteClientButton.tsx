"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const del = async () => {
    setBusy(true);
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
    } catch {}
    router.push("/clients");
    router.refresh();
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold text-rose-500 active:bg-rose-50"
      >
        <Trash2 size={16} /> 이 고객 삭제
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
      <p className="text-sm font-semibold text-ink-900">{name}님을 삭제할까요?</p>
      <p className="mt-0.5 text-xs text-ink-500">관련 결제·리포트·리뷰 기록도 함께 삭제됩니다.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full" onClick={() => setConfirming(false)} disabled={busy}>
          취소
        </Button>
        <Button variant="danger" className="w-full" onClick={del} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 삭제
        </Button>
      </div>
    </div>
  );
}
