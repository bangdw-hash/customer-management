"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { trainer } from "@/lib/mock";
import { apiPost } from "@/lib/api";
import PhotoCapture from "@/components/PhotoCapture";
import { Check, Heart, Star } from "lucide-react";

const QUICK = ["친절해요", "성과가 좋아요", "꼼꼼해요", "동기부여 최고", "시설이 좋아요"];

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [consent, setConsent] = useState(true);
  const [done, setDone] = useState(false);

  const submit = () => {
    const body = text || (tags.length ? tags.join(", ") : "");
    apiPost("/api/reviews", { rating, text: body, consentMarketing: consent });
    setDone(true);
  };

  if (done) {
    return (
      <div className="phone-frame flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-pink-500 text-white">
          <Heart size={40} className="fill-white" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-ink-900">소중한 후기 감사해요! 💜</h1>
        <p className="mt-2 text-sm text-ink-500">
          {trainer.name} {trainer.honorific}님께 큰 힘이 됩니다.
          <br />앞으로도 함께 목표까지 가요!
        </p>
      </div>
    );
  }

  return (
    <div className="phone-frame min-h-[100dvh] pb-28">
      <div className="bg-gradient-to-br from-brand-600 via-fuchsia-600 to-pink-600 px-6 pb-7 pt-10 text-white">
        <p className="text-xs text-white/80">후기 남기기</p>
        <h1 className="mt-1 text-xl font-extrabold">
          {trainer.name} {trainer.honorific}님과의 PT, 어떠셨어요?
        </h1>
        <p className="mt-1 text-sm text-white/80">1분이면 충분해요 😊</p>
      </div>

      <div className="px-5 pt-5">
        {/* 별점 */}
        <Card className="p-5 text-center">
          <p className="text-sm font-bold text-ink-900">만족도를 별로 알려주세요</p>
          <div className="mt-3 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setRating(i)} aria-label={`${i}점`}>
                <Star
                  size={40}
                  className={i <= rating ? "fill-amber-400 text-amber-400" : "text-ink-200"}
                />
              </button>
            ))}
          </div>
        </Card>

        {/* 빠른 태그 — 부담 없이 */}
        <p className="mb-2 mt-4 text-sm font-bold text-ink-900">어떤 점이 좋았나요? (선택)</p>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => {
            const on = tags.includes(q);
            return (
              <button
                key={q}
                onClick={() => setTags((t) => (on ? t.filter((x) => x !== q) : [...t, q]))}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  on ? "bg-brand-600 text-white" : "bg-white text-ink-600 shadow-card"
                }`}
              >
                {q}
              </button>
            );
          })}
        </div>

        {/* 한 줄 후기 */}
        <p className="mb-2 mt-4 text-sm font-bold text-ink-900">한 줄 후기 (선택)</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="예: 무릎 걱정 없이 3개월 만에 7kg 감량했어요!"
          className="w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-brand-400"
        />

        {/* 사진 첨부 — 실제 카메라 */}
        <div className="mt-2">
          <PhotoCapture label="비포/애프터 사진 첨부 (선택)" />
        </div>

        {/* 마케팅 동의 */}
        <button
          onClick={() => setConsent((v) => !v)}
          className="mt-4 flex w-full items-start gap-2.5 rounded-xl bg-white p-3.5 text-left shadow-card"
        >
          <span
            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border ${
              consent ? "border-brand-600 bg-brand-600" : "border-ink-300"
            }`}
          >
            {consent && <Check size={14} className="text-white" />}
          </span>
          <span className="flex-1 text-xs text-ink-600">
            제 후기를 <b className="text-ink-900">홍보 자료로 사용</b>하는 데 동의해요. (이름은 익명 처리)
          </span>
        </button>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[460px] -translate-x-1/2 border-t border-ink-100 bg-white/95 p-4 backdrop-blur">
        <Button className="w-full disabled:opacity-40" disabled={rating === 0} onClick={submit}>
          후기 보내기
        </Button>
      </div>
    </div>
  );
}
