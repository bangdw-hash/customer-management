import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SYSTEM =
  "너는 따뜻하고 전문적인 퍼스널 트레이너야. 세션 메모를 바탕으로 고객이 동기부여를 느낄 수 있는 리포트를 작성해. " +
  "오늘의 세션 / 변화·성과 / 다음 목표 / 격려를 포함하고, 친근한 존댓말과 적절한 이모지를 사용해. 군더더기 없이 5~9문장.";

function fallback(clientName: string, transcript: string, remaining?: number) {
  return (
    `${clientName}님, 오늘도 수고 많으셨어요! 💪\n\n` +
    `[오늘의 세션]\n- ${transcript || "오늘 진행한 운동을 잘 소화하셨어요."}\n\n` +
    `[다음 목표]\n- 다음 세션에서 강도를 한 단계 올려봐요.\n\n` +
    (remaining != null ? `잔여 ${remaining}회 남았어요. 지금 흐름이 정말 좋아요, 끝까지 함께 가요! 😊` : "끝까지 함께 가요! 😊")
  );
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const clientName = b?.clientName ?? "회원";
  const transcript = b?.transcript ?? "";
  const remaining = b?.remainingSessions;
  // 키 우선순위: 관리자에서 전달한 키 > 서버 환경변수
  const apiKey = b?.apiKey || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ report: fallback(clientName, transcript, remaining), source: "template" });
  }

  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: b?.model || "claude-sonnet-4-6",
      max_tokens: 900,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content:
            `고객 이름: ${clientName}\n` +
            (remaining != null ? `잔여 세션: ${remaining}회\n` : "") +
            `세션 메모(음성 받아쓰기): ${transcript}\n\n` +
            `위 메모를 바탕으로 고객에게 보낼 PT 리포트를 작성해줘.`,
        },
      ],
    });
    const text = msg.content
      .map((blk) => (blk.type === "text" ? blk.text : ""))
      .join("")
      .trim();
    return Response.json({ report: text || fallback(clientName, transcript, remaining), source: "ai" });
  } catch (e) {
    // 키 오류/네트워크 등 → 템플릿 폴백 (서비스 중단 방지)
    return Response.json({
      report: fallback(clientName, transcript, remaining),
      source: "template",
      error: e instanceof Error ? e.message : "ai_error",
    });
  }
}
