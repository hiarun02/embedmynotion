import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { Logo } from "@/app/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to create and manage your Notion embeds.",
  robots: { index: false, follow: false, noarchive: true },
};

// Session cookies are request-time data, so this route intentionally blocks
// instead of being included in the prerendered shell.
export const instant = false;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.36l-3.25-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.93A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.63.39 3.17 1.04 4.55l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.5 3.82 1.49L18.7 4.55A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
      />
    </svg>
  );
}

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
    switch_account?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  config_missing:
    "Google sign-in is not configured yet. Add your Supabase project URL and publishable key to .env.local, then restart the app.",
  oauth_start_failed:
    "Google sign-in could not be started. Please try again.",
  oauth_callback_failed:
    "Google sign-in could not be completed. Please try again.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Supabase session validation depends on the current time and must only run
  // after a real request has reached this intentionally dynamic page.
  await connection();

  const params = await searchParams;
  const next = safeRedirectPath(params.next, "/dashboard");
  const configured = isSupabaseConfigured();
  const user = configured ? await getAuthenticatedUser() : null;
  if (user) {
    redirect(next);
  }

  const errorCode = configured ? params.error : "config_missing";
  const errorMessage = errorCode
    ? (errorMessages[errorCode] ?? errorMessages.oauth_callback_failed)
    : null;

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#f7f6f3] px-4 py-10 dark:bg-[#080808]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(35,131,226,0.09),transparent_38%)]" />

      <div className="relative w-full max-w-105">
        <Link
          href="/"
          aria-label="Back to Embed My Notion home"
          className="mb-8 flex justify-center"
        >
          <Logo />
        </Link>

        <Card className="gap-0 rounded-2xl bg-white py-0 ring-black/8 dark:bg-[#101010] dark:ring-white/12">
          <CardHeader className="gap-2 px-8 pt-9 pb-7 text-center max-sm:px-6">
            <CardTitle className="text-[26px] font-semibold tracking-[-0.04em]">
              Welcome to Embed My Notion
            </CardTitle>
            <CardDescription className="mx-auto max-w-75 leading-6">
              Sign in to create, customize, and manage your Notion embeds.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-9 max-sm:px-6">
            <form action="/auth/google" method="post">
              <input type="hidden" name="next" value={next} />
              {params.switch_account === "1" ? (
                <input type="hidden" name="switch_account" value="1" />
              ) : null}
              <Button
                type="submit"
                variant="outline"
                size="lg"
                disabled={!configured}
                className="h-11 w-full gap-3 rounded-lg border-[#d9d9d7] bg-white text-[14px] font-semibold shadow-xs hover:bg-[#f7f7f5] dark:border-white/15 dark:bg-[#151515] dark:hover:bg-[#202020]"
              >
                <GoogleIcon />
                Continue with Google
              </Button>
            </form>

            {errorMessage ? (
              <p
                role="alert"
                className="mt-4 text-center text-sm text-destructive"
              >
                {errorMessage}
              </p>
            ) : null}

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
              By continuing, you agree to use Embed My Notion responsibly.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your Notion pages stay yours. We only access what you choose to embed.
        </p>
      </div>
    </main>
  );
}
