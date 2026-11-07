"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Check,
  Code2,
  Copy,
  Droplets,
  ExternalLink,
  FileCode2,
  FileImage,
  Heading,
  KeyRound,
  LayoutPanelTop,
  Link2,
  Lock,
  Mail,
  Maximize2,
  Monitor,
  Moon,
  MoreVertical,
  MoveHorizontal,
  MoveVertical,
  Paintbrush,
  Palette,
  Save,
  ShieldCheck,
  Square,
  Sun,
  Type,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { embedCode, validNotionUrl, type Embed } from "@/lib/dashboard-model";
import {
  embedBackgroundStyles,
  embedBackgroundValue,
} from "@/lib/embed-background";
import { useWorkspace } from "./store";
import { copyCode } from "./dashboard-shared";
import { NotionFrame } from "./notion-frame";
import { UpgradeDialog } from "./upgrade-dialog";

function parseAllowedEmails(value: string) {
  return [...new Set(
    value
      .split(/[\n,]/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )];
}

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
      font: "default",
      customCssEnabled: false,
      customCss: "",
      showTopBar: false,
      showCoverImage: true,
      showPageHeader: true,
      passwordProtected: false,
      emailAccess: false,
      allowedEmails: [],
      hideWatermark: workspace.plan === "Pro",
      height: 700,
      fullWidth: true,
      width: 640,
      fullHeight: true,
      border: false,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      radius: 8,
      backgroundStyle: "none",
      active: true,
      createdAt: "",
      updatedAt: "",
    },
  );
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const [created, setCreated] = useState<Embed | null>(null);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [allowedEmailText, setAllowedEmailText] = useState(
    existing?.allowedEmails.join("\n") ?? "",
  );
  const [titleLookupStatus, setTitleLookupStatus] = useState<
    "idle" | "loading" | "filled" | "error"
  >("idle");
  const titleWasEdited = useRef(Boolean(existing?.title));

  useEffect(() => {
    if (existing || created || !validNotionUrl(draft.notionUrl)) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (titleWasEdited.current) return;

      setTitleLookupStatus("loading");

      try {
        const response = await fetch(
          `/api/embeds/metadata?url=${encodeURIComponent(draft.notionUrl)}`,
          { signal: controller.signal },
        );
        const result = (await response.json()) as {
          title?: string;
          message?: string;
        };

        if (!response.ok || !result.title) {
          throw new Error(result.message ?? "Could not read the page title.");
        }

        if (!titleWasEdited.current) {
          setDraft((current) => ({ ...current, title: result.title! }));
          setTitleLookupStatus("filled");
        } else {
          setTitleLookupStatus("idle");
        }
      } catch (lookupError) {
        if (
          lookupError instanceof DOMException &&
          lookupError.name === "AbortError"
        ) {
          return;
        }
        setTitleLookupStatus("error");
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [created, draft.notionUrl, existing]);

  function change<K extends keyof Embed>(key: K, value: Embed[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  function requirePro() {
    if (workspace.plan === "Pro") return true;
    setUpgrade(true);
    return false;
  }
  function changePro<K extends keyof Embed>(key: K, value: Embed[K]) {
    if (requirePro()) change(key, value);
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
      !Number.isInteger(draft.width) ||
      draft.width < 320 ||
      draft.width > 1920 ||
      !Number.isInteger(draft.radius) ||
      draft.radius < 0 ||
      draft.radius > 64 ||
      !Number.isInteger(draft.borderWidth) ||
      draft.borderWidth < 1 ||
      draft.borderWidth > 12 ||
      !/^#[0-9a-f]{6}$/i.test(draft.borderColor)
    )
      return setError(
        "Use a width of 320–1920px, height of 200–2000px, radius of 0–64px, border width of 1–12px, and a valid hex color.",
      );
    const allowedEmails = parseAllowedEmails(allowedEmailText);
    if (
      draft.passwordProtected &&
      !password &&
      !existing?.passwordProtected &&
      !created?.passwordProtected
    ) {
      return setError("Choose a password with at least 6 characters.");
    }
    if (password && (password.length < 6 || password.length > 72)) {
      return setError("Use a password between 6 and 72 characters.");
    }
    if (draft.emailAccess && allowedEmails.length === 0) {
      return setError("Add at least one email address with access.");
    }
    if (
      !id &&
      !created &&
      workspace.embeds.length >= (workspace.plan === "Free" ? 1 : 25)
    ) {
      setUpgrade(true);
      return;
    }
    setSaving(true);
    try {
      const targetId = id ?? created?.id;
      const response = await fetch(
        targetId ? `/api/embeds/${targetId}` : "/api/embeds",
        {
          method: targetId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, allowedEmails, password }),
        },
      );
      const result = (await response.json()) as {
        embed?: Embed;
        message?: string;
      };
      if (!response.ok || !result.embed) {
        throw new Error(result.message ?? "Your embed could not be saved.");
      }

      const saved = result.embed;
      update({
        ...workspace,
        embeds: targetId
          ? workspace.embeds.map((embed) =>
            embed.id === saved.id ? saved : embed,
          )
          : [saved, ...workspace.embeds],
      });
      setDraft(saved);
      setPassword("");
      setAllowedEmailText(saved.allowedEmails.join("\n"));
      toast.success(targetId ? "Changes saved" : "Your embed is ready");
      if (!id) setCreated(saved);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Your embed could not be saved.",
      );
    } finally {
      setSaving(false);
    }
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
      <form onSubmit={save}>
        <div className="editor-grid">
          <div className="editor-settings">
            {(existing || created) && (
              <EditorCodePanel embed={existing ?? created!} />
            )}
            <Card className="settings-panel">
              <section
                className="notion-source-section"
                aria-labelledby="notion-source-title"
              >
                <div className="notion-source-heading">
                  <span aria-hidden="true">
                    <Link2 />
                  </span>
                  <div>
                    <h3 id="notion-source-title">Notion page</h3>
                    <p>Choose the published page behind this embed.</p>
                  </div>
                </div>
                <div className="field notion-source-field">
                  <Label htmlFor="notion-url">Page link</Label>
                  <Input
                    id="notion-url"
                    type="url"
                    value={draft.notionUrl}
                    onChange={(e) => {
                      const notionUrl = e.target.value;
                      setTitleLookupStatus(
                        !titleWasEdited.current && validNotionUrl(notionUrl)
                          ? "loading"
                          : "idle",
                      );
                      change("notionUrl", notionUrl);
                    }}
                    placeholder="https://your-space.notion.site/…"
                    readOnly={Boolean(existing || created)}
                    aria-describedby="notion-url-help"
                    required
                  />
                  <small id="notion-url-help">
                    {existing || created
                      ? "This page is fixed for this embed. Create a new embed to use another page."
                      : "Paste a public Notion link. In Notion, choose Share → Publish first."}
                  </small>
                </div>
                <div className="field notion-source-field">
                  <Label htmlFor="embed-name">Name</Label>
                  <Input
                    id="embed-name"
                    value={draft.title}
                    onChange={(e) => {
                      titleWasEdited.current = true;
                      setTitleLookupStatus("idle");
                      change("title", e.target.value);
                    }}
                    placeholder="e.g. Studio handbook"
                    maxLength={100}
                    aria-describedby="embed-name-help"
                    required
                  />
                  <small id="embed-name-help" aria-live="polite">
                    {titleLookupStatus === "loading"
                      ? "Reading the page name from Notion…"
                      : titleLookupStatus === "filled"
                        ? "Filled from Notion. You can edit this dashboard name."
                        : titleLookupStatus === "error"
                          ? "We couldn't read the page name. Enter one manually."
                          : "Only you see this name in your dashboard."}
                  </small>
                </div>
              </section>
              <div className="editor-section-title">
                <span aria-hidden="true">
                  <Maximize2 />
                </span>
                <div>
                  <h3>Dimensions &amp; frame</h3>
                  <p>Control how the embed fits into your website.</p>
                </div>
              </div>
              <div className="dimension-card">
                <div className="dimension-toggle">
                  <span className="dimension-icon" aria-hidden="true">
                    <MoveHorizontal />
                  </span>
                  <div>
                    <Label htmlFor="fullWidth">Full width</Label>
                    <small>Stretch to the width of its container</small>
                  </div>
                  <Switch
                    id="fullWidth"
                    checked={draft.fullWidth}
                    onCheckedChange={(value) => change("fullWidth", value)}
                  />
                </div>
                <div className="dimension-height-field">
                  <div>
                    <Label htmlFor="embed-width">Custom width</Label>
                    <small>Used when full width is off</small>
                  </div>
                  <Input
                    id="embed-width"
                    type="number"
                    min={320}
                    max={1920}
                    value={draft.width}
                    onChange={(e) => change("width", Number(e.target.value))}
                    disabled={draft.fullWidth}
                    required
                  />
                </div>
                <div className="dimension-toggle">
                  <span className="dimension-icon" aria-hidden="true">
                    <MoveVertical />
                  </span>
                  <div>
                    <Label htmlFor="fullHeight">Full height</Label>
                    <small>Fill the visitor’s viewport height</small>
                  </div>
                  <Switch
                    id="fullHeight"
                    checked={draft.fullHeight}
                    onCheckedChange={(value) => change("fullHeight", value)}
                  />
                </div>
                <div className="dimension-height-field">
                  <div>
                    <Label htmlFor="embed-height">Custom height</Label>
                    <small>Used when full height is off</small>
                  </div>
                  <Input
                    id="embed-height"
                    type="number"
                    min={200}
                    max={2000}
                    value={draft.height}
                    onChange={(e) => change("height", Number(e.target.value))}
                    disabled={draft.fullHeight}
                    required
                  />
                </div>
                <div className="dimension-toggle border-toggle">
                  <span className="dimension-icon" aria-hidden="true">
                    <Square />
                  </span>
                  <div>
                    <Label htmlFor="border">Border</Label>
                    <small>Add a customizable frame</small>
                  </div>
                  <Switch
                    id="border"
                    checked={draft.border}
                    onCheckedChange={(value) => change("border", value)}
                  />
                </div>
                <div className="frame-controls">
                  <div className="frame-number-field">
                    <Label htmlFor="border-width">Border size</Label>
                    <div>
                      <Input
                        id="border-width"
                        type="number"
                        min={1}
                        max={12}
                        value={draft.borderWidth}
                        onChange={(e) =>
                          change("borderWidth", Number(e.target.value))
                        }
                        disabled={!draft.border}
                        required
                      />
                      <span>px</span>
                    </div>
                  </div>
                  <div className="frame-number-field">
                    <Label htmlFor="embed-radius">Corner radius</Label>
                    <div>
                      <Input
                        id="embed-radius"
                        type="number"
                        min={0}
                        max={64}
                        value={draft.radius}
                        onChange={(e) =>
                          change("radius", Number(e.target.value))
                        }
                        required
                      />
                      <span>px</span>
                    </div>
                  </div>
                  <div className="frame-color-field">
                    <Label htmlFor="border-color">Border color</Label>
                    <div className="frame-color-control">
                      <input
                        id="border-color"
                        type="color"
                        value={draft.borderColor}
                        onChange={(e) => change("borderColor", e.target.value)}
                        disabled={!draft.border}
                      />
                      <Input
                        aria-label="Border color hex value"
                        value={draft.borderColor}
                        onChange={(e) => change("borderColor", e.target.value)}
                        maxLength={7}
                        disabled={!draft.border}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-section-heading">
                <span className="feature-section-icon" aria-hidden="true">
                  <Droplets />
                </span>
                <h3>Appearance</h3>
                {workspace.plan === "Free" ? (
                  <span className="feature-pro-badge">Pro</span>
                ) : null}
              </div>
              <div className="feature-settings-card">
                <div className="feature-setting-row theme-setting-row">
                  <div className="feature-setting-label">
                    <Moon aria-hidden="true" />
                    <Label>Theme</Label>
                  </div>
                  <div className="theme-mode-picker" aria-label="Embed theme">
                    <button
                      type="button"
                      className={draft.theme === "light" ? "selected" : ""}
                      onClick={() => change("theme", "light")}
                      aria-label="Use light theme"
                      aria-pressed={draft.theme === "light"}
                    >
                      <Sun />
                    </button>
                    <button
                      type="button"
                      className={draft.theme === "dark" ? "selected" : ""}
                      onClick={() => change("theme", "dark")}
                      aria-label="Use dark theme"
                      aria-pressed={draft.theme === "dark"}
                    >
                      <Moon />
                    </button>
                    <button
                      type="button"
                      className={draft.theme === "system" ? "selected" : ""}
                      onClick={() => change("theme", "system")}
                      aria-label="Match system theme"
                      aria-pressed={draft.theme === "system"}
                    >
                      <Monitor />
                    </button>
                  </div>
                </div>
                <div className="background-style-field">
                  <div className="background-style-heading">
                    <div className="feature-setting-label">
                      <Palette aria-hidden="true" />
                      <div>
                        <Label>Background style</Label>
                        <small>Add a polished frame around your page.</small>
                      </div>
                    </div>
                  </div>
                  <div
                    className="background-style-grid"
                    role="radiogroup"
                    aria-label="Embed background style"
                  >
                    {embedBackgroundStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        className={`${
                          draft.backgroundStyle === style.id ? "selected" : ""
                        }${style.id === "none" ? " is-none" : ""}`}
                        style={{ background: embedBackgroundValue(style.id) }}
                        onClick={() => change("backgroundStyle", style.id)}
                        role="radio"
                        aria-label={style.label}
                        aria-checked={draft.backgroundStyle === style.id}
                        title={style.label}
                      />
                    ))}
                  </div>
                </div>
                <div className="feature-setting-row">
                  <div className="feature-setting-label">
                    <Type aria-hidden="true" />
                    <Label htmlFor="embed-font">Font</Label>
                  </div>
                  <Select
                    value={draft.font}
                    onValueChange={(value) => {
                      if (
                        value === "default" ||
                        value === "sans" ||
                        value === "serif" ||
                        value === "mono"
                      )
                        changePro("font", value);
                    }}
                  >
                    <SelectTrigger id="embed-font" className="feature-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="sans">Sans</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="mono">Mono</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="feature-setting-row">
                  <div className="feature-setting-label">
                    <Paintbrush aria-hidden="true" />
                    <Label htmlFor="custom-css-enabled">Custom CSS</Label>
                  </div>
                  <Switch
                    id="custom-css-enabled"
                    checked={draft.customCssEnabled}
                    onCheckedChange={(value) =>
                      changePro("customCssEnabled", value)
                    }
                  />
                </div>
                {draft.customCssEnabled ? (
                  <div className="feature-expanded-field">
                    <Label htmlFor="custom-css">CSS</Label>
                    <textarea
                      id="custom-css"
                      value={draft.customCss}
                      onChange={(event) => change("customCss", event.target.value)}
                      maxLength={4000}
                      rows={6}
                      spellCheck={false}
                      placeholder={".notion-page {\n  max-width: 900px;\n}"}
                    />
                    <small>Applied inside this embed only. Up to 4,000 characters.</small>
                  </div>
                ) : null}
              </div>

              <div className="feature-section-heading">
                <span className="feature-section-icon" aria-hidden="true">
                  <LayoutPanelTop />
                </span>
                <h3>Layout</h3>
                {workspace.plan === "Free" ? (
                  <span className="feature-pro-badge">Pro</span>
                ) : null}
              </div>
              <div className="feature-settings-card">
                <FeatureSwitchRow
                  id="show-top-bar"
                  icon={<LayoutPanelTop />}
                  label="Show top bar"
                  checked={draft.showTopBar}
                  onCheckedChange={(value) => changePro("showTopBar", value)}
                />
                <FeatureSwitchRow
                  id="show-cover-image"
                  icon={<FileImage />}
                  label="Show cover image"
                  checked={draft.showCoverImage}
                  onCheckedChange={(value) => changePro("showCoverImage", value)}
                />
                <FeatureSwitchRow
                  id="show-page-header"
                  icon={<Heading />}
                  label="Show page header"
                  checked={draft.showPageHeader}
                  onCheckedChange={(value) => changePro("showPageHeader", value)}
                />
              </div>

              <div className="feature-section-heading">
                <span className="feature-section-icon" aria-hidden="true">
                  <ShieldCheck />
                </span>
                <h3>Security</h3>
                {workspace.plan === "Free" ? (
                  <span className="feature-pro-badge">Pro</span>
                ) : null}
              </div>
              <div className="feature-settings-card">
                <FeatureSwitchRow
                  id="password-protection"
                  icon={<KeyRound />}
                  label="Password protection"
                  checked={draft.passwordProtected}
                  onCheckedChange={(value) => {
                    if (!requirePro()) return;
                    change("passwordProtected", value);
                    if (!value) setPassword("");
                  }}
                />
                {draft.passwordProtected ? (
                  <div className="feature-expanded-field">
                    <Label htmlFor="embed-password-setting">Password</Label>
                    <Input
                      id="embed-password-setting"
                      type="password"
                      value={password}
                      minLength={6}
                      maxLength={72}
                      autoComplete="new-password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={existing?.passwordProtected ? "Leave blank to keep current password" : "At least 6 characters"}
                    />
                    <small>
                      The password screen is shown in the editor preview. Save
                      your changes, then test the real unlock flow in a private
                      browser window.
                    </small>
                  </div>
                ) : null}
                <FeatureSwitchRow
                  id="email-access"
                  icon={<Mail />}
                  label="Email access"
                  checked={draft.emailAccess}
                  onCheckedChange={(value) => {
                    if (!requirePro()) return;
                    change("emailAccess", value);
                  }}
                />
                {draft.emailAccess ? (
                  <div className="feature-expanded-field">
                    <Label htmlFor="allowed-emails">Allowed emails</Label>
                    <textarea
                      id="allowed-emails"
                      value={allowedEmailText}
                      onChange={(event) => setAllowedEmailText(event.target.value)}
                      rows={4}
                      placeholder={"alex@example.com\nteam@example.com"}
                      spellCheck={false}
                    />
                    <small>One email per line. Visitors must sign in with Google.</small>
                  </div>
                ) : null}
              </div>

              <div className="switch-field active-embed-switch">
                <div>
                  <Label htmlFor="active">Active embed</Label>
                  <small>Make this published embed available</small>
                </div>
                <Switch
                  id="active"
                  checked={draft.active}
                  onCheckedChange={(value) => change("active", value)}
                />
              </div>
              <div className="pro-feature">
                {workspace.plan === "Pro" ? (
                  <Check size={14} />
                ) : (
                  <Lock size={14} />
                )}
                <span>
                  {workspace.plan === "Pro"
                    ? "Watermark removed"
                    : "Remove watermark"}
                </span>
                <span className="ml-auto text-[10px]">PRO</span>
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
              <Button
                type="submit"
                disabled={saving || titleLookupStatus === "loading"}
              >
                <Save size={15} />
                {saving
                  ? "Saving…"
                  : id || created
                    ? "Save changes"
                    : "Create Embed"}
              </Button>
            </div>
          </div>
          <div
            className={`editor-preview ${
              draft.fullHeight ? "is-full-height" : "is-fixed-height"
            }`}
          >
            <div className="preview-browser">
              <div className="preview-canvas">
                <NotionFrame
                  key={draft.passwordProtected ? "protected" : "unprotected"}
                  embed={draft}
                  previewPassword={password}
                />
              </div>
            </div>
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
              Copy this snippet into your website’s HTML to show the published
              Notion page.
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

function FeatureSwitchRow({
  id,
  icon,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="feature-setting-row">
      <div className="feature-setting-label">
        <span aria-hidden="true">{icon}</span>
        <Label htmlFor={id}>{label}</Label>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

function EditorCodePanel({ embed }: { embed: Embed }) {
  const publicPath = `/embed/${encodeURIComponent(embed.id)}`;

  function absolutePublicUrl() {
    return new URL(publicPath, window.location.origin).toString();
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(absolutePublicUrl());
    toast.success("Embed URL copied");
  }

  async function copyShortcode() {
    const shortcode = `[iframe src="${absolutePublicUrl()}" width="${embed.fullWidth ? "100%" : embed.width}" height="${embed.fullHeight ? "100%" : embed.height}" style="border:${embed.border ? `${embed.borderWidth}px solid ${embed.borderColor}` : "0"};border-radius:${embed.radius}px;max-width:100%"]`;
    await navigator.clipboard.writeText(shortcode);
    toast.success("WordPress shortcode copied");
  }

  return (
    <section className="editor-code-panel" aria-label="Customization actions">
      <div className="editor-code-heading">
        <div className="editor-code-title">
          <strong>Customization</strong>
          <small>Shape how this embed appears on your website.</small>
        </div>
        <div className="editor-code-actions">
          <Link
            className="editor-public-link"
            href={publicPath}
            target="_blank"
            rel="noreferrer"
          >
            <span>Open public embed</span>
            <ExternalLink aria-hidden="true" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="editor-more-button"
                  aria-label="Open embed copy menu"
                />
              }
            >
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 shadow-none"
            >
              <DropdownMenuItem onClick={copyUrl}>
                <Link2 />
                Copy embed URL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyCode(embed)}>
                <Code2 />
                Copy embed code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={copyShortcode}>
                <FileCode2 />
                Copy WordPress shortcode
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
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
        Uses your app’s /embed/{embed.id} route and stays available after you
        sign out.
      </p>
    </section>
  );
}
