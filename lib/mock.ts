// 데모용 목 데이터 + 타입. 백엔드 연동 전 프론트엔드 동작 확인용.
// 모든 화면이 이 데이터를 공유합니다.

export type ClientStatus = "active" | "at-risk" | "past";

export interface Measurement {
  date: string; // YYYY-MM-DD
  weight: number; // kg
  bodyFat: number; // %
  muscle: number; // kg
}

export interface Report {
  id: string;
  clientId: string;
  date: string;
  title: string;
  body: string;
  // 발송 상태
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: string;
  channel?: "kakao" | "sms" | "email";
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  grad: [string, string]; // 네온 글로우 아바타용 그라데이션 (고객별 상이)
  photoUrl?: string; // 프로필/명함 사진 (Vercel Blob URL)
  goal: string;
  status: ClientStatus;
  joinedAt: string;
  birthday?: string; // MM-DD
  anniversary?: string; // 등록 기념일 등
  remainingSessions: number;
  totalSessions: number;
  lastVisit: string; // YYYY-MM-DD
  note?: string;
  measurements: Measurement[];
}

export interface Booking {
  id: string;
  clientId?: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string;
  status: "confirmed" | "requested" | "done" | "no-show";
}

export interface MessageJob {
  id: string;
  clientId: string;
  clientName: string;
  channel: "kakao" | "sms" | "email";
  type: "report" | "reminder" | "birthday" | "reengage" | "care";
  scheduledAt: string;
  status: "scheduled" | "sent" | "failed";
  preview: string;
}

const color = (c: string) => c;

export const clients: Client[] = [
  {
    id: "c1",
    name: "김서연",
    phone: "010-2345-6789",
    avatarColor: color("#8b5cf6"),
    grad: ["#a855f7", "#ec4899"], // 바이올렛 → 핑크
    goal: "체지방 감량 -5kg",
    status: "active",
    joinedAt: "2026-01-10",
    birthday: "06-18",
    anniversary: "2026-01-10",
    remainingSessions: 3,
    totalSessions: 20,
    lastVisit: "2026-06-10",
    note: "무릎 통증 이력 있음. 하체는 저충격 위주.",
    measurements: [
      { date: "2026-01-10", weight: 64.2, bodyFat: 31.0, muscle: 22.1 },
      { date: "2026-03-10", weight: 61.0, bodyFat: 27.5, muscle: 23.4 },
      { date: "2026-05-10", weight: 58.8, bodyFat: 24.2, muscle: 24.0 },
    ],
  },
  {
    id: "c2",
    name: "이준호",
    phone: "010-8765-4321",
    avatarColor: color("#0ea5e9"),
    grad: ["#06b6d4", "#3b82f6"], // 시안 → 블루
    goal: "근비대 / 벤치 100kg",
    status: "active",
    joinedAt: "2025-11-02",
    birthday: "09-03",
    anniversary: "2025-11-02",
    remainingSessions: 12,
    totalSessions: 30,
    lastVisit: "2026-06-11",
    note: "운동 경력 2년. 고강도 선호.",
    measurements: [
      { date: "2025-11-02", weight: 72.0, bodyFat: 18.0, muscle: 33.0 },
      { date: "2026-02-02", weight: 75.5, bodyFat: 16.2, muscle: 36.1 },
      { date: "2026-05-02", weight: 78.0, bodyFat: 15.0, muscle: 38.4 },
    ],
  },
  {
    id: "c3",
    name: "박지민",
    phone: "010-1122-3344",
    avatarColor: color("#f59e0b"),
    grad: ["#f59e0b", "#f43f5e"], // 앰버 → 로즈
    goal: "체형 교정 / 거북목",
    status: "at-risk",
    joinedAt: "2026-02-20",
    birthday: "06-14",
    anniversary: "2026-02-20",
    remainingSessions: 2,
    totalSessions: 16,
    lastVisit: "2026-05-28",
    note: "최근 2주 미방문. 야근으로 시간 부족 호소.",
    measurements: [
      { date: "2026-02-20", weight: 55.0, bodyFat: 26.0, muscle: 19.5 },
      { date: "2026-04-20", weight: 54.0, bodyFat: 24.5, muscle: 20.2 },
    ],
  },
  {
    id: "c4",
    name: "최민재",
    phone: "010-5566-7788",
    avatarColor: color("#10b981"),
    grad: ["#10b981", "#22d3ee"], // 에메랄드 → 시안
    goal: "다이어트 유지",
    status: "past",
    joinedAt: "2025-06-01",
    birthday: "12-25",
    anniversary: "2025-06-01",
    remainingSessions: 0,
    totalSessions: 24,
    lastVisit: "2026-02-15",
    note: "이전 24회 수료. 재등록 제안 대상.",
    measurements: [
      { date: "2025-06-01", weight: 88.0, bodyFat: 28.0, muscle: 34.0 },
      { date: "2025-12-01", weight: 79.0, bodyFat: 21.0, muscle: 35.5 },
    ],
  },
];

// ===== 현재 날짜/시간 유틸 (접속 시점 기준으로 동작) =====
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const formatKDate = (d: Date) =>
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일`;
export const formatKShort = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
export const formatKTime = (d: Date) => {
  const h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hh}:${pad(d.getMinutes())}`;
};
export const greetingFor = (d: Date) => {
  const h = d.getHours();
  if (h < 6) return "늦은 시간이네요";
  if (h < 12) return "좋은 아침이에요";
  if (h < 18) return "좋은 오후예요";
  return "좋은 저녁이에요";
};

// 접속한 "오늘"을 기준으로 오늘/내일 예약을 생성
export function getBookings(now: Date): Booking[] {
  const today = toISODate(now);
  const tomorrow = toISODate(addDays(now, 1));
  return [
    { id: "b1", clientId: "c2", clientName: "이준호", date: today, start: "07:00", end: "08:00", status: "confirmed" },
    { id: "b2", clientId: "c1", clientName: "김서연", date: today, start: "10:00", end: "11:00", status: "confirmed" },
    { id: "b3", clientName: "신규(예약요청)", date: today, start: "19:00", end: "20:00", status: "requested" },
    { id: "b4", clientId: "c2", clientName: "이준호", date: tomorrow, start: "07:00", end: "08:00", status: "confirmed" },
  ];
}

// 고객 예약 화면에 노출할 날짜(오늘부터 며칠) + 가능 슬롯
const SLOT_SETS = [
  ["13:00", "14:00", "16:00", "20:00", "21:00"],
  ["09:00", "11:00", "15:00", "17:00"],
  ["07:00", "10:00", "12:00", "18:00", "19:00"],
  ["08:00", "13:00", "14:00", "20:00"],
];
export function getBookingDates(now: Date) {
  return [0, 1, 3, 4].map((off, i) => {
    const d = addDays(now, off);
    return { key: toISODate(d), label: `${d.getMonth() + 1}/${d.getDate()}`, day: WEEKDAYS[d.getDay()], slots: SLOT_SETS[i] };
  });
}

export const reports: Report[] = [
  {
    id: "r1",
    clientId: "c1",
    date: "2026-06-10",
    title: "6월 2주차 PT 리포트 — 김서연님",
    status: "sent",
    channel: "kakao",
    body:
      "오늘도 수고하셨어요 서연님! 💪\n\n[오늘의 세션]\n- 하체 저충격 루틴(무릎 보호) + 코어 안정화\n- 스쿼트 자세가 지난주 대비 확연히 안정적이었어요.\n\n[변화]\n- 체지방 31.0% → 24.2% (-6.8%p)\n- 근육량 +1.9kg\n\n[다음 목표]\n- 다음 2주는 유산소 인터벌 추가로 -2kg 추가 감량을 노려봐요.\n\n잔여 3회 남았어요. 흐름이 정말 좋아서 지금 멈추기 아까운 시점이에요!",
  },
  {
    id: "r2",
    clientId: "c2",
    date: "2026-06-11",
    title: "벤치 PR 갱신 리포트 — 이준호님",
    status: "sent",
    channel: "kakao",
    body:
      "준호님 오늘 벤치 92.5kg 성공! 🎉 100kg 가시권입니다.\n\n[포커스]\n- 가슴 상부 보강 / 트라이셉스 락아웃\n[다음 세션]\n- 디로드 후 95kg 도전",
  },
];

// 접속한 "오늘"을 기준으로 예약 발송 메시지를 생성
export function getMessageJobs(now: Date): MessageJob[] {
  const at = (off: number, hm: string) => `${toISODate(addDays(now, off))} ${hm}`;
  return [
    { id: "m1", clientId: "c3", clientName: "박지민", channel: "kakao", type: "reengage", scheduledAt: at(1, "09:00"), status: "scheduled", preview: "지민님, 요즘 야근으로 바쁘시죠? 컨디션 어떠세요? 10분 스트레칭 루틴 보내드려요 :)" },
    { id: "m2", clientId: "c3", clientName: "박지민", channel: "kakao", type: "birthday", scheduledAt: at(2, "10:00"), status: "scheduled", preview: "지민님 생일 축하드려요! 🎂 건강한 한 해 함께 만들어가요." },
    { id: "m3", clientId: "c1", clientName: "김서연", channel: "kakao", type: "birthday", scheduledAt: at(6, "10:00"), status: "scheduled", preview: "서연님 생일 축하드려요! 🎂" },
    { id: "m4", clientId: "c1", clientName: "김서연", channel: "kakao", type: "reminder", scheduledAt: at(0, "08:00"), status: "sent", preview: "오늘 10:00 PT 예약 알림이에요. 컨디션 체크하고 뵐게요!" },
  ];
}

export const trainer = {
  name: "김민지",
  honorific: "프로", // "프로님"으로 호칭
  title: "퍼스널 트레이닝",
  slug: "pro-minji",
  studio: "코어핏 스튜디오 (강남)",
  bookingUrl: "repeaty.app/book/pro-minji",
  intakeUrl: "repeaty.app/intake/pro-minji",
};

export const clientById = (id: string) => clients.find((c) => c.id === id);
export const reportsByClient = (id: string) => reports.filter((r) => r.clientId === id);

// 재등록 제안 대상: 잔여 세션 3회 이하 또는 종료(past)
export const reEnrollTargets = () =>
  clients.filter((c) => (c.status === "active" && c.remainingSessions <= 3) || c.status === "past");

export const atRiskClients = () => clients.filter((c) => c.status === "at-risk");

export const KRW = (n: number) => n.toLocaleString("ko-KR") + "원";

// ===== 결제 기록 (현장 결제 → 기록 + 고객 공동 확인) =====
export interface Payment {
  id: string;
  clientId: string;
  date: string;
  amount: number;
  method: "현장카드" | "현금" | "계좌이체";
  item: string;
  sessionsAdded: number;
  confirmedByClient: boolean; // 고객이 링크로 확인했는지
}

export const payments: Payment[] = [
  { id: "p1", clientId: "c1", date: "2026-01-10", amount: 1200000, method: "현장카드", item: "20회권", sessionsAdded: 20, confirmedByClient: true },
  { id: "p2", clientId: "c2", date: "2025-11-02", amount: 1650000, method: "계좌이체", item: "30회권", sessionsAdded: 30, confirmedByClient: true },
  { id: "p3", clientId: "c3", date: "2026-02-20", amount: 980000, method: "현금", item: "16회권", sessionsAdded: 16, confirmedByClient: false },
];

export const paymentsByClient = (id: string) => payments.filter((p) => p.clientId === id);
export const unconfirmedPayments = () => payments.filter((p) => !p.confirmedByClient);

// ===== 고객 리뷰 (자연스러운 유도 → 마케팅 소스) =====
export interface Review {
  id: string;
  clientId: string;
  rating: number; // 1~5
  text: string;
  date: string;
  consentMarketing: boolean; // 홍보 사용 동의
  beforeAfter?: boolean; // 비포/애프터 첨부 여부
  photoUrl?: string; // 첨부 사진 (Vercel Blob URL)
}

export const reviews: Review[] = [
  { id: "rv1", clientId: "c1", rating: 5, date: "2026-05-12", consentMarketing: true, beforeAfter: true, text: "3개월 만에 체지방 7%나 빠졌어요! 무릎 통증 걱정했는데 매번 제 컨디션 체크하고 운동 짜주셔서 너무 든든했어요. 김민지 프로님 강추합니다 💪" },
  { id: "rv2", clientId: "c2", rating: 5, date: "2026-04-30", consentMarketing: true, beforeAfter: false, text: "벤치 60kg에서 92kg까지! 자세 하나하나 잡아주시고 목표를 같이 세워주셔서 운동이 재밌어졌어요." },
  { id: "rv3", clientId: "c4", rating: 4, date: "2026-02-15", consentMarketing: false, beforeAfter: true, text: "24회 동안 9kg 감량 성공. 식단까지 꼼꼼히 봐주셨어요. 감사합니다!" },
];

export const reviewsByClient = (id: string) => reviews.filter((r) => r.clientId === id);
export const marketingReviews = () => reviews.filter((r) => r.consentMarketing);
// 리뷰 요청 적기: 성과 좋고 아직 리뷰 없는 활성 고객
export const reviewRequestTargets = () =>
  clients.filter((c) => c.status === "active" && reviewsByClient(c.id).length === 0);
