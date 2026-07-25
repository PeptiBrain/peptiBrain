"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Download, X } from "lucide-react";
import type { AppData } from "@/lib/app-data";

const WIDTH = 1080;
const HEIGHT = 1350;
const LOGO_SIZE = 56;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Genera una tarjeta de protocolo como imagen (canvas nativo, sin librerías
// nuevas) — solo péptidos/dosis/racha, nunca peso ni datos de salud, para no
// filtrar de más en algo pensado para compartir en redes/con amigos.
async function drawCard(canvas: HTMLCanvasElement, data: AppData, name: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, "#0f1e17");
  bg.addColorStop(1, "#132a20");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#34d399";
  ctx.font = "700 44px system-ui, sans-serif";
  ctx.fillText("PeptiBrain", 64, 120);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 56px system-ui, sans-serif";
  const title = name ? `${name}'s protocol` : "My protocol";
  ctx.fillText(title, 64, 220);

  if (data.progress.currentStreak > 0) {
    ctx.fillStyle = "#fbbf24";
    ctx.font = "700 40px system-ui, sans-serif";
    ctx.fillText(`🔥 ${data.progress.currentStreak} day streak`, 64, 290);
  }

  let y = 400;
  ctx.font = "700 42px system-ui, sans-serif";
  data.peptides.slice(0, 6).forEach((p) => {
    const lastDose = data.doses
      .filter((d) => d.peptideId === p.id && d.done)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, 64, y, WIDTH - 128, 130, 24);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 42px system-ui, sans-serif";
    ctx.fillText(p.name, 100, y + 60);

    ctx.fillStyle = "#a7f3d0";
    ctx.font = "400 32px system-ui, sans-serif";
    const doseLine = lastDose ? `${lastDose.amount} ${lastDose.unit} · ${p.route}` : p.route;
    ctx.fillText(doseLine, 100, y + 102);

    y += 160;
  });

  const logo = await loadImage("/icon-192.png");
  const logoY = HEIGHT - 64 - LOGO_SIZE / 2;
  if (logo) {
    ctx.drawImage(logo, 64, logoY - LOGO_SIZE / 2, LOGO_SIZE, LOGO_SIZE);
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("PeptiBrain", 64 + (logo ? LOGO_SIZE + 16 : 0), logoY);
  ctx.textBaseline = "alphabetic";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function ProtocolShareCard({ data, name, onClose }: { data: AppData; name: string; onClose: () => void }) {
  const t = useTranslations("ShareProtocol");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [shareHint, setShareHint] = useState(false);

  function handleCanvasRef(node: HTMLCanvasElement | null) {
    canvasRef.current = node;
    if (node) {
      drawCard(node, data, name).then(() => setReady(true));
    }
  }

  async function getBlob(): Promise<Blob | null> {
    return new Promise((resolve) => canvasRef.current?.toBlob((b) => resolve(b), "image/png"));
  }

  async function handleDownload() {
    const blob = await getBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "peptibrain-protocolo.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    const blob = await getBlob();
    if (!blob) return;
    const file = new File([blob], "peptibrain-protocolo.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      // En el celular esto abre el panel nativo de compartir — WhatsApp,
      // Instagram, etc. aparecen ahí solos, según lo que el usuario tenga
      // instalado. No hay forma de "enviar directo" a una app desde la web
      // sin pasar por ese panel del sistema.
      try {
        await navigator.share({ files: [file], title: "PeptiBrain" });
      } catch {
        // el usuario canceló el panel de compartir — no es un error real
      }
    } else {
      // En computadora no existe ese panel — se descarga la imagen y se
      // avisa que hay que subirla a mano.
      setShareHint(true);
      handleDownload();
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-sm flex-col items-center rounded-2xl bg-card p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex w-full items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{t("title")}</p>
          <button type="button" onClick={onClose} aria-label={t("close")} className="text-muted-foreground">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <canvas
          ref={handleCanvasRef}
          className="max-h-[60vh] w-full rounded-xl border border-border object-contain"
          style={{ aspectRatio: `${WIDTH}/${HEIGHT}` }}
        />
        <div className="mt-4 flex w-full gap-2">
          <button
            type="button"
            disabled={!ready}
            onClick={handleDownload}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-medium text-foreground disabled:opacity-50"
          >
            <Download className="size-4" aria-hidden /> {t("download")}
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={handleShare}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Share2 className="size-4" aria-hidden /> {t("share")}
          </button>
        </div>
        {shareHint && <p className="mt-2 text-center text-xs text-muted-foreground">{t("shareDesktopHint")}</p>}
      </div>
    </div>
  );
}
