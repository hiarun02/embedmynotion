import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { WorkspaceProvider } from "@/components/dashboard/store";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Toaster } from "@/components/ui/sonner";
import { prisma } from "@/lib/prisma";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { serializeEmbed } from "@/lib/dashboard-model";
import { isDemoPlanEnabled } from "@/lib/demo-mode";
import { hasProAccess } from "@/lib/subscription";
import "./dashboard.css";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false, noarchive: true },
};

function stringMetadata(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  await connection();

  if (!isSupabaseConfigured()) redirect("/login?error=config_missing");

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const authName =
    stringMetadata(user.user_metadata.full_name) ??
    stringMetadata(user.user_metadata.name);
  const authAvatar =
    stringMetadata(user.user_metadata.avatar_url) ??
    stringMetadata(user.user_metadata.picture);
  const email = user.email ?? "No email available";

  const provider =
    user.identities?.find((identity) => identity.provider === "google")
      ?.provider ?? stringMetadata(user.app_metadata.provider);

  const [storedProfile, embeds, subscription] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true, avatarUrl: true },
    }),
    prisma.embed.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
  ]);

  const hasProPlan = hasProAccess(subscription);

  return (
    <>
      <Toaster position="bottom-right" />
      <WorkspaceProvider
        initialWorkspace={{
          name:
            storedProfile?.name ??
            authName ??
            (email.includes("@") ? email.split("@")[0] : "Account"),
          email: storedProfile?.email ?? email,
          avatarUrl: storedProfile?.avatarUrl ?? authAvatar,
          authProvider: provider,
          plan: hasProPlan ? "Pro" : "Free",
          demoPlanEnabled: isDemoPlanEnabled(),
          embeds: embeds.map((embed) =>
            serializeEmbed(embed, { hasProAccess: hasProPlan }),
          ),
        }}
      >
        <DashboardShell>{children}</DashboardShell>
      </WorkspaceProvider>
    </>
  );
}
