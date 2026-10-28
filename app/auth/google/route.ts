import { NextResponse, type NextRequest } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "config_missing");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const supabase = await createClient();
  const callbackUrl = new URL("/auth/callback", request.url);
  callbackUrl.searchParams.set("next", "/dashboard");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error || !data.url) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "oauth_start_failed");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  return NextResponse.redirect(data.url, { status: 303 });
}
