import assert from "node:assert/strict";
import test from "node:test";

import { absoluteUrl, appUrl, getSiteUrl } from "../lib/site-config.ts";

test("site URLs use and normalize the configured production origin", () => {
  const previousSiteUrl = process.env.SITE_URL;

  try {
    process.env.SITE_URL = "embedmynotion.com/some/path?preview=true";

    assert.equal(getSiteUrl(), "https://embedmynotion.com");
    assert.equal(absoluteUrl("/blog"), "https://embedmynotion.com/blog");
  } finally {
    if (previousSiteUrl === undefined) {
      delete process.env.SITE_URL;
    } else {
      process.env.SITE_URL = previousSiteUrl;
    }
  }
});

test("production app URLs never fall back to localhost", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousSiteUrl = process.env.SITE_URL;
  const previousProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const previousVercelUrl = process.env.VERCEL_URL;

  try {
    process.env.NODE_ENV = "production";
    process.env.SITE_URL = "http://localhost:3000";
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;

    assert.equal(getSiteUrl(), "https://embedmynotion.com");
    assert.equal(
      appUrl("/auth/callback", "http://localhost:3000/auth/google").toString(),
      "https://embedmynotion.com/auth/callback",
    );
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;

    if (previousSiteUrl === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previousSiteUrl;

    if (previousProductionUrl === undefined) {
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    } else {
      process.env.VERCEL_PROJECT_PRODUCTION_URL = previousProductionUrl;
    }

    if (previousVercelUrl === undefined) delete process.env.VERCEL_URL;
    else process.env.VERCEL_URL = previousVercelUrl;
  }
});
