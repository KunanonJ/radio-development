import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ stationId: string }> }
) {
  const { stationId } = await context.params;
  const baseUrl =
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== "false"
      ? `http://${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST ?? "127.0.0.1"}:${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT ?? "5001"}/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "the-urban-radio"}/us-central1`
      : `https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "the-urban-radio"}.cloudfunctions.net`;

  const response = await fetch(`${baseUrl}/widgetFeed?stationId=${encodeURIComponent(stationId)}`, {
    cache: "no-store"
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
