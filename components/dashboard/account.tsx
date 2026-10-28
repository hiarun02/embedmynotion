"use client";
import { useState, type FormEvent } from "react";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWorkspace } from "./store";
import { PageHeading, UpgradeDialog } from "./dashboard";
export function BillingPage() {
  const { workspace, update } = useWorkspace();
  const [yearly, setYearly] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  return (
    <>
      <PageHeading
        title="Plans & billing"
        subtitle="Start small. Make room for what’s next."
      />
      <Card className="settings-panel current-plan">
        <div className="flex justify-between gap-4">
          <div>
            <h2>Your workspace is on {workspace.plan}</h2>
            <p>
              {workspace.plan === "Free"
                ? "Everything you need to get your first embed out there."
                : "More space to bring your ideas to life. Demo only — no subscription."}
            </p>
          </div>
          <Badge variant="secondary">{workspace.plan} plan</Badge>
        </div>
        <div className="mt-7 mb-3 flex justify-between text-xs">
          <span>Embed usage</span>
          <span>
            {workspace.embeds.length} of {workspace.plan === "Free" ? 1 : 25}{" "}
            embeds used
          </span>
        </div>
        <Progress
          value={
            (workspace.embeds.length / (workspace.plan === "Free" ? 1 : 25)) *
            100
          }
          aria-label="Embed usage"
        />
      </Card>
      <div className="pricing-heading">
        <div>
          <h2>Simple plans. More possibilities.</h2>
          <p>Choose the right amount of room for your ideas.</p>
        </div>
        <div className="billing-toggle">
          <button aria-pressed={!yearly} onClick={() => setYearly(false)}>
            Monthly
          </button>
          <button aria-pressed={yearly} onClick={() => setYearly(true)}>
            Yearly <span>−10%</span>
          </button>
        </div>
      </div>
      <div className="pricing-grid">
        {["Free", "Pro"].map((plan) => (
          <Card
            key={plan}
            className={`price-card ${plan === "Pro" ? "pro" : ""}`}
          >
            <div className="flex justify-between">
              <h3>{plan}</h3>
              {plan === "Pro" && (
                <Badge variant="secondary">
                  <Sparkles size={12} />
                  Room to grow
                </Badge>
              )}
            </div>
            <p>
              {plan === "Free"
                ? "For your first little window into Notion."
                : "For more pages, more places, more you."}
            </p>
            <div className="price">
              <strong>${plan === "Free" ? "0" : yearly ? "75.60" : "7"}</strong>
              <span> / {plan === "Pro" && yearly ? "year" : "month"}</span>
            </div>
            <p className="text-xs">
              {plan === "Free"
                ? "Free, for as long as you need."
                : yearly
                  ? "$6.30/month, billed yearly. Save 10%."
                  : "$75.60/year with yearly billing."}
            </p>
            <div className="plan-features">
              {(plan === "Free"
                ? [
                  "1 embed",
                  "Basic customization",
                  "Light, dark & system themes",
                ]
                : [
                  "25 embeds",
                  "Basic customization",
                  "Advanced customization — planned",
                  "Remove watermark — planned",
                ]
              ).map((t) => (
                <div key={t}>
                  <Check size={15} />
                  {t}
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              variant={plan === "Pro" ? "default" : "outline"}
              disabled={
                workspace.plan === plan ||
                (plan === "Free" && workspace.embeds.length > 1)
              }
              onClick={() =>
                plan === "Pro"
                  ? setUpgrade(true)
                  : (update({ ...workspace, plan: "Free" }),
                    toast.success("Switched to the Free demo"))
              }
            >
              {workspace.plan === plan
                ? "Current plan"
                : plan === "Pro"
                  ? "Upgrade to Pro"
                  : "Switch to Free demo"}
            </Button>
            {plan === "Free" && workspace.embeds.length > 1 && (
              <p className="mt-2 text-xs">
                Keep one embed to switch back to Free.
              </p>
            )}
          </Card>
        ))}
      </div>
      <p className="demo-note">
        No payment processing is connected. Plan changes only affect this local
        demo.
      </p>
      <UpgradeDialog open={upgrade} onOpenChange={setUpgrade} />
    </>
  );
}
export function SettingsPage() {
  const { workspace, update } = useWorkspace();
  const [name, setName] = useState(workspace.name);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  async function save(e: FormEvent) {
    e.preventDefault();
    const nextName = name.trim();
    if (nextName.length < 2) {
      setProfileError("Enter at least 2 characters.");
      return;
    }

    setSavingProfile(true);
    setProfileError("");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextName }),
      });
      const result = (await response.json()) as {
        name?: string;
        message?: string;
      };
      if (!response.ok || !result.name) {
        throw new Error(result.message ?? "Your profile could not be updated.");
      }
      update({ ...workspace, name: result.name });
      setName(result.name);
      toast.success("Profile updated");
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Your profile could not be updated.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="The little details that make this workspace yours."
      />
      <div className="settings-width">
        <form onSubmit={save}>
          <Card className="settings-panel">
            <h2>Profile</h2>
            <p>Your profile information from your signed-in account.</p>
            <div className="profile-settings">
              <Avatar className="dashboard-avatar large">
                <AvatarImage
                  src={workspace.avatarUrl ?? undefined}
                  alt={`${workspace.name}'s profile photo`}
                />
                <AvatarFallback>
                  {workspace.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3>Profile avatar</h3>
                <p>Your Google profile photo, with initials as a fallback.</p>
              </div>
            </div>
            <div className="field">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={name}
                maxLength={80}
                required
                aria-invalid={Boolean(profileError)}
                onChange={(e) => setName(e.target.value)}
              />
              {profileError ? <small role="alert">{profileError}</small> : null}
            </div>
            <div className="field">
              <Label htmlFor="profile-email">Email address</Label>
              <Input id="profile-email" value={workspace.email} readOnly />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </>
  );
}
