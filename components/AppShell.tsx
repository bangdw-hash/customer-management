"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, MessageSquareText, Settings, Mic } from "lucide-react";

const tabs = [
  { href: "/", label: "홈", icon: Home },
  { href: "/schedule", label: "일정", icon: Calendar },
  { href: "/clients", label: "고객", icon: Users },
  { href: "/messages", label: "메시지", icon: MessageSquareText },
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
  return (
    <div className="phone-frame pb-24">
      {title && (
        <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 px-5 py-4 backdrop-blur">
          <h1 className="text-lg font-extrabold tracking-tight text-ink-900">{title}</h1>
          {subtitle && <p className="text-xs text-ink-400">{subtitle}</p>}
        </header>
      )}

      <main className="px-4">{children}</main>

      {/* 이동 중 핵심 동작: 음성 피드백 빠른 등록 (플로팅 버튼) */}
      <Link
        href="/reports/new"
        className="recording fixed bottom-24 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-pink-500 text-white shadow-[0_8px_24px_-4px_rgba(124,58,237,0.7)] active:opacity-90"
        style={{ marginLeft: 150 }}
        aria-label="음성 피드백 등록"
      >
        <Mic size={24} />
      </Link>

      <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[460px] -translate-x-1/2 border-t border-ink-100 bg-white/95 backdrop-blur">
        <div className="grid grid-cols-5">
          {tabs.map((t) => {
            const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold ${
                  active ? "text-brand-600" : "text-ink-400"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
