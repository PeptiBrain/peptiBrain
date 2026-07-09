let confettiModule: typeof import("canvas-confetti") | null = null;

export async function celebrate() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (!confettiModule) {
    confettiModule = (await import("canvas-confetti")).default as unknown as typeof import("canvas-confetti");
  }
  const confetti = confettiModule as unknown as (opts?: Record<string, unknown>) => void;

  const colors = ["#3fae7d", "#6bc79b", "#f4a340"];
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors,
    zIndex: 9999,
  });
  setTimeout(() => {
    confetti({ particleCount: 50, spread: 100, origin: { y: 0.5 }, colors, zIndex: 9999 });
  }, 200);
}
