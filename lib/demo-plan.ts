export type DemoPlan = "Free" | "Pro";

export async function setDemoPlan(
  plan: DemoPlan,
  billingInterval: "monthly" | "yearly" = "monthly",
) {
  const response = await fetch("/api/account/plan", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, billingInterval }),
  });
  const result = (await response.json()) as {
    plan?: DemoPlan;
    message?: string;
  };

  if (!response.ok || !result.plan) {
    throw new Error(result.message ?? "The demo plan could not be updated.");
  }

  return result.plan;
}
