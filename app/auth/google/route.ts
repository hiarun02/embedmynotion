import { NextResponse, type NextRequest } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { appUrl } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const loginUrl = appUrl("/login", request.url);
    loginUrl.searchParams.set("error", "config_missing");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const supabase = await createClient();
  const formData = await request.formData();
  const requestedNext = formData.get("next");
  const switchAccount = formData.get("switch_account") === "1";
  const next = safeRedirectPath(requestedNext, "/dashboard");
  const callbackUrl = appUrl("/auth/callback", request.url);
  if (next !== "/dashboard") callbackUrl.searchParams.set("next", next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: switchAccount ? { prompt: "select_account" } : undefined,
    },
  });

  if (error || !data.url) {
    const loginUrl = appUrl("/login", request.url);
    loginUrl.searchParams.set("error", "oauth_start_failed");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  return NextResponse.redirect(data.url, { status: 303 });
}
