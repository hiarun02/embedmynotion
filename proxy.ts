import { NextResponse, type NextRequest } from "next/server";

import {
  getMisroutedOAuthCallbackUrl,
  hasPkceVerifierCookie,
} from "@/lib/oauth-callback";
import { getSiteUrl } from "@/lib/site-config";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const callbackUrl = getMisroutedOAuthCallbackUrl(request.url, {
    canonicalOrigin: getSiteUrl(),
    hasLocalPkceVerifier: hasPkceVerifierCookie(
      request.cookies.getAll().map(({ name }) => name),
    ),
  });

  if (callbackUrl) {
    return NextResponse.redirect(callbackUrl);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/auth/:path*",
    "/api/:path*",
    "/embed/:path*",
    "/notion-preview",
    {
      source: "/",
      has: [{ type: "query", key: "code" }],
    },
    {
      source: "/",
      has: [{ type: "query", key: "error" }],
    },
  ],
};
