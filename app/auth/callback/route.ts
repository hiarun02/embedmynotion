import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function safeRedirectPath(value: string | null) {
  return value && /^\/(?!\/)/.test(value) ? value : "/dashboard";
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "config_missing");
    return NextResponse.redirect(loginUrl);
  }

  const code = request.nextUrl.searchParams.get("code");
  const next = safeRedirectPath(request.nextUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data, error: userError } = await supabase.auth.getUser();
      const user = data.user;

      if (!userError && user) {
        const name =
          typeof user.user_metadata.full_name === "string"
            ? user.user_metadata.full_name
            : typeof user.user_metadata.name === "string"
              ? user.user_metadata.name
              : null;
        const avatarUrl =
          typeof user.user_metadata.avatar_url === "string"
            ? user.user_metadata.avatar_url
            : typeof user.user_metadata.picture === "string"
              ? user.user_metadata.picture
              : null;

        await prisma.user.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            email: user.email,
            name,
            avatarUrl,
          },
          update: {
            email: user.email,
            avatarUrl,
          },
        });

        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "oauth_callback_failed");
  return NextResponse.redirect(loginUrl);
}
