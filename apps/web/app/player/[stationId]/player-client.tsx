"use client";

import { useEffect, useState } from "react";
import type { WidgetPayload } from "@the-urban-radio/contracts";
import { getFunctionsBaseUrl } from "../../../lib/firebase/client";

export function PlayerClient({
  stationId
}: {
  stationId: string;
}) {
  const [payload, setPayload] = useState<WidgetPayload | null>(null);

  useEffect(() => {
    fetch(`${getFunctionsBaseUrl()}/widgetFeed?stationId=${encodeURIComponent(stationId)}`)
      .then((response) => response.json())
      .then((data: WidgetPayload) => {
        setPayload(data);
      });
  }, [stationId]);

  return (
    <main style={{ padding: 32 }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: 24
        }}
      >
        <p style={{ textTransform: "uppercase", color: "var(--accent)", letterSpacing: "0.12em" }}>
          Public Player
        </p>
        <h1 style={{ marginTop: 0 }}>{payload?.title ?? "Loading..."}</h1>
        <p>{payload?.artist ?? stationId}</p>
        <p>Listeners: {payload?.listeners ?? 0}</p>
      </div>
    </main>
  );
}
