import assert from "node:assert/strict";
import test from "node:test";

import {
  getMisroutedOAuthCallbackUrl,
  hasPkceVerifierCookie,
} from "../lib/oauth-callback.ts";

test("recovers a production OAuth code that Supabase sent to localhost", () => {
  const callbackUrl = getMisroutedOAuthCallbackUrl(
    "http://localhost:3000/?code=oauth-code",
    { canonicalOrigin: "https://embedmynotion.com" },
  );

  assert.equal(
    callbackUrl?.toString(),
    "https://embedmynotion.com/auth/callback?code=oauth-code",
  );
});

test("keeps a genuine local OAuth flow on localhost when its verifier exists", () => {
  const callbackUrl = getMisroutedOAuthCallbackUrl(
    "http://localhost:3000/?code=local-code",
    {
      canonicalOrigin: "https://embedmynotion.com",
      hasLocalPkceVerifier: true,
    },
  );

  assert.equal(
    callbackUrl?.toString(),
    "http://localhost:3000/auth/callback?code=local-code",
  );
});

test("forwards only OAuth callback parameters", () => {
  const callbackUrl = getMisroutedOAuthCallbackUrl(
    "https://embedmynotion.com/?error=access_denied&error_description=Denied&unsafe=value",
    { canonicalOrigin: "https://embedmynotion.com" },
  );

  assert.equal(
    callbackUrl?.toString(),
    "https://embedmynotion.com/auth/callback?error=access_denied&error_description=Denied",
  );
});

test("does not redirect ordinary homepage requests", () => {
  assert.equal(
    getMisroutedOAuthCallbackUrl("https://embedmynotion.com/", {
      canonicalOrigin: "https://embedmynotion.com",
    }),
    null,
  );
});

test("detects Supabase PKCE verifier cookies", () => {
  assert.equal(
    hasPkceVerifierCookie([
      "theme",
      "sb-project-flow-flowId123-code-verifier",
    ]),
    true,
  );
  assert.equal(hasPkceVerifierCookie(["theme", "session"]), false);
});
