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
    avatarColor: color("#10b981"),
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
    avatarColor: color("#8b5cf6"),
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

export const bookings: Booking[] = [
  { id: "b1", clientId: "c2", clientName: "이준호", date: "2026-06-12", start: "07:00", end: "08:00", status: "confirmed" },
  { id: "b2", clientId: "c1", clientName: "김서연", date: "2026-06-12", start: "10:00", end: "11:00", status: "confirmed" },
  { id: "b3", clientName: "신규(예약요청)", date: "2026-06-12", start: "19:00", end: "20:00", status: "requested" },
  { id: "b4", clientId: "c2", clientName: "이준호", date: "2026-06-13", start: "07:00", end: "08:00", status: "confirmed" },
];

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

export const messageJobs: MessageJob[] = [
  { id: "m1", clientId: "c3", clientName: "박지민", channel: "kakao", type: "reengage", scheduledAt: "2026-06-13 09:00", status: "scheduled", preview: "지민님, 요즘 야근으로 바쁘시죠? 컨디션 어떠세요? 10분 스트레칭 루틴 보내드려요 :)" },
  { id: "m2", clientId: "c3", clientName: "박지민", channel: "kakao", type: "birthday", scheduledAt: "2026-06-14 10:00", status: "scheduled", preview: "지민님 생일 축하드려요! 🎂 건강한 한 해 함께 만들어가요." },
  { id: "m3", clientId: "c1", clientName: "김서연", channel: "kakao", type: "birthday", scheduledAt: "2026-06-18 10:00", status: "scheduled", preview: "서연님 생일 축하드려요! 🎂" },
  { id: "m4", clientId: "c1", clientName: "김서연", channel: "kakao", type: "reminder", scheduledAt: "2026-06-12 08:00", status: "sent", preview: "오늘 10:00 PT 예약 알림이에요. 컨디션 체크하고 뵐게요!" },
];

export const trainer = {
  name: "강도현",
  title: "퍼스널 트레이닝",
  slug: "coach-dohyun",
  studio: "코어핏 스튜디오 (강남)",
  bookingUrl: "fitflow.app/book/coach-dohyun",
  intakeUrl: "fitflow.app/intake/coach-dohyun",
};

export const clientById = (id: string) => clients.find((c) => c.id === id);
export const reportsByClient = (id: string) => reports.filter((r) => r.clientId === id);

// 재등록 제안 대상: 잔여 세션 3회 이하 또는 종료(past)
export const reEnrollTargets = () =>
  clients.filter((c) => (c.status === "active" && c.remainingSessions <= 3) || c.status === "past");

export const atRiskClients = () => clients.filter((c) => c.status === "at-risk");

export const KRW = (n: number) => n.toLocaleString("ko-KR") + "원";
