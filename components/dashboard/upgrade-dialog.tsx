"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setDemoPlan } from "@/lib/demo-plan";
import { applyEmbedEntitlements } from "@/lib/dashboard-model";

import { useWorkspace } from "./store";

export function UpgradeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { workspace, update } = useWorkspace();
  const [yearly, setYearly] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  async function enableDemoPro() {
    if (!workspace.demoPlanEnabled) return;
    setSavingPlan(true);
    try {
      const plan = await setDemoPlan("Pro", yearly ? "yearly" : "monthly");
      update({
        ...workspace,
        plan,
        embeds: workspace.embeds.map((embed) =>
          applyEmbedEntitlements(embed, true),
        ),
      });
      onOpenChange(false);
      toast.success("Pro demo enabled for this account.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Pro demo could not be enabled.",
      );
    } finally {
      setSavingPlan(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <span className="upgrade-icon">
            <Sparkles size={22} />
          </span>
          <DialogTitle className="text-2xl">
            More room for your ideas.
          </DialogTitle>
          <DialogDescription>
            Go beyond one embed with EmbedMyNotion Pro.
          </DialogDescription>
        </DialogHeader>
        <div className="billing-toggle">
          <button onClick={() => setYearly(false)} aria-pressed={!yearly}>
            Monthly
          </button>
          <button onClick={() => setYearly(true)} aria-pressed={yearly}>
            Yearly <span>−10%</span>
          </button>
        </div>
        <div className="py-3">
          <strong className="text-4xl tracking-tight">
            ${yearly ? "75.60" : "7"}
          </strong>
          <span className="text-muted-foreground">
            {" "}/ {yearly ? "year" : "month"}
          </span>
        </div>
        <div className="space-y-3 text-sm">
          {[
            "25 customizable embeds",
            "Appearance and layout controls",
            "Password and email access",
            "Remove watermark",
          ].map((feature) => (
            <p key={feature} className="flex gap-3">
              <Check size={16} />
              {feature}
            </p>
          ))}
        </div>
        <Button
          size="lg"
          className="dashboard-primary-button mt-3"
          disabled={savingPlan || !workspace.demoPlanEnabled}
          onClick={enableDemoPro}
        >
          {savingPlan
            ? "Enabling Pro…"
            : workspace.demoPlanEnabled
              ? "Try Pro in this demo"
              : "Pro checkout coming soon"}
          {!savingPlan && workspace.demoPlanEnabled ? (
            <ArrowRight size={15} />
          ) : null}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          {workspace.demoPlanEnabled
            ? "Demo access is saved to this account. Payments are not connected."
            : "Demo upgrades are disabled in production."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
