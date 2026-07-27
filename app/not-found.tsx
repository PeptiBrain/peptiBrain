import Link from "next/link";

// El 404 era el de Next.js por defecto: en inglés, sin marca y sin salida —
// un callejón sin salida justo cuando alguien ya está perdido (bug #69).
//
// Vive en app/ (no en app/[locale]/) a propósito: una URL que no existe puede
// no llevar prefijo de idioma, así que aquí no hay locale del que tirar. Por eso
// el texto es bilingüe en lugar de traducido: más vale decirlo en los dos
// idiomas que arriesgarse a decirlo en el equivocado.
export default function NotFound() {
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
          gap: "0.75rem",
          padding: "2rem 1.5rem",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0E1116",
          color: "#F5F6F8",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.8125rem", letterSpacing: "0.08em", color: "#7C8698" }}>
          PEPTIBRAIN
        </p>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, maxWidth: "24rem" }}>
          Esta página no existe
        </h1>
        <p style={{ margin: 0, fontSize: "0.9375rem", color: "#A6AFBE", maxWidth: "24rem" }}>
          Puede que el enlace esté mal escrito o que la página se haya movido.
          <br />
          <span style={{ color: "#7C8698" }}>This page doesn&apos;t exist.</span>
        </p>
        <Link
          href="/"
          style={{
            marginTop: "0.75rem",
            display: "inline-flex",
            alignItems: "center",
            height: "2.75rem",
            padding: "0 1.5rem",
            borderRadius: "0.5rem",
            background: "#4F7DF3",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </body>
    </html>
  );
}
