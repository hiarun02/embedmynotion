"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { embedCode, type Embed } from "@/lib/dashboard-model";
import { useWorkspace } from "./store";
import { DocumentPreview } from "./preview";
import { Logo } from "@/app/components/Logo";

export async function copyCode(embed: Embed) {
  try {
    await navigator.clipboard.writeText(
      embedCode(embed, window.location.origin),
    );
    toast.success("Embed code copied");
  } catch {
    toast.error(
      "Clipboard access is unavailable. Copy the code from the editor instead.",
    );
  }
}
const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/embeds", label: "Embeds", icon: Code2 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];
export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { workspace } = useWorkspace();
  const [mobile, setMobile] = useState(false);
  const signOutForm = useRef<HTMLFormElement>(null);
  const currentItem =
    navigation.find(
      (n) => n.href !== "/dashboard" && pathname.startsWith(n.href),
    ) ?? navigation[0];
  const current = currentItem.label;
  return (
    <div className="dashboard-app">
      <aside className="dashboard-sidebar">
        <Link
          href="/"
          className="dashboard-logo"
          aria-label="Go to EmbedMyNotion home"
        >
          <Logo />
        </Link>
        <p className="nav-label">MENU</p>
        <nav aria-label="Main navigation">
          {navigation.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`dashboard-nav ${current === n.label ? "selected" : ""}`}
              aria-current={current === n.label ? "page" : undefined}
            >
              <n.icon size={17} />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="profile-link"
                  aria-label="Open account menu"
                />
              }
            >
              <Avatar className="dashboard-avatar">
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
              <span>
                {workspace.name}
                <small>{workspace.email}</small>
              </span>
              <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="mb-1">
              <DropdownMenuItem
                render={<Link href="/dashboard/settings" />}
                className="text-[12px] leading-4 font-normal"
              >
                <Settings className="size-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="text-[12px] leading-4 font-normal"
                onClick={() => signOutForm.current?.requestSubmit()}
              >
                <LogOut className="size-3.5" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <form
            ref={signOutForm}
            action="/auth/signout"
            method="post"
            className="hidden"
          />
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobile(true)}
          >
            <Menu size={20} />
          </button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/dashboard" />}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href={currentItem.href} />}
                  aria-current="page"
                  className="dashboard-current-crumb"
                >
                  {current}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Badge
            variant="outline"
            className="ml-auto font-normal text-muted-foreground"
          >
            Local demo
          </Badge>
        </header>
        <main className="dashboard-content">{children}</main>
        <footer className="dashboard-footer">
          <span>A little Notion. A lot of possibility.</span>
          <span>EmbedMyNotion</span>
        </footer>
      </div>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-[280px] shadow-none">
          <SheetHeader>
            <SheetTitle>EmbedMyNotion</SheetTitle>
            <SheetDescription>Manage your Notion embeds.</SheetDescription>
          </SheetHeader>
          <nav className="px-2" aria-label="Mobile navigation">
            {navigation.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="dashboard-nav dashboard-mobile-nav"
                onClick={() => setMobile(false)}
              >
                <n.icon size={18} />
                {n.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
export function PageHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
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
                      <FileText size={17} />
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
              onClick={() => {
                update({
                  ...workspace,
                  embeds: workspace.embeds.filter((e) => e.id !== deleting?.id),
                });
                setDeleting(null);
                toast.success("Embed deleted");
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
              Illustrative preview · Not live Notion content.
            </DialogDescription>
          </DialogHeader>
          {preview && <DocumentPreview embed={preview} />}
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
                      <FileText size={20} strokeWidth={1.5} />
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
              onClick={() => {
                update({
                  ...workspace,
                  embeds: workspace.embeds.filter((e) => e.id !== deleting?.id),
                });
                setDeleting(null);
                toast.success("Embed deleted");
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
              Illustrative preview · Not live Notion content.
            </DialogDescription>
          </DialogHeader>
          {preview && <DocumentPreview embed={preview} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
export function UpgradeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { workspace, update } = useWorkspace();
  const [yearly, setYearly] = useState(false);
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
            {" "}
            / {yearly ? "year" : "month"}
          </span>
        </div>
        <div className="space-y-3 text-sm">
          {[
            "25 customizable embeds",
            "Advanced customization — planned",
            "Remove watermark — planned",
          ].map((t) => (
            <p key={t} className="flex gap-3">
              <Check size={16} />
              {t}
            </p>
          ))}
        </div>
        <Button
          size="lg"
          className="dashboard-primary-button mt-3"
          onClick={() => {
            update({ ...workspace, plan: "Pro" });
            onOpenChange(false);
            toast.success(
              "Pro demo enabled. No charge or subscription created.",
            );
          }}
        >
          Try Pro in this demo <ArrowRight size={15} />
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Preview only. Payments are not connected.
        </p>
      </DialogContent>
    </Dialog>
  );
}
