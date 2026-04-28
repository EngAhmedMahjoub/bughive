import { ImageResponse } from "next/og";

export const alt = "Bug Hive - Issue Tracking Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a0a00 0%, #7c2d12 50%, #d97706 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 90,
            marginBottom: 16,
          }}
        >
          🐝
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: "-2px",
          }}
        >
          Bug Hive
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#fde68a",
            marginTop: 16,
            opacity: 0.9,
          }}
        >
          Collaborative Issue &amp; Bug Tracking
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
