"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import { embedCode, type Embed } from "@/lib/dashboard-model";

export function PageHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export async function copyCode(embed: Embed) {
  try {
    await navigator.clipboard.writeText(
      embedCode(embed, window.location.origin),
    );
    toast.success("Embed code copied");
  } catch {
    toast.error(
      "Clipboard access is unavailable. Copy the code from the editor instead.",
    );
  }
}
