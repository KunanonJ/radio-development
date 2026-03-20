import { NextResponse } from "next/server";
import { dashboardSnapshot } from "@the-urban-radio/contracts";

export async function GET() {
  return NextResponse.json({
    station: "urban-demo",
    nowPlaying: {
      title: "City Lights",
      artist: "The Urban Radio Orchestra"
    },
    listeners: dashboardSnapshot.listeners
  });
}
