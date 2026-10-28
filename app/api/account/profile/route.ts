import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name =
    body &&
    typeof body === "object" &&
    "name" in body &&
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { message: "Name must be between 2 and 80 characters." },
      { status: 400 },
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }

  const avatarUrl =
    typeof user.user_metadata.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : typeof user.user_metadata.picture === "string"
        ? user.user_metadata.picture
        : null;

  try {
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
        name,
        avatarUrl,
      },
    });

    const { error: metadataError } = await supabase.auth.updateUser({
      data: { full_name: name, name },
    });

    if (metadataError) {
      console.error("Supabase profile metadata update failed:", metadataError.code);
    }

    return NextResponse.json({ name });
  } catch (error) {
    console.error("Profile update failed:", error);
    return NextResponse.json(
      { message: "Your profile could not be updated. Please try again." },
      { status: 500 },
    );
  }
}
