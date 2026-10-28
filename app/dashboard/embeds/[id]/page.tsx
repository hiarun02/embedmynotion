import { Suspense } from "react";
import { EmbedEditor } from "@/components/dashboard/editor";
async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmbedEditor key={id} id={id} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p>Loading editor…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}
