import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// 브라우저에서 직접 Blob에 업로드하기 위한 토큰 발급 핸들러.
// BLOB_READ_WRITE_TOKEN 환경변수가 있어야 동작(없으면 업로드 실패 → 앱은 로컬 미리보기만).
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
        maximumSizeInBytes: 12 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        // 필요 시 업로드 완료 후처리
      },
    });
    return Response.json(json);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "upload_error" }, { status: 400 });
  }
}
