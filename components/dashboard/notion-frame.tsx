"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock3, FileText, Link2 } from "lucide-react";

import { validNotionUrl, type Embed } from "@/lib/dashboard-model";

export function NotionFrame({ embed }: { embed: Embed }) {
  const [notionUrl, setNotionUrl] = useState(embed.notionUrl);
  const [fullPageHeight, setFullPageHeight] = useState(embed.height);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setNotionUrl(embed.notionUrl), 650);
    return () => window.clearTimeout(timeout);
  }, [embed.notionUrl]);

  useEffect(() => {
    if (!embed.fullHeight) return;

    const frame = frameRef.current;
    if (!frame) return;

    let observer: ResizeObserver | null = null;
    let animationFrame = 0;

    const measure = () => {
      const document = frame.contentDocument;
      if (!document) return;

      const renderedPage = document.querySelector<HTMLElement>(".notion-app");

      const nextHeight = Math.ceil(
        renderedPage?.scrollHeight ?? document.body?.scrollHeight ?? 0,
      );

      if (nextHeight > 0) {
        setFullPageHeight((current) =>
          Math.abs(current - nextHeight) > 1 ? nextHeight : current,
        );
      }
    };

    const observeDocument = () => {
      observer?.disconnect();
      const document = frame.contentDocument;
      if (!document) return;

      measure();
      observer = new ResizeObserver(measure);
      observer.observe(document.documentElement);
      if (document.body) observer.observe(document.body);
    };

    const handleLoad = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(observeDocument);
    };

    frame.addEventListener("load", handleLoad);
    if (frame.contentDocument?.readyState === "complete") handleLoad();

    return () => {
      frame.removeEventListener("load", handleLoad);
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
    };
  }, [embed.fullHeight, notionUrl, embed.theme]);

  if (!validNotionUrl(notionUrl)) {
    return (
      <div className="notion-frame-empty">
        Paste a published Notion page URL to load its live preview.
      </div>
    );
  }

  const params = new URLSearchParams({
    url: notionUrl,
    theme: embed.theme,
    fullHeight: embed.fullHeight ? "1" : "0",
  });

  const updatedAt = embed.updatedAt ? new Date(embed.updatedAt) : null;
  const updatedLabel =
    updatedAt && !Number.isNaN(updatedAt.getTime())
      ? new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(updatedAt)
      : "Unsaved preview";

  return (
    <div
      className="notion-preview-card"
      style={{
        width: embed.fullWidth ? "100%" : embed.width,
        maxWidth: "100%",
      }}
    >
      <header className="notion-preview-header">
        <span className="notion-preview-back" aria-hidden="true">
          <ArrowLeft />
        </span>
        <span className="notion-preview-icon" aria-hidden="true">
          <FileText />
        </span>
        <div className="notion-preview-identity">
          <strong>{embed.title.trim() || "Untitled embed"}</strong>
          <a href={notionUrl} target="_blank" rel="noreferrer">
            <Link2 />
            <span>{notionUrl}</span>
          </a>
        </div>
        <div className="notion-preview-meta">
          <span>Last updated {updatedLabel}</span>
          <span>
            <Clock3 />
            {embed.active ? "Active embed" : "Inactive embed"}
          </span>
        </div>
      </header>
      <div
        className="notion-preview-page-frame"
        style={{
          border: embed.border
            ? `${embed.borderWidth}px solid ${embed.borderColor}`
            : "none",
          borderRadius: embed.radius,
        }}
      >
        <iframe
          ref={frameRef}
          className="notion-live-frame"
          src={`/notion-preview?${params.toString()}`}
          title={`Live preview of ${embed.title || "Notion page"}`}
          style={{ height: embed.fullHeight ? fullPageHeight : embed.height }}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
