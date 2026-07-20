import Image from "next/image";
import { getPeptideBottleImage } from "@/lib/vial-visual";

export function PeptideIcon({
  peptideName,
  size = "size-9",
}: {
  peptideName: string;
  size?: string;
}) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center`}>
      <Image
        src={getPeptideBottleImage(peptideName || "peptibrain")}
        alt=""
        width={40}
        height={40}
        className={`${size} object-contain`}
      />
    </div>
  );
}
