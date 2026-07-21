"use client";

import { useEffect } from "react";
import { logError } from "@/lib/error-log";

// Solo se activa si falla el layout raíz mismo (rarísimo) — por eso lleva su propio
// <html>/<body> y estilos inline, sin depender de nada que pudo haber fallado.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logError(error, typeof window !== "undefined" ? window.location.pathname : "global");
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#FAFBFA",
          color: "#10162A",
        }}
      >
        <div style={{ fontSize: 32 }}>⚠️</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Algo salió mal</h1>
        <p style={{ fontSize: 14, color: "#5B6478", maxWidth: 320, margin: 0 }}>
          No pudimos cargar PeptiBrain. Ya quedó registrado — intenta de nuevo en un momento.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            height: 44,
            padding: "0 20px",
            borderRadius: 8,
            background: "#00C896",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
