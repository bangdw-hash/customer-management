import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Repeaty — 트레이너 고객관리";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 카카오톡/SNS 링크 공유 시 보이는 미리보기 카드 (보라→핑크, 브랜드)
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          color: "white",
          backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #c026d3 55%, #ec4899 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.18)",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            R
          </div>
          <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "8px", opacity: 0.92 }}>
            REPEATY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
          <div style={{ fontSize: "82px", fontWeight: 800, lineHeight: 1.08 }}>Keep them</div>
          <div style={{ fontSize: "82px", fontWeight: 800, lineHeight: 1.08 }}>coming back.</div>
        </div>

        <div style={{ fontSize: "33px", marginTop: "34px", opacity: 0.92 }}>
          PT Client CRM · Schedule · AI Reports · Reviews
        </div>

        <div style={{ display: "flex", gap: "14px", marginTop: "30px" }}>
          {["Clients", "Booking", "AI Report", "Retention"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.16)",
                fontSize: "26px",
                fontWeight: 700,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
