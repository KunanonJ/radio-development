const PlayerLoading = () => {
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
        <p style={{ margin: 0, color: "var(--muted)" }}>Loading public player…</p>
      </div>
    </main>
  );
};

export default PlayerLoading;
