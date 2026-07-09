import { getPeptideIcon } from "@/lib/peptide-visual";

export function PeptideIcon({
  peptideName,
  size = "size-9",
}: {
  peptideName: string;
  size?: string;
}) {
  const Icon = getPeptideIcon(peptideName);
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-primary/15`}>
      <Icon className="size-4 text-primary" aria-hidden />
    </div>
  );
}
