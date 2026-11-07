import "server-only";

export function isDemoPlanEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.DEMO_PLAN_ENABLED !== "false"
  );
}
