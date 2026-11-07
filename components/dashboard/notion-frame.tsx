"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, FileText, Link2 } from "lucide-react";

import { LogoMark } from "@/app/components/Logo";
import {
  formatEmbedUpdatedAt,
  validNotionUrl,
  type Embed,
} from "@/lib/dashboard-model";
import { embedBackgroundValue } from "@/lib/embed-background";

type PreviewPageIcon =
  | { kind: "emoji"; value: string }
  | { kind: "image"; value: string };

export function NotionFrame({
  embed,
  previewPassword,
}: {
  embed: Embed;
  previewPassword?: string;
}) {
  const passwordInputId = useId();
  const [notionUrl, setNotionUrl] = useState(embed.notionUrl);
  const [fullPageHeight, setFullPageHeight] = useState(embed.height);
  const [pageIcon, setPageIcon] = useState<PreviewPageIcon | null>(null);
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlockedPasswordKey, setUnlockedPasswordKey] = useState<string | null>(
    null,
  );
  const [unlocking, setUnlocking] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const passwordKey = previewPassword
    ? `draft-password:${previewPassword}`
    : "saved-password";
  const passwordGateVisible =
    embed.passwordProtected && unlockedPasswordKey !== passwordKey;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPageIcon(null);
      setNotionUrl(embed.notionUrl);
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [embed.notionUrl]);

  useEffect(() => {
    const receivePageIcon = (event: MessageEvent<unknown>) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        typeof event.data !== "object" ||
        event.data === null
      ) {
        return;
      }

      const message = event.data as {
        type?: unknown;
        icon?: { kind?: unknown; value?: unknown } | null;
      };

      if (message.type !== "embedmynotion:page-icon") return;

      const icon = message.icon;
      if (
        icon &&
        (icon.kind === "emoji" || icon.kind === "image") &&
        typeof icon.value === "string" &&
        icon.value
      ) {
        setPageIcon({ kind: icon.kind, value: icon.value });
      } else {
        setPageIcon(null);
      }
    };

    window.addEventListener("message", receivePageIcon);
    return () => window.removeEventListener("message", receivePageIcon);
  }, []);

  async function unlockPreview() {
    setPasswordError("");

    if (passwordAttempt.length < 6) {
      setPasswordError("Enter at least 6 characters.");
      return;
    }

    if (previewPassword) {
      if (passwordAttempt !== previewPassword) {
        setPasswordError("That password is not correct.");
        return;
      }

      setPasswordAttempt("");
      setUnlockedPasswordKey(passwordKey);
      return;
    }

    if (!embed.id) {
      setPasswordError("Set a password in Security settings first.");
      return;
    }

    setUnlocking(true);
    try {
      const response = await fetch(
        `/api/embeds/${encodeURIComponent(embed.id)}/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwordAttempt }),
        },
      );
      const result = (await response.json()) as {
        unlocked?: boolean;
        message?: string;
      };

      if (!response.ok || !result.unlocked) {
        setPasswordError(result.message ?? "That password is not correct.");
        return;
      }

      setPasswordAttempt("");
      setUnlockedPasswordKey(passwordKey);
    } catch {
      setPasswordError("The password could not be checked. Try again.");
    } finally {
      setUnlocking(false);
    }
  }

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
  }, [
    embed.fullHeight,
    notionUrl,
    embed.theme,
    embed.font,
    embed.customCss,
    embed.customCssEnabled,
    embed.showTopBar,
    embed.showCoverImage,
    embed.showPageHeader,
  ]);

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
    font: embed.font,
    customCss: embed.customCssEnabled ? embed.customCss : "",
    customCssEnabled: embed.customCssEnabled ? "1" : "0",
    showTopBar: embed.showTopBar ? "1" : "0",
    showCoverImage: embed.showCoverImage ? "1" : "0",
    showPageHeader: embed.showPageHeader ? "1" : "0",
    fullHeight: embed.fullHeight ? "1" : "0",
  });

  const updatedLabel = formatEmbedUpdatedAt(embed.updatedAt);
  const hasBackgroundStyle = embed.backgroundStyle !== "none";

  return (
    <div
      className="notion-preview-card"
      style={{
        width: embed.fullWidth ? "100%" : embed.width,
        maxWidth: "100%",
      }}
    >
      <header className="notion-preview-header">
        <Link
          href="/dashboard/embeds"
          className="notion-preview-back"
          aria-label="Back to embeds"
        >
          <ArrowLeft />
        </Link>
        <span className="notion-preview-icon" aria-hidden="true">
          {pageIcon?.kind === "image" ? (
            // The URL has already been resolved by the same-origin Notion renderer.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pageIcon.value} alt="" />
          ) : pageIcon?.kind === "emoji" ? (
            <span className="notion-preview-icon-emoji">{pageIcon.value}</span>
          ) : (
            <FileText />
          )}
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
        className={`notion-preview-style-shell${
          hasBackgroundStyle ? " has-background-style" : ""
        }`}
        style={{
          background: embedBackgroundValue(embed.backgroundStyle),
          padding: hasBackgroundStyle ? "clamp(12px, 2vw, 22px)" : 0,
          borderRadius: hasBackgroundStyle ? embed.radius + 8 : 0,
        }}
      >
      <div
        className={`notion-preview-page-frame${
          passwordGateVisible ? " is-password-protected" : ""
        }`}
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
          aria-hidden={passwordGateVisible}
          tabIndex={passwordGateVisible ? -1 : undefined}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {passwordGateVisible ? (
          <div className="password-preview-gate">
            <section
              className="password-preview-card"
              aria-label="Password-protected embed preview"
            >
              <LogoMark className="password-preview-logo" />
              <h2>Password protected</h2>
              <p>Enter the password provided by the embed owner.</p>
              <div className="password-preview-fields">
                <label htmlFor={passwordInputId}>Password</label>
                <input
                  id={passwordInputId}
                  type="password"
                  value={passwordAttempt}
                  minLength={6}
                  maxLength={72}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  onChange={(event) => setPasswordAttempt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void unlockPreview();
                    }
                  }}
                />
                {passwordError ? (
                  <span className="password-preview-error" role="alert">
                    {passwordError}
                  </span>
                ) : null}
                <button
                  type="button"
                  disabled={unlocking}
                  onClick={() => void unlockPreview()}
                >
                  {unlocking ? "Checking…" : "Unlock embed"}
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </div>
      </div>
    </div>
  );
}
