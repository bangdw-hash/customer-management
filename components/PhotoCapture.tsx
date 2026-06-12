"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Camera, Check, Loader2, RotateCcw, X } from "lucide-react";

// 모바일에서 실제 카메라를 열어 촬영/선택 → Vercel Blob에 업로드(영구저장) → URL 콜백.
// 저장소(BLOB_READ_WRITE_TOKEN) 미설정이면 업로드는 생략되고 로컬 미리보기만 유지.
export default function PhotoCapture({
  label = "사진 촬영 / 업로드",
  onUploaded,
}: {
  label?: string;
  onUploaded?: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "uploading" | "saved" | "local">("idle");

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUrl(URL.createObjectURL(f)); // 즉시 미리보기
    setState("uploading");
    try {
      const blob = await upload(f.name, f, { access: "public", handleUploadUrl: "/api/upload" });
      setUrl(blob.url);
      setState("saved");
      onUploaded?.(blob.url);
    } catch {
      // 저장소 미설정/오류 → 로컬 미리보기만
      setState("local");
    }
  };

  const reset = () => {
    setUrl(null);
    setState("idle");
    if (ref.current) ref.current.value = "";
  };

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={handle} />
      {url ? (
        <div className="relative overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="첨부 사진" className="max-h-72 w-full object-cover" />
          <button
            onClick={reset}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white"
            aria-label="삭제"
          >
            <X size={16} />
          </button>
          <button
            onClick={() => ref.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white"
          >
            <RotateCcw size={13} /> 다시
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white">
            {state === "uploading" && (<><Loader2 size={13} className="animate-spin" /> 저장 중…</>)}
            {state === "saved" && (<><Check size={13} /> 저장됨</>)}
            {state === "local" && <span>미리보기</span>}
          </div>
        </div>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50 py-7 text-ink-500"
        >
          <Camera size={26} />
          <span className="text-xs font-semibold">{label}</span>
          <span className="text-[10px] text-ink-400">탭하면 카메라가 열려요</span>
        </button>
      )}
    </div>
  );
}
