"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { Embed } from "@/lib/dashboard-model";
import { copyCode, PageHeading } from "./dashboard-shared";
import { useWorkspace } from "./store";
import { NotionFrame } from "./notion-frame";
import { UpgradeDialog } from "./upgrade-dialog";

type DashboardPageIcon =
  | { kind: "emoji"; value: string }
  | { kind: "image"; value: string };

type DashboardIconMap = Record<string, DashboardPageIcon | null>;

let dashboardIconsRequest: Promise<DashboardIconMap | null> | null = null;

function loadDashboardPageIcon(embedId: string) {
  dashboardIconsRequest ??= fetch("/api/embeds/icons")
    .then(async (response) => {
      if (!response.ok) return null;
      const result = (await response.json()) as {
        icons?: DashboardIconMap;
      };
      return result.icons ?? null;
    })
    .catch(() => null);

  return dashboardIconsRequest.then(async (icons) => {
    if (icons && embedId in icons) return icons[embedId];

    const response = await fetch(
      `/api/embeds/${encodeURIComponent(embedId)}/icon`,
    );
    if (!response.ok) return null;
    const result = (await response.json()) as {
      icon?: DashboardPageIcon | null;
    };
    return result.icon ?? null;
  });
}

function EmbedPageIcon({ embedId, size }: { embedId: string; size: number }) {
  const [pageIcon, setPageIcon] = useState<DashboardPageIcon | null>(null);

  useEffect(() => {
    let active = true;
    void loadDashboardPageIcon(embedId).then((icon) => {
      if (active) setPageIcon(icon);
    });

    return () => {
      active = false;
    };
  }, [embedId]);

  if (pageIcon?.kind === "image") {
    // Notion image URLs are dynamic and should be rendered without optimization.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={pageIcon.value} alt="" />;
  }

  if (pageIcon?.kind === "emoji") {
    return <span className="dashboard-page-icon-emoji">{pageIcon.value}</span>;
  }

  return <FileText size={size} strokeWidth={1.5} />;
}

async function deleteEmbed(id: string) {
  const response = await fetch(`/api/embeds/${id}`, { method: "DELETE" });
  if (response.ok) return;

  const result = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;
  throw new Error(result?.message ?? "The embed could not be deleted.");
}
export function CreateButton() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const [upgrade, setUpgrade] = useState(false);
  return (
    <>
      <Button
        size="lg"
        onClick={() =>
          workspace.embeds.length >= (workspace.plan === "Free" ? 1 : 25)
            ? setUpgrade(true)
            : router.push("/dashboard/embeds/new")
        }
      >
        <Plus size={16} />
        New embed
      </Button>
      <UpgradeDialog open={upgrade} onOpenChange={setUpgrade} />
    </>
  );
}
export function DashboardHome() {
  const { workspace, update } = useWorkspace();
  const router = useRouter();
  const [deleting, setDeleting] = useState<Embed | null>(null);
  const [preview, setPreview] = useState<Embed | null>(null);
  const limit = workspace.plan === "Free" ? 1 : 25;
  const recentEmbeds = [...workspace.embeds]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 3);
  return (
    <div className="centered-dashboard-page">
      <div className="overview-heading">
        <div>
          <h1>Welcome back, {workspace.name.split(" ")[0]}</h1>
          <p className="overview-status">{workspace.plan} plan</p>
        </div>
        <CreateButton />
      </div>

      <Card className="usage-strip">
        {[
          {
            label: "Embeds",
            value: workspace.embeds.length,
            limit,
            detail: "Total created",
          },
          {
            label: "Active",
            value: workspace.embeds.filter((embed) => embed.active).length,
            limit,
            detail: "Published and ready",
          },
          {
            label: "Available",
            value: Math.max(limit - workspace.embeds.length, 0),
            limit,
            detail: `${workspace.plan} plan capacity`,
          },
        ].map((item) => (
          <div className="usage-segment" key={item.label}>
            <div className="usage-detail">
              <span>{item.label}</span>
              <strong>
                {item.value}<small> / {item.limit}</small>
              </strong>
              <small className="usage-caption">{item.detail}</small>
            </div>
          </div>
        ))}
      </Card>

      <div className="overview-grid">
        <Card className="overview-panel recent-panel">
          <div className="overview-panel-heading">
            <div>
              <h2>Recent embeds</h2>
              <p>Your latest Notion pages, ready to share.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/embeds" />}
            >
              View all <ArrowRight size={14} />
            </Button>
          </div>
          <div className="recent-list">
            {recentEmbeds.length > 0 && (
              <div className="recent-table-head" aria-hidden="true">
                <span>Embed</span>
                <span>Status</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
            )}
            {recentEmbeds.map((embed) => (
              <div className="recent-row" key={embed.id}>
                <Link
                  href={`/dashboard/embeds/${embed.id}`}
                  className="recent-row-link"
                  aria-label={`Open ${embed.title}`}
                >
                  <div className="recent-primary">
                    <span className="recent-icon">
                      <EmbedPageIcon embedId={embed.id} size={17} />
                    </span>
                    <div>
                      <span className="recent-title">{embed.title}</span>
                      <span className="recent-url">
                        {embed.notionUrl.replace("https://", "")}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={embed.active ? "embed-active" : "embed-inactive"}
                  >
                    <i /> {embed.active ? "Active" : "Inactive"}
                  </Badge>
                  <time dateTime={embed.createdAt}>
                    {new Date(embed.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="recent-actions"
                        aria-label={`Actions for ${embed.title}`}
                      />
                    }
                  >
                    <MoreHorizontal size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/embeds/${embed.id}`)
                      }
                    >
                      <Pencil /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPreview(embed)}>
                      <ExternalLink /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyCode(embed)}>
                      <Copy /> Copy code
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleting(embed)}
                    >
                      <Trash2 /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            {recentEmbeds.length === 0 && (
              <div className="overview-empty">
                <p>No embeds yet.</p>
                <span>Turn your first public Notion page into an embed.</span>
              </div>
            )}
          </div>
        </Card>

      </div>
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent className="delete-dialog">
          <AlertDialogHeader>
            <AlertDialogMedia className="delete-dialog-icon">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the embed from your dashboard and disable its
              preview link. Your original Notion page won’t be changed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="delete-dialog-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="delete-dialog-action"
              onClick={async () => {
                if (!deleting) return;
                try {
                  await deleteEmbed(deleting.id);
                  update({
                    ...workspace,
                    embeds: workspace.embeds.filter(
                      (embed) => embed.id !== deleting.id,
                    ),
                  });
                  setDeleting(null);
                  toast.success("Embed deleted");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "The embed could not be deleted.",
                  );
                }
              }}
            >
              <Trash2 size={14} /> Delete embed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>
              Live content from the published Notion page.
            </DialogDescription>
          </DialogHeader>
          {preview && <NotionFrame embed={preview} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function EmbedsPage() {
  return (
    <div className="centered-dashboard-page">
      <PageHeading
        title="My Embeds"
        subtitle="A home for every page you share."
      >
        <CreateButton />
      </PageHeading>
      <EmbedsList />
    </div>
  );
}
export function EmbedsList({ compact = false }: { compact?: boolean }) {
  const { workspace, update } = useWorkspace();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Embed | null>(null);
  const [preview, setPreview] = useState<Embed | null>(null);
  const filtered = workspace.embeds.filter((e) =>
    `${e.title} ${e.notionUrl}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <Card className="embeds-section">
        <div className="list-heading">
          <div>
            <h2>
              {compact ? "Your embeds" : "All embeds"}
              <span>{workspace.embeds.length}</span>
            </h2>
            <p>Little windows into your Notion workspace.</p>
          </div>
          {compact && (
            <Link
              href="/dashboard/embeds"
              className="text-xs font-medium flex items-center gap-2"
            >
              View all embeds
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
        <div className="list-toolbar">
          <div className="search-input">
            <Search size={15} />
            <Input
              placeholder="Search embeds…"
              aria-label="Search embeds"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button aria-label="Clear search" onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>
          <span>
            {filtered.length} {filtered.length === 1 ? "embed" : "embeds"}
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Embed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-16">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((embed) => (
              <TableRow
                key={embed.id}
                className="embed-row"
                role="link"
                tabIndex={0}
                aria-label={`Open ${embed.title}`}
                onClick={() => router.push(`/dashboard/embeds/${embed.id}`)}
                onKeyDown={(event) => {
                  if (
                    event.currentTarget === event.target &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    router.push(`/dashboard/embeds/${embed.id}`);
                  }
                }}
              >
                <TableCell className="pl-5">
                  <div className="embed-title-cell">
                    <span className="document-icon">
                      <EmbedPageIcon embedId={embed.id} size={20} />
                    </span>
                    <div>
                      <span className="embed-row-title">
                        {embed.title}
                      </span>
                      <p>{embed.notionUrl.replace("https://", "")}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <span
                    className={`status-pill ${embed.active ? "active" : ""}`}
                  >
                    <i />
                    {embed.active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(embed.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${embed.title}`}
                        />
                      }
                    >
                      <MoreHorizontal size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/embeds/${embed.id}`)
                        }
                      >
                        <Pencil />
                        Edit embed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPreview(embed)}>
                        <ExternalLink />
                        Preview embed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyCode(embed)}>
                        <Copy />
                        Copy embed code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleting(embed)}
                      >
                        <Trash2 />
                        Delete embed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Code2 size={28} />
            <h3>
              {search ? "No matching embeds" : "Your first embed starts here"}
            </h3>
            <p>
              {search
                ? "Try a different name or Notion URL."
                : "Bring a public Notion page to your website in minutes."}
            </p>
            {search ? (
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear search
              </Button>
            ) : (
              <CreateButton />
            )}
          </div>
        )}
        <div className="table-footer">
          <span>
            <Code2 size={13} /> Made in Notion. At home anywhere.
          </span>
          <span>{workspace.plan} plan</span>
        </div>
      </Card>
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent className="delete-dialog">
          <AlertDialogHeader>
            <AlertDialogMedia className="delete-dialog-icon">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the embed from your dashboard and disable its
              preview link. Your original Notion page won’t be changed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="delete-dialog-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="delete-dialog-action"
              onClick={async () => {
                if (!deleting) return;
                try {
                  await deleteEmbed(deleting.id);
                  update({
                    ...workspace,
                    embeds: workspace.embeds.filter(
                      (embed) => embed.id !== deleting.id,
                    ),
                  });
                  setDeleting(null);
                  toast.success("Embed deleted");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "The embed could not be deleted.",
                  );
                }
              }}
            >
              <Trash2 size={14} /> Delete embed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>
              Live content from the published Notion page.
            </DialogDescription>
          </DialogHeader>
          {preview && <NotionFrame embed={preview} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
