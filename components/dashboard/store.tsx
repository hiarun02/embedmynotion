"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Workspace } from "@/lib/dashboard-model";
const Context = createContext<{
  workspace: Workspace;
  update: (value: Workspace) => void;
} | null>(null);
export function WorkspaceProvider({
  children,
  initialWorkspace,
}: {
  children: ReactNode;
  initialWorkspace: Workspace;
}) {
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);

  function update(value: Workspace) {
    setWorkspace(value);
  }

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
