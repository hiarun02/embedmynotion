type SubscriptionAccess = {
  plan: "FREE" | "PRO";
  status: string;
} | null | undefined;

export function hasProAccess(subscription: SubscriptionAccess) {
  return (
    subscription?.plan === "PRO" &&
    (subscription.status === "ACTIVE" || subscription.status === "TRIALING")
  );
}
