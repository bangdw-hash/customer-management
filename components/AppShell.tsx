"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Home,
  Calendar,
  Users,
  MessageSquareText,
  Star,
  CreditCard,
  Settings,
  Mic,
} from "lucide-react";

// 모든 메뉴를 하단 탭에 노출 → 좌우 스와이프(가로 스크롤)로 탐색
const tabs = [
  { href: "/", label: "홈", icon: Home },
  { href: "/schedule", label: "일정", icon: Calendar },
  { href: "/clients", label: "고객", icon: Users },
  { href: "/messages", label: "메시지", icon: MessageSquareText },
  { href: "/reviews", label: "후기", icon: Star },
  { href: "/payments", label: "결제", icon: CreditCard },
  { href: "/admin", label: "관리", icon: Settings },
];

export default function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // 활성 탭이 보이도록 가로 스크롤 위치 자동 이동
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="phone-frame pb-28">
      {title && (
        <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 px-5 py-4 backdrop-blur">
          <h1 className="text-lg font-extrabold tracking-tight text-ink-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
        </header>
      )}

      <main className="px-4 pb-2">{children}</main>

      {/* 이동 중 핵심 동작: 음성 피드백 빠른 등록 (플로팅 버튼) */}
      <Link
        href="/reports/new"
        className="recording fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-pink-500 text-white shadow-[0_8px_24px_-4px_rgba(124,58,237,0.7)] active:opacity-90"
        aria-label="음성 피드백 등록"
      >
        <Mic size={24} />
      </Link>

      {/* 좌우 스와이프(가로 스크롤) 하단 탭바 */}
      <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[460px] -translate-x-1/2 border-t border-ink-100 bg-white/95 backdrop-blur">
        <div ref={navRef} className="no-scrollbar flex overflow-x-auto scroll-smooth">
          {tabs.map((t) => {
            const active = isActive(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                ref={active ? activeRef : undefined}
                className={`flex min-w-[76px] flex-col items-center gap-1 py-2.5 text-[10px] font-semibold ${
                  active ? "text-brand-600" : "text-ink-400"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {t.label}
              </Link>
            );
          })}
        </div>
        {/* 더 있음을 알리는 오른쪽 그라데이션 힌트 */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-white to-transparent" />
      </nav>
    </div>
  );
}
