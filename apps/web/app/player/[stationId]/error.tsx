"use client";

const PlayerError = ({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) => {
  return (
    <main style={{ padding: 32 }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: 24,
          display: "grid",
          gap: 16
        }}
      >
        <p style={{ margin: 0, color: "#b42318" }}>{error.message || "Failed to load player."}</p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: 0,
            borderRadius: 999,
            padding: "12px 16px",
            background: "var(--accent)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    </main>
  );
};

export default PlayerError;
