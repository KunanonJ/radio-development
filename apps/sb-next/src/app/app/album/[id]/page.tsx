import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaceholderPage title="Album" description={`ID: ${id}`} />;
}
