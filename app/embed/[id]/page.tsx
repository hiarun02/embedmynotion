import { Suspense } from "react";
import { PublicPreview } from "@/components/dashboard/public-preview";
import "@/app/dashboard/dashboard.css";
async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicPreview id={id} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p>Loading embed…</p>}>
      <Content params={params} />
    </Suspense>
  );
}
