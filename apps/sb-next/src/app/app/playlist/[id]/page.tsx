import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaceholderPage title={`Playlist`} description={`ID: ${id}`} />;
}
