import "server-only";

import { cache } from "react";
import { connection } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const hasLandingSession = cache(async () => {
  await connection();

  if (!isSupabaseConfigured()) return false;
  return Boolean(await getAuthenticatedUser());
});
