import {
  Flame,
  Dumbbell,
  HeartPulse,
  Infinity as InfinityIcon,
  Moon,
  Sparkles,
  Brain,
  Heart,
  Droplets,
  Shield,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { PEPTIDE_PROFILES, type PeptideCategoryId } from "@/lib/peptide-profiles";

// Un ícono distinto por categoría — variedad visual sin salirse de la paleta de marca
// (un solo color, el ícono es lo que distingue el tipo de péptido de un vistazo).
const CATEGORY_ICONS: Record<PeptideCategoryId, LucideIcon> = {
  peso: Flame,
  musculo_gh: Dumbbell,
  recuperacion: HeartPulse,
  longevidad: InfinityIcon,
  sueno: Moon,
  piel_belleza: Sparkles,
  cognicion: Brain,
  libido: Heart,
  intestinal: Droplets,
  inmunidad: Shield,
};

export function getPeptideIcon(peptideName: string): LucideIcon {
  const profile = PEPTIDE_PROFILES.find(
    (p) => p.name.toLowerCase() === peptideName.trim().toLowerCase()
  );
  const category = profile?.categories[0];
  if (category && CATEGORY_ICONS[category]) return CATEGORY_ICONS[category];
  return Syringe;
}
