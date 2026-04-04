import { PlaceholderPage } from "@/components/app/PlaceholderPage";

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaceholderPage title="Artist" description={`ID: ${id}`} />;
}
