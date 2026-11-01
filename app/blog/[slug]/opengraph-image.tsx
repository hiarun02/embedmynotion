import { ImageResponse } from "next/og";

import { getBlogPost } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const alt = "EmbedMyNotion practical guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const title = post?.title ?? "Notion embedding guide";
  const category = post?.category ?? "Guide";

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
          color: "#171411",
          background: "#fffaf7",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 580,
            height: 580,
            right: -120,
            top: -170,
            display: "flex",
            borderRadius: 999,
            background: "rgba(255, 100, 20, .13)",
          }}
        />
        <div
          style={{
            width: 1050,
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                background: "#171411",
                borderRadius: 9,
                fontSize: 27,
                fontWeight: 800,
              }}
            >
              e
            </div>
            <span style={{ fontSize: 24, fontWeight: 750 }}>{siteConfig.name} Journal</span>
          </div>
          <div style={{ maxWidth: 930, display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={{ color: "#ff6414", fontSize: 20, fontWeight: 750, letterSpacing: 2 }}>
              {category.toUpperCase()}
            </span>
            <div style={{ fontSize: 65, fontWeight: 800, letterSpacing: -3.5, lineHeight: 1.05 }}>
              {title}
            </div>
            <div style={{ color: "#756e68", fontSize: 25 }}>
              Practical guidance for better Notion embeds.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
