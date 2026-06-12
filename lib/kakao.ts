// 메시지 발송 어댑터 (카카오 알림톡/브랜드 메시지 · SMS 백업)
// 환경변수 MESSAGE_WEBHOOK_URL 이 있으면 그 엔드포인트로 발송(발송대행사/Make/자체 서버 연결),
// 없으면 시뮬레이션(데모). → 사업자 키 준비되면 환경변수만 넣으면 실제 발송.

export type MessageChannel = "kakao_alimtalk" | "kakao_brand" | "sms";

export interface SendMessageInput {
  to: string; // 수신 번호 또는 식별자
  channel?: MessageChannel;
  text: string;
  templateId?: string; // 알림톡 승인 템플릿 ID
  variables?: Record<string, string>;
}

export async function sendMessage(
  input: SendMessageInput
): Promise<{ ok: boolean; simulated: boolean; error?: string }> {
  const url = process.env.MESSAGE_WEBHOOK_URL;
  const key = process.env.MESSAGE_API_KEY;
  if (!url) {
    // 데모: 실제 발송 대신 성공으로 시뮬레이션
    return { ok: true, simulated: true };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        channel: input.channel ?? "kakao_alimtalk",
        to: input.to,
        text: input.text,
        templateId: input.templateId,
        variables: input.variables ?? {},
      }),
    });
    if (!res.ok) return { ok: false, simulated: false, error: `status ${res.status}` };
    return { ok: true, simulated: false };
  } catch (e) {
    return { ok: false, simulated: false, error: e instanceof Error ? e.message : "send_error" };
  }
}
