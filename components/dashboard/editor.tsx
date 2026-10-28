"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Globe,
  Lock,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { embedCode, validNotionUrl, type Embed } from "@/lib/dashboard-model";
import { useWorkspace } from "./store";
import { UpgradeDialog, copyCode } from "./dashboard";
import { DocumentPreview } from "./preview";

export function EmbedEditor({ id }: { id?: string }) {
  const router = useRouter();
  const { workspace, update } = useWorkspace();
  const existing = workspace.embeds.find((e) => e.id === id);
  const [draft, setDraft] = useState<Embed>(
    existing ?? {
      id: "",
      title: "",
      notionUrl: "",
      theme: "light",
      height: 700,
      fullWidth: true,
      border: false,
      radius: 8,
      active: true,
      createdAt: "",
    },
  );
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const [created, setCreated] = useState<Embed | null>(null);
  const [saving, setSaving] = useState(false);
  function change<K extends keyof Embed>(key: K, value: Embed[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!draft.title.trim()) return setError("Give your embed a name.");
    if (!validNotionUrl(draft.notionUrl))
      return setError(
        "Enter a public HTTPS notion.so or notion.site page URL.",
      );
    if (
      !Number.isInteger(draft.height) ||
      draft.height < 200 ||
      draft.height > 2000 ||
      !Number.isInteger(draft.radius) ||
      draft.radius < 0 ||
      draft.radius > 32
    )
      return setError("Use a height of 200–2000px and a radius of 0–32px.");
    if (
      !id &&
      !created &&
      workspace.embeds.length >= (workspace.plan === "Free" ? 1 : 25)
    ) {
      setUpgrade(true);
      return;
    }
    setSaving(true);
    const saved = {
      ...draft,
      title: draft.title.trim(),
      id: id ?? created?.id ?? crypto.randomUUID(),
      createdAt:
        existing?.createdAt ?? created?.createdAt ?? new Date().toISOString(),
    };
    update({
      ...workspace,
      embeds:
        id || created
          ? workspace.embeds.map((e) => (e.id === saved.id ? saved : e))
          : [...workspace.embeds, saved],
    });
    setDraft(saved);
    setSaving(false);
    toast.success(id || created ? "Changes saved" : "Your embed is ready");
    if (!id) setCreated(saved);
  }
  if (id && !existing)
    return (
      <div className="empty-state">
        <h1>Embed not found</h1>
        <p>It may have been removed or created in another browser.</p>
        <Link href="/dashboard/embeds">Back to My Embeds</Link>
      </div>
    );
  return (
    <div className="embed-editor-page">
      <Link href="/dashboard/embeds" className="back-link">
        <ArrowLeft size={14} />
        My Embeds
      </Link>
      <form onSubmit={save}>
        <div className="editor-grid">
          <div className="editor-settings">
            <div className="editor-panel-heading">

              <h1>{id ? "Edit embed" : "Create an embed"}</h1>
              <p>A little customization. A perfect fit for your website.</p>
            </div>
            <Card className="settings-panel">
              <div className="field">
                <Label htmlFor="embed-name">Embed name</Label>
                <Input
                  id="embed-name"
                  value={draft.title}
                  onChange={(e) => change("title", e.target.value)}
                  placeholder="e.g. Studio handbook"
                  maxLength={100}
                  required
                />
              </div>
              <div className="field">
                <Label htmlFor="notion-url">Public Notion page URL</Label>
                <Input
                  id="notion-url"
                  type="url"
                  value={draft.notionUrl}
                  onChange={(e) => change("notionUrl", e.target.value)}
                  placeholder="https://your-space.notion.site/…"
                  required
                />
                <small>
                  In Notion, choose Share → Publish to make your page public.
                </small>
              </div>
              <div className="panel-divider" />
              <h3>Appearance</h3>
              <div className="field">
                <Label htmlFor="embed-theme">Theme</Label>
                <Select
                  value={draft.theme}
                  onValueChange={(value) => {
                    if (
                      value === "light" ||
                      value === "dark" ||
                      value === "system"
                    )
                      change("theme", value);
                  }}
                >
                  <SelectTrigger id="embed-theme" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="field">
                  <Label htmlFor="embed-height">Height (px)</Label>
                  <Input
                    id="embed-height"
                    type="number"
                    min={200}
                    max={2000}
                    value={draft.height}
                    onChange={(e) => change("height", Number(e.target.value))}
                    required
                  />
                </div>
                <div className="field">
                  <Label htmlFor="embed-radius">Border radius (px)</Label>
                  <Input
                    id="embed-radius"
                    type="number"
                    min={0}
                    max={32}
                    value={draft.radius}
                    onChange={(e) => change("radius", Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              {(
                [
                  {
                    key: "fullWidth",
                    title: "Full width",
                    detail: "Fill the available container width",
                  },
                  {
                    key: "border",
                    title: "Show border",
                    detail: "A subtle outline around your content",
                  },
                  {
                    key: "active",
                    title: "Active embed",
                    detail: "Make this demo preview available",
                  },
                ] as const
              ).map((field) => (
                <div className="switch-field" key={field.key}>
                  <div>
                    <Label htmlFor={field.key}>{field.title}</Label>
                    <small>{field.detail}</small>
                  </div>
                  <Switch
                    id={field.key}
                    checked={draft[field.key]}
                    onCheckedChange={(v) => change(field.key, v)}
                  />
                </div>
              ))}
              <div className="pro-feature">
                <Lock size={14} />
                <span>Remove watermark</span>
                <span className="ml-auto text-[10px]">PRO · COMING SOON</span>
              </div>
            </Card>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <div className="editor-actions">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/dashboard/embeds" />}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save size={15} />
                {saving
                  ? "Saving…"
                  : id || created
                    ? "Save changes"
                    : "Create Embed"}
              </Button>
            </div>
          </div>
          <div className="editor-preview">
            <div className="preview-heading">
              <span>
                <Monitor size={15} />
                Live appearance preview
              </span>
              <span className="text-xs text-muted-foreground">
                {draft.height}px
              </span>
            </div>
            <div className="preview-browser">
              <div className="browser-toolbar">
                <span className="browser-dots">● ● ●</span>
                <span>
                  <Globe size={11} /> your-website.com
                </span>
                <Lock size={11} />
              </div>
              <div className="preview-canvas">
                <DocumentPreview embed={draft} />
              </div>
            </div>
            <p className="preview-disclaimer">
              Sample document content. Your Notion page is not fetched in this
              UI demo.
            </p>
            {(existing || created) && (
              <CodePanel embed={existing ?? created!} />
            )}
          </div>
        </div>
      </form>
      <UpgradeDialog open={upgrade} onOpenChange={setUpgrade} />
      <Dialog
        open={!!created}
        onOpenChange={(open) => {
          if (!open && created)
            router.push(`/dashboard/embeds/${created.id}`);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <span className="upgrade-icon">
              <Check />
            </span>
            <DialogTitle>Your embed is ready.</DialogTitle>
            <DialogDescription>
              Copy this snippet into your website’s HTML. In this demo, it
              renders sample content from this browser.
            </DialogDescription>
          </DialogHeader>
          {created && (
            <>
              <CodePanel embed={created} />
              <Button
                className="dashboard-primary-button"
                nativeButton={false}
                render={<Link href={`/dashboard/embeds/${created.id}`} />}
              >
                Continue to editor
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function CodePanel({ embed }: { embed: Embed }) {
  return (
    <section className="code-panel">
      <div>
        <h3>Embed code</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => copyCode(embed)}
        >
          <Copy size={13} />
          Copy
        </Button>
      </div>
      <textarea
        aria-label="Generated iframe embed code"
        readOnly
        value={embedCode(
          embed,
          typeof window === "undefined" ? "" : window.location.origin,
        )}
        rows={5}
        onFocus={(e) => e.target.select()}
      />
      <p>
        Uses your app’s /embed/{embed.id} route. Demo data is local to this
        browser.
      </p>
    </section>
  );
}
