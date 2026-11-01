import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const alt = "EmbedMyNotion — responsive Notion embeds for any website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          color: "#161412",
          background: "#fffaf7",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 32,
            display: "flex",
            border: "1px solid #eadfd8",
            borderRadius: 28,
            background: "#ffffff",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 33,
            right: 33,
            bottom: 33,
            width: 320,
            display: "flex",
            background:
              "linear-gradient(145deg, rgba(255,100,20,.16), rgba(255,250,247,.2))",
            borderTopRightRadius: 27,
            borderBottomRightRadius: 27,
          }}
        />
        <div
          style={{
            position: "relative",
            width: 1030,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div
              style={{
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                background: "#161412",
                borderRadius: 10,
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              e
            </div>
            <span style={{ fontSize: 27, fontWeight: 750 }}>{siteConfig.name}</span>
          </div>
          <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 18 }}>
            <span style={{ color: "#ff6414", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
              NOTION PAGES, READY FOR YOUR WEBSITE
            </span>
            <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -4, lineHeight: 1.02 }}>
              Embed your Notion pages anywhere.
            </div>
            <div style={{ maxWidth: 760, color: "#6f6964", fontSize: 27, lineHeight: 1.35 }}>
              Responsive embeds with themes, layout controls, and secure access.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
