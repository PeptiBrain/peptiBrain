import Image from "next/image";

const MASCOT_SIZES: Record<string, { w: number; h: number }> = {
  waving: { w: 311, h: 324 },
  celebrating: { w: 358, h: 350 },
  pointing: { w: 330, h: 320 },
  sleeping: { w: 277, h: 307 },
};

export function Mascot({
  state,
  size = 96,
  className = "",
}: {
  state: "waving" | "celebrating" | "pointing" | "sleeping";
  size?: number;
  className?: string;
}) {
  const { w, h } = MASCOT_SIZES[state];
  const height = Math.round((size * h) / w);
  return (
    <Image
      src={`/mascota/${state}.png`}
      alt=""
      width={size}
      height={height}
      className={className}
      priority={false}
    />
  );
}
