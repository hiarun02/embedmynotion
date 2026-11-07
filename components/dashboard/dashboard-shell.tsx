"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Code2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";

import { Logo } from "@/app/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useWorkspace } from "./store";

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
  const isEditorPage =
    pathname === "/dashboard/embeds/new" ||
    /^\/dashboard\/embeds\/[^/]+$/.test(pathname);
  const isCenteredPage =
    pathname === "/dashboard" || pathname === "/dashboard/embeds";
  const currentItem =
    navigation.find(
      (item) =>
        item.href !== "/dashboard" && pathname.startsWith(item.href),
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
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`dashboard-nav ${current === item.label ? "selected" : ""}`}
              aria-current={current === item.label ? "page" : undefined}
            >
              <item.icon size={17} />
              {item.label}
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
                    .map((name) => name[0])
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
            {workspace.demoPlanEnabled
              ? "Local demo"
              : `${workspace.plan} plan`}
          </Badge>
        </header>
        <main
          className={`dashboard-content${isEditorPage ? " dashboard-content-editor" : ""}${isCenteredPage ? " dashboard-content-centered" : ""}`}
        >
          {children}
        </main>
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
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="dashboard-nav dashboard-mobile-nav"
                onClick={() => setMobile(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
