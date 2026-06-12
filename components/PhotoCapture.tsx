"use client";

import { useRef, useState } from "react";
import { Camera, RotateCcw, X } from "lucide-react";

// 모바일에서 실제 카메라를 열어 사진 촬영/선택 + 미리보기.
// capture="environment" → 후면 카메라. onPicked로 파일 전달(저장 연동 시 사용).
export default function PhotoCapture({
  label = "사진 촬영 / 업로드",
  onPicked,
}: {
  label?: string;
  onPicked?: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUrl(URL.createObjectURL(f));
    onPicked?.(f);
  };

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handle}
      />
      {url ? (
        <div className="relative overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="촬영한 사진" className="max-h-72 w-full object-cover" />
          <button
            onClick={() => {
              setUrl(null);
              if (ref.current) ref.current.value = "";
            }}
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
