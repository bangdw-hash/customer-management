import type { Metadata, Viewport } from "next";
import "./globals.css";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://customer-management-tau.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "리피티(Repeaty) — 트레이너 고객관리",
  description: "고객이 다시 찾는 이유. 헬스 트레이너를 위한 일정·피드백·재등록 관리 도구",
  manifest: "/manifest.json",
  applicationName: "리피티",
  appleWebApp: { capable: true, title: "리피티", statusBarStyle: "default" },
  openGraph: {
    title: "리피티(Repeaty) — 트레이너 고객관리",
    description: "고객이 다시 찾는 이유. 일정·AI 피드백·재등록을 한 곳에서.",
    siteName: "리피티(Repeaty)",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
