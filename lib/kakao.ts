// 메시지 발송 어댑터 (카카오 알림talk/브랜드 메시지 · SMS 백업)
// 우선순위: ① Solapi(키 있으면 실발송) → ② MESSAGE_WEBHOOK_URL(범용 웹훅) → ③ 시뮬레이션(데모)
// 사업자 키 준비되면 환경변수만 넣으면 실제 발송됩니다.
import crypto from "crypto";

export type MessageChannel = "kakao_alimtalk" | "kakao_brand" | "sms";

export interface SendMessageInput {
  to: string; // 수신 번호
  channel?: MessageChannel;
  text: string;
  templateId?: string; // 알림톡 승인 템플릿 ID (정보성)
  variables?: Record<string, string>;
}

type SendResult = { ok: boolean; simulated: boolean; provider?: string; error?: string };

const onlyDigits = (s: string) => (s || "").replace(/[^0-9]/g, "");

// ① Solapi 실발송. 미설정이면 null 반환(다음 단계로 폴백).
async function sendViaSolapi(input: SendMessageInput): Promise<SendResult | null> {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_SENDER; // 등록된 발신번호
  const pfId = process.env.SOLAPI_PFID; // 카카오 채널 발신프로필 ID
  if (!apiKey || !apiSecret || !from) return null;

  const date = new Date().toISOString();
  const salt = crypto.randomBytes(32).toString("hex");
  const signature = crypto.createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  const authorization = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;

  const message: Record<string, unknown> = { to: onlyDigits(input.to), from: onlyDigits(from) };
  if (input.templateId && pfId) {
    // 알림톡(정보성, 승인 템플릿) — 실패 시 자동 SMS 대체
    message.kakaoOptions = {
      pfId,
      templateId: input.templateId,
      variables: input.variables ?? {},
      disableSms: false,
    };
  } else {
    // 템플릿 없는 자유 문구 → SMS/LMS 로 발송
    message.text = input.text;
  }

  try {
    const res = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authorization },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, simulated: false, provider: "solapi", error: `${res.status} ${body.slice(0, 160)}` };
    }
    return { ok: true, simulated: false, provider: "solapi" };
  } catch (e) {
    return { ok: false, simulated: false, provider: "solapi", error: e instanceof Error ? e.message : "solapi_error" };
  }
}

export async function sendMessage(input: SendMessageInput): Promise<SendResult> {
  // ① Solapi
  const solapi = await sendViaSolapi(input);
  if (solapi) return solapi;

  // ② 범용 웹훅(Make/자체 서버 등)
  const url = process.env.MESSAGE_WEBHOOK_URL;
  const key = process.env.MESSAGE_API_KEY;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
        body: JSON.stringify({
          channel: input.channel ?? "kakao_alimtalk",
          to: input.to,
          text: input.text,
          templateId: input.templateId,
          variables: input.variables ?? {},
        }),
      });
      return { ok: res.ok, simulated: false, provider: "webhook", error: res.ok ? undefined : `status ${res.status}` };
    } catch (e) {
      return { ok: false, simulated: false, provider: "webhook", error: e instanceof Error ? e.message : "send_error" };
    }
  }

  // ③ 데모: 시뮬레이션 성공
  return { ok: true, simulated: true };
}
