import { Suspense } from "react";
import type { ReactNode } from "react";

import { hasLandingSession } from "@/lib/landing-session";

import { HeaderClient } from "./HeaderClient";

async function AuthenticatedHeader({ children }: { children: ReactNode }) {
  const isSignedIn = await hasLandingSession();

  return <HeaderClient isSignedIn={isSignedIn}>{children}</HeaderClient>;
}

export function Header({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<HeaderClient isSignedIn>{children}</HeaderClient>}>
      <AuthenticatedHeader>{children}</AuthenticatedHeader>
    </Suspense>
  );
}
