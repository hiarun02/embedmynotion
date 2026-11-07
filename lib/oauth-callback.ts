const CALLBACK_QUERY_KEYS = [
  "code",
  "error",
  "error_code",
  "error_description",
  "next",
] as const;

function isLoopbackHostname(hostname: string) {
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  );
}

export function hasPkceVerifierCookie(cookieNames: Iterable<string>) {
  return Array.from(cookieNames).some((name) => name.endsWith("-code-verifier"));
}

export function getMisroutedOAuthCallbackUrl(
  requestUrl: string | URL,
  options: {
    hasLocalPkceVerifier?: boolean;
    canonicalOrigin: string;
  },
) {
  const sourceUrl = new URL(requestUrl);
  const hasOAuthResult =
    sourceUrl.searchParams.has("code") || sourceUrl.searchParams.has("error");

  if (sourceUrl.pathname !== "/" || !hasOAuthResult) return null;

  const shouldUseLocalOrigin =
    isLoopbackHostname(sourceUrl.hostname) && options.hasLocalPkceVerifier;
  const targetOrigin = shouldUseLocalOrigin
    ? sourceUrl.origin
    : options.canonicalOrigin;
  const callbackUrl = new URL("/auth/callback", `${targetOrigin}/`);

  for (const key of CALLBACK_QUERY_KEYS) {
    for (const value of sourceUrl.searchParams.getAll(key)) {
      callbackUrl.searchParams.append(key, value);
    }
  }

  return callbackUrl;
}
