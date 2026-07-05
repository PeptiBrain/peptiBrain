import Image from "next/image";
import { useTranslations } from "next-intl";
import { Syringe, Flame, Check, Droplet } from "lucide-react";
import type { CSSProperties } from "react";

/**
 * Panel "Semaglutida" recreado 1:1 desde el diseño de Claude Design
 * (Diseños/recreating-image-design/project/Panel Semaglutida.dc.html).
 * Todo se dibuja en vivo (CSS puro) → nítido a cualquier tamaño, sin pixelarse.
 * Escala fluida: --u = 1 "px de diseño" = 100cqw/720 respecto al contenedor.
 */

const DISPLAY = "var(--font-display)"; // Poppins
const BODY = "var(--font-body)"; // Inter
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

// helper: convierte px de diseño a una medida fluida
const u = (n: number) => `calc(${n} * var(--u))`;

export function HeroPanel() {
  const t = useTranslations("HeroPanel");
  const days = t.raw("days") as string[];

  return (
    <div style={{ containerType: "inline-size", width: "100%", maxWidth: 600 }}>
      <div
        style={
          {
            "--u": "calc(100cqw / 720)",
            width: u(720),
            position: "relative",
            fontFamily: BODY,
          } as CSSProperties
        }
      >
        {/* Tarjeta blanca principal */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: u(34),
            padding: `${u(30)} ${u(30)} ${u(34)}`,
            boxShadow: `0 ${u(24)} ${u(60)} ${u(-24)} rgba(30,25,20,0.22), 0 ${u(4)} ${u(14)} rgba(30,25,20,0.05)`,
          }}
        >
          {/* Saludo + wordmark */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: `${u(6)} ${u(4)} 0`,
            }}
          >
            <div>
              <div style={{ fontSize: u(20), color: "#8a938e", fontWeight: 400, letterSpacing: "-0.01em" }}>
                {t("greeting")}
              </div>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontSize: u(34),
                  fontWeight: 700,
                  color: "#122a2b",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  marginTop: u(2),
                  whiteSpace: "nowrap",
                }}
              >
                {t("streakLine")} <span style={{ fontFamily: BODY }}>🔥</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: u(9), marginTop: u(6) }}>
              <Image
                src="/peptibrain-isotipo.svg"
                alt=""
                width={36}
                height={36}
                style={{ width: u(36), height: u(36), display: "block" }}
              />
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontSize: u(20),
                  fontWeight: 700,
                  color: "#122a2b",
                  letterSpacing: "-0.02em",
                }}
              >
                PeptiBrain
              </span>
            </div>
          </div>

          {/* Próxima dosis */}
          <div
            style={{
              marginTop: u(22),
              background: "#e9f7ee",
              border: `1px solid rgba(59,199,89,0.18)`,
              borderRadius: u(22),
              padding: `${u(22)} ${u(24)}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: u(19), fontWeight: 600, color: "#2ba24d", letterSpacing: "-0.01em" }}>
                {t("nextDose")}
              </div>
              <div style={{ fontFamily: MONO, fontSize: u(19), fontWeight: 500, color: "#6f7d76" }}>8:00 am</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: u(18), marginTop: u(14) }}>
              <div
                style={{
                  flex: "none",
                  width: u(66),
                  height: u(66),
                  borderRadius: "50%",
                  background: "#22bd5c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 ${u(6)} ${u(16)} ${u(-4)} rgba(34,189,92,0.5)`,
                }}
              >
                <Syringe style={{ width: u(30), height: u(30), color: "#ffffff" }} strokeWidth={2} aria-hidden />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: u(26),
                    fontWeight: 700,
                    color: "#122a2b",
                    letterSpacing: "-0.015em",
                    lineHeight: 1.15,
                  }}
                >
                  Semaglutida
                </div>
                <div style={{ fontSize: u(18), color: "#7c8781", fontWeight: 400, marginTop: u(2) }}>
                  {t("doseDetail")}
                </div>
              </div>
            </div>
          </div>

          {/* Racha + Peso */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: u(20), marginTop: u(22) }}>
            <div style={statCard()}>
              <div style={{ display: "flex", alignItems: "center", gap: u(8) }}>
                <Flame style={{ width: u(22), height: u(22), color: "#ff6a3d" }} strokeWidth={2.25} aria-hidden />
                <span style={{ fontSize: u(19), color: "#7c8781", fontWeight: 400 }}>
                  {t("streakLabel")}
                </span>
              </div>
              <div style={statValue()}>{t("streakValue")}</div>
            </div>
            <div style={statCard()}>
              <span style={{ fontSize: u(19), color: "#7c8781", fontWeight: 400 }}>
                {t("weightLabel")}
              </span>
              <div style={statValue()}>{t("weightValue")}</div>
            </div>
          </div>

          {/* Esta semana */}
          <div
            style={{
              marginTop: u(22),
              background: "#ffffff",
              border: "1px solid #ededeb",
              borderRadius: u(22),
              padding: `${u(22)} ${u(24)} ${u(26)}`,
            }}
          >
            <div style={{ fontSize: u(19), color: "#7c8781", fontWeight: 400 }}>{t("thisWeek")}</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gap: u(6),
                marginTop: u(16),
                textAlign: "center",
              }}
            >
              {days.map((d, i) => (
                <div key={i} style={{ fontSize: u(16), color: "#9aa39d", fontWeight: 500 }}>
                  {d}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gap: u(6),
                marginTop: u(12),
                justifyItems: "center",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={dayCircle("#22bd5c")}>
                  <Check style={{ width: u(22), height: u(22), color: "#fff" }} strokeWidth={3} aria-hidden />
                </div>
              ))}
              <div
                style={{
                  ...dayCircle("#f77052"),
                  boxShadow: `0 0 0 ${u(5)} rgba(247,112,82,0.16)`,
                }}
              />
              <div style={dayCircle("#efefec")} />
              <div style={dayCircle("#efefec")} />
            </div>
          </div>
        </div>

        {/* Pill flotante: Registrada */}
        <div
          style={{
            position: "absolute",
            top: u(120),
            right: u(-14),
            display: "flex",
            alignItems: "center",
            gap: u(12),
            background: "#ffffff",
            borderRadius: 999,
            padding: `${u(12)} ${u(22)} ${u(12)} ${u(14)}`,
            boxShadow: `0 ${u(16)} ${u(34)} ${u(-12)} rgba(30,25,20,0.28), 0 ${u(3)} ${u(10)} rgba(30,25,20,0.08)`,
          }}
        >
          <div
            style={{
              width: u(38),
              height: u(38),
              borderRadius: "50%",
              background: "#22bd5c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check style={{ width: u(22), height: u(22), color: "#fff" }} strokeWidth={3} aria-hidden />
          </div>
          <span style={{ fontFamily: DISPLAY, fontSize: u(20), fontWeight: 600, color: "#122a2b", letterSpacing: "-0.01em" }}>
            {t("registered")}
          </span>
        </div>

        {/* Pill flotante: Agua */}
        <div
          style={{
            position: "absolute",
            bottom: u(-16),
            left: u(34),
            display: "flex",
            alignItems: "center",
            gap: u(10),
            background: "#ffffff",
            borderRadius: 999,
            padding: `${u(12)} ${u(22)}`,
            boxShadow: `0 ${u(16)} ${u(34)} ${u(-12)} rgba(30,25,20,0.28), 0 ${u(3)} ${u(10)} rgba(30,25,20,0.08)`,
          }}
        >
          <Droplet
            style={{ width: u(22), height: u(22), color: "#22bd5c", fill: "rgba(34,189,92,0.15)" }}
            strokeWidth={2.25}
            aria-hidden
          />
          <span style={{ fontSize: u(19), color: "#5a655f", fontWeight: 400 }}>
            <b style={{ color: "#122a2b", fontWeight: 700 }}>1.9 L</b> {t("waterToday")}
          </span>
        </div>
      </div>
    </div>
  );
}

function statCard(): CSSProperties {
  return {
    background: "#ffffff",
    border: "1px solid #ededeb",
    borderRadius: u(22),
    padding: `${u(22)} ${u(24)}`,
  };
}

function statValue(): CSSProperties {
  return {
    fontFamily: DISPLAY,
    fontSize: u(34),
    fontWeight: 700,
    color: "#122a2b",
    letterSpacing: "-0.02em",
    marginTop: u(12),
    fontVariantNumeric: "tabular-nums",
  };
}

function dayCircle(bg: string): CSSProperties {
  return {
    width: u(44),
    height: u(44),
    borderRadius: "50%",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
