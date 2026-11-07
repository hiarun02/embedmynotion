import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { LogoMark } from "@/app/components/Logo";
import { PublicPreview } from "@/components/dashboard/public-preview";
import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  embedAccessCookieName,
  verifyEmbedAccessToken,
} from "@/lib/embed-access";
import { normalizeNotionPageId, validUuid } from "@/lib/identifiers";
import { prisma } from "@/lib/prisma";
import { serializeEmbed } from "@/lib/dashboard-model";
import { loadAuthorizedNotionPage } from "@/lib/notion";
import { hasProAccess } from "@/lib/subscription";
import "@/app/dashboard/dashboard.css";

export const metadata: Metadata = {
  title: "Shared Notion embed",
  robots: { index: false, follow: false, noarchive: true },
};

async function loadPublicPage(notionUrl: string, pageId: string | null) {
  try {
    return {
      ok: true as const,
      recordMap: await loadAuthorizedNotionPage(notionUrl, pageId),
    };
  } catch {
    return { ok: false as const };
  }
}

function AccessShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="embed-access-page">
      <section className="embed-access-card">
        <LogoMark className="embed-access-logo" />
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </section>
    </main>
  );
}

async function Content({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ access_error?: string; page?: string | string[] }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const pageId = normalizeNotionPageId(query.page);
  if (!validUuid(id)) {
    return (
      <div className="empty-state">
        <h1>Embed unavailable</h1>
        <p>This embed is inactive or has been deleted.</p>
      </div>
    );
  }

  const embed = await prisma.embed.findFirst({
    where: { id, isActive: true },
  });

  if (!embed) {
    return (
      <div className="empty-state">
        <h1>Embed unavailable</h1>
        <p>This embed is inactive or has been deleted.</p>
      </div>
    );
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: embed.userId },
  });
  const hasProPlan = hasProAccess(subscription);

  if (hasProPlan && embed.emailAccess) {
    const user = await getAuthenticatedUser();
    const email = user?.email?.trim().toLowerCase();
    const allowed = email ? embed.allowedEmails.includes(email) : false;

    if (!allowed) {
      const next = `/embed/${encodeURIComponent(id)}${
        pageId ? `?page=${encodeURIComponent(pageId)}` : ""
      }`;
      const switchAccountNext = `/login?next=${encodeURIComponent(next)}&switch_account=1`;
      return (
        <AccessShell
          title="Email access required"
          description={
            user
              ? `You are signed in as ${email ?? "an unknown account"}. This account is not on the allowed list.`
              : "Sign in with an approved email address to view this embed."
          }
        >
          {user ? (
            <div className="embed-access-actions">
              <form
                action="/auth/signout"
                method="post"
                target="_blank"
              >
                <input type="hidden" name="next" value={switchAccountNext} />
                <button className="embed-access-button" type="submit">
                  Use another Google account
                </button>
              </form>
              <Link className="embed-access-button secondary" href="/">
                Return home
              </Link>
            </div>
          ) : (
            <Link
              className="embed-access-button"
              href={`/login?next=${encodeURIComponent(next)}`}
              target="_blank"
            >
              Sign in with Google
            </Link>
          )}
        </AccessShell>
      );
    }
  }

  if (hasProPlan && embed.passwordHash) {
    const cookieStore = await cookies();
    const unlocked = verifyEmbedAccessToken(
      cookieStore.get(embedAccessCookieName(id))?.value,
      id,
      embed.passwordHash,
    );

    if (!unlocked) {
      return (
        <AccessShell
          title="Password protected"
          description="Enter the password provided by the embed owner."
        >
          <form
            className="embed-access-form"
            action={`/embed/${id}/unlock`}
            method="post"
          >
            {pageId ? <input type="hidden" name="page" value={pageId} /> : null}
            <label htmlFor="embed-password">Password</label>
            <input
              id="embed-password"
              name="password"
              type="password"
              minLength={6}
              autoComplete="current-password"
              required
            />
            {query.access_error === "password" ? (
              <span role="alert">That password is not correct.</span>
            ) : null}
            {query.access_error === "rate_limited" ? (
              <span role="alert">
                Too many attempts. Wait 15 minutes before trying again.
              </span>
            ) : null}
            <button type="submit">Unlock embed</button>
          </form>
        </AccessShell>
      );
    }
  }

  const result = await loadPublicPage(embed.notionUrl, pageId);

  if (result.ok) {
    return (
      <PublicPreview
        embed={serializeEmbed(embed, {
          hasProAccess: hasProPlan,
        })}
        recordMap={result.recordMap}
        pageUrlPrefix={`/embed/${encodeURIComponent(id)}?page=`}
      />
    );
  }

  return (
    <div className="notion-load-error">
      <h1>Notion page unavailable</h1>
      <p>Make sure the original Notion page is still published.</p>
    </div>
  );
}
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ access_error?: string; page?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<p>Loading embed…</p>}>
      <Content params={params} searchParams={searchParams} />
    </Suspense>
  );
}
