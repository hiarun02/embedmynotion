"use client";
import { useWorkspace, WorkspaceProvider } from "./store";
import { DocumentPreview } from "./preview";
function Content({ id }: { id: string }) {
  const { workspace } = useWorkspace();
  const embed = workspace.embeds.find((e) => e.id === id);
  if (!embed || !embed.active)
    return (
      <div className="empty-state">
        <h1>Embed unavailable</h1>
        <p>This embed is inactive, deleted, or not saved in this browser.</p>
      </div>
    );
  return (
    <>
      <p className="preview-disclaimer">
        Demo preview · Illustrative content, not a live Notion page
      </p>
      <DocumentPreview embed={embed} />
    </>
  );
}
export function PublicPreview({ id }: { id: string }) {
  return (
    <WorkspaceProvider>
      <Content id={id} />
    </WorkspaceProvider>
  );
}
