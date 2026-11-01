import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function safeRedirectPath(value: FormDataEntryValue | null) {
  return typeof value === "string" && /^\/(?!\/)/.test(value) ? value : "/";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const next = safeRedirectPath(formData.get("next"));

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL(next, request.url), { status: 303 });
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    await supabase.auth.signOut({ scope: "local" });
  }

  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL(next, request.url), { status: 303 });
}
