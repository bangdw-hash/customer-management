"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Avatar, Badge, Button, Card, SectionTitle } from "@/components/ui";
import { clientById, reviewRequestTargets, reviews, trainer, type Review } from "@/lib/mock";
import { apiGet, apiPost } from "@/lib/api";
import { Check, Copy, Download, Send, Share2, Sparkles, Star } from "lucide-react";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= n ? "fill-amber-400 text-amber-400" : "text-ink-200"} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [requested, setRequested] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [revs, setRevs] = useState<Review[]>(reviews);

  useEffect(() => {
    apiGet<{ reviews: Review[] }>("/api/reviews").then((d) => {
      if (d?.reviews?.length) setRevs(d.reviews);
    });
  }, []);

  const marketing = revs.filter((r) => r.consentMarketing);
  const targets = reviewRequestTargets();
  const avg = revs.length ? (revs.reduce((s, r) => s + r.rating, 0) / revs.length).toFixed(1) : "0.0";

  const requestReview = (clientId: string, name: string, phone: string) => {
    setRequested((r) => [...r, clientId]);
    // 리뷰 작성 링크를 메시지로 발송(키 있으면 실제, 없으면 시뮬레이션)
    apiPost("/api/messages/send", {
      to: phone,
      channel: "kakao_alimtalk",
      text: `${name}님, ${trainer.name} ${trainer.honorific}입니다 :) 오늘 PT 어떠셨어요? 한 줄 후기 부탁드려요 → https://${trainer.slug}.fitflow.app/review`,
    });
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://${trainer.slug}.fitflow.app/review`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell title="후기 · 마케팅" subtitle="자연스러운 리뷰 유도 → 홍보 소스화">
      {/* 요약 */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <p className="flex items-center justify-center gap-1 text-xl font-extrabold text-amber-500">
            {avg} <Star size={16} className="fill-amber-400 text-amber-400" />
          </p>
          <p className="text-[10px] text-ink-400">평균 별점</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-extrabold text-ink-900">{revs.length}</p>
          <p className="text-[10px] text-ink-400">받은 후기</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-extrabold text-brand-600">{marketing.length}</p>
          <p className="text-[10px] text-ink-400">홍보 사용 가능</p>
        </Card>
      </div>

      {/* 리뷰 요청 — 적기 유도 */}
      <SectionTitle title="리뷰 요청 적기" action="만족도 높을 때" />
      <Card className="p-4">
        <div className="flex items-start gap-2 rounded-xl bg-brand-50 p-3">
          <Sparkles size={16} className="mt-0.5 text-brand-600" />
          <p className="text-[12px] leading-relaxed text-brand-800">
            성과가 좋은 고객에게 <b>부담 없는 한 줄 후기</b>를 요청하세요. 별점+짧은 글이면 충분하고,
            동의 시 홍보 자료로 자동 정리됩니다.
          </p>
        </div>
        <div className="mt-3 space-y-2">
          {targets.map((c) => {
            const done = requested.includes(c.id);
            return (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar name={c.name} gradient={c.grad} size={38} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">{c.name}</p>
                  <p className="text-[11px] text-ink-400">{c.goal} · 최근 성과 좋음</p>
                </div>
                <Button
                  variant={done ? "outline" : "primary"}
                  className="px-3 py-1.5 text-xs"
                  onClick={() => requestReview(c.id, c.name, c.phone)}
                  disabled={done}
                >
                  {done ? (
                    <><Check size={14} /> 요청됨</>
                  ) : (
                    <><Send size={14} /> 요청</>
                  )}
                </Button>
              </div>
            );
          })}
          {targets.length === 0 && (
            <p className="py-3 text-center text-xs text-ink-400">요청할 대상이 없어요.</p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-2.5">
          <span className="flex-1 truncate text-[11px] text-ink-600">
            리뷰 작성 링크: {trainer.slug}.fitflow.app/review
          </span>
          <button onClick={copyLink} className="text-brand-600">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <Link href="/review">
          <Button variant="outline" className="mt-2 w-full text-sm">
            고객이 보는 리뷰 화면 미리보기
          </Button>
        </Link>
      </Card>

      {/* 홍보용 후기 카드 */}
      <SectionTitle title="홍보용 후기 카드" action="공유 · 내보내기" />
      <div className="space-y-2.5">
        {marketing.map((r) => {
          const c = clientById(r.clientId);
          return (
            <Card key={r.id} className="overflow-hidden">
              <div className="bg-gradient-to-br from-brand-600 to-pink-500 px-4 py-3 text-white">
                <div className="flex items-center justify-between">
                  <Stars n={r.rating} />
                  <Badge tone="slate">홍보 동의</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed">“{r.text}”</p>
              </div>
              <div className="flex items-center gap-2 p-3">
                <Avatar name={c?.name ?? "고객"} gradient={c?.grad} size={28} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-ink-900">
                    {c?.name?.[0]}OO 회원 {r.beforeAfter && "· 비포/애프터 포함"}
                  </p>
                  <p className="text-[10px] text-ink-400">{r.date}</p>
                </div>
                <button className="flex items-center gap-1 rounded-lg bg-ink-100 px-2.5 py-1.5 text-[11px] font-semibold text-ink-600">
                  <Share2 size={13} /> 공유
                </button>
                <button className="flex items-center gap-1 rounded-lg bg-ink-100 px-2.5 py-1.5 text-[11px] font-semibold text-ink-600">
                  <Download size={13} /> 저장
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="mt-2 px-1 text-[11px] text-ink-400">
        ※ 홍보 동의를 받은 후기만 카드로 만들어집니다. 인스타·네이버·카카오 채널에 바로 올리세요.
      </p>

    </AppShell>
  );
}
