import { useEffect, useRef, useState } from "react";

/**
 * Loads a portal's data from the API before its pages render.
 *
 * `load` fetches fresh data into the portal's store and resolves to
 *   { ok, changed, error }
 * The first visit waits for it; later visits render from the store straight
 * away, then re-render once if the server data turned out to be different.
 * Pages read the store synchronously, so this keeps them unchanged.
 */
export default function DataGate({ load, hasData, children }) {
  const [ready, setReady] = useState(() => hasData());
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const wasReady = useRef(ready);

  useEffect(() => {
    let active = true;
    load().then((res) => {
      if (!active) return;
      if (!res.ok) {
        if (!wasReady.current) setError(res.error || "Couldn't load your data.");
        return;
      }
      setError("");
      if (!wasReady.current) {
        wasReady.current = true;
        setReady(true);
      } else if (res.changed) {
        setVersion((v) => v + 1);
      }
    });
    return () => { active = false; };
  }, [load]);

  if (!ready) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24, color: "#475569", fontFamily: "inherit" }}>
        {error ? (
          <div>
            <p style={{ marginBottom: 12 }}>{error}</p>
            <button type="button" onClick={() => window.location.reload()} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>
              Try again
            </button>
          </div>
        ) : (
          <p>Loading…</p>
        )}
      </div>
    );
  }

  return <div key={version} style={{ display: "contents" }}>{children}</div>;
}
