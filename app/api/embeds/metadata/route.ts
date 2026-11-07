import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { validNotionUrl } from "@/lib/dashboard-model";
import { loadNotionPageMetadata } from "@/lib/notion";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { message: "Please sign in again." },
      { status: 401 },
    );
  }

  const notionUrl = new URL(request.url).searchParams.get("url")?.trim() ?? "";
  if (!validNotionUrl(notionUrl)) {
    return NextResponse.json(
      { message: "Enter a public Notion page URL." },
      { status: 400 },
    );
  }

  try {
    const metadata = await loadNotionPageMetadata(notionUrl);
    if (!metadata.title) {
      return NextResponse.json(
        { message: "This Notion page does not have a readable title." },
        { status: 422 },
      );
    }

    return NextResponse.json(metadata, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Notion page metadata load failed:", error);
    return NextResponse.json(
      {
        message:
          "We could not read this page. Confirm it is published, then try again.",
      },
      { status: 422 },
    );
  }
}
