"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  initialWorkspace,
  storageKey,
  validWorkspace,
  type AuthenticatedProfile,
  type Workspace,
} from "@/lib/dashboard-model";
import { Skeleton } from "@/components/ui/skeleton";
const Context = createContext<{
  workspace: Workspace;
  update: (value: Workspace) => void;
} | null>(null);
export function WorkspaceProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile?: AuthenticatedProfile;
}) {
  const [workspace, setWorkspace] = useState<Workspace>({
    ...initialWorkspace,
    ...(profile ?? {}),
  });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (!validWorkspace(parsed)) throw new Error("Invalid demo data");
          setWorkspace({ ...initialWorkspace, ...parsed, ...(profile ?? {}) });
        }
      } catch {
        toast.error(
          "Saved demo data could not be loaded. Showing the sample workspace.",
        );
      }
      setReady(true);
    });
  }, [profile]);
  function update(value: Workspace) {
    setWorkspace(value);
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      toast.error(
        "Changes are available for this session, but browser storage is unavailable.",
      );
    }
  }
  if (!ready)
    return (
      <div
        className="mx-auto max-w-6xl space-y-6 p-10"
        aria-label="Loading dashboard"
      >
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  return (
    <Context.Provider value={{ workspace, update }}>
      {children}
    </Context.Provider>
  );
}
export function useWorkspace() {
  const context = useContext(Context);
  if (!context) throw new Error("Workspace provider missing");
  return context;
}
