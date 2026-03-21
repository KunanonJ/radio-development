import { PlayerClient } from "./player-client";

export default async function PlayerPage({
  params
}: {
  params: Promise<{ stationId: string }>;
}) {
  const { stationId } = await params;

  return <PlayerClient stationId={stationId} />;
}
