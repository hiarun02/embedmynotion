import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type PasswordBody = {
  password?: unknown;
  nonce?: unknown;
};

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }

  let body: PasswordBody;
  try {
    body = (await request.json()) as PasswordBody;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  const nonce = typeof body.nonce === "string" ? body.nonce.trim() : "";

  if (password.length < 8 || password.length > 72) {
    return NextResponse.json(
      { message: "Password must be between 8 and 72 characters." },
      { status: 400 },
    );
  }

  const { error } = await supabase.auth.updateUser({
    password,
    ...(nonce ? { nonce } : {}),
  });

  if (!error) {
    return NextResponse.json({ updated: true });
  }

  if (error.code === "reauthentication_needed") {
    const { error: reauthError } = await supabase.auth.reauthenticate();
    if (!reauthError) {
      return NextResponse.json(
        {
          code: "reauth_required",
          message: "Enter the verification code sent to your email.",
        },
        { status: 409 },
      );
    }
  }

  if (
    error.code === "reauth_nonce_missing" ||
    error.code === "reauthentication_not_valid"
  ) {
    return NextResponse.json(
      { code: "invalid_nonce", message: "That verification code is not valid." },
      { status: 400 },
    );
  }

  const message =
    error.code === "weak_password"
      ? "Choose a stronger password."
      : "Your password could not be updated. Please try again.";

  return NextResponse.json({ message }, { status: 400 });
}
