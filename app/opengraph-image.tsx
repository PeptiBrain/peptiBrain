import { ImageResponse } from "next/og";

// Imagen de vista previa de marca (la que sale al compartir un enlace en WhatsApp,
// Facebook, X, LinkedIn…). Se genera al vuelo con next/og — nítida, sin subir archivos.
export const alt = "PeptiBrain — Tu diario de péptidos y bienestar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 84,
          background: "linear-gradient(135deg, #1CD39C 0%, #00A87E 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: 30,
              background: "#ffffff",
              color: "#00A87E",
              fontSize: 68,
              fontWeight: 800,
            }}
          >
            P
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>PeptiBrain</div>
          <div style={{ fontSize: 46, marginTop: 22, opacity: 0.96 }}>
            Calcula tus dosis. Lleva tu protocolo. Gratis.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 32, opacity: 0.85 }}>peptibrain.com</div>
      </div>
    ),
    { ...size }
  );
}
