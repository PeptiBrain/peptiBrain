// Tipos y constantes del tablero de Ideas / Feature Requests. Compartidos entre
// la página pública, el board client y los endpoints. La UI (etiquetas visibles)
// vive en messages/*.json bajo "Ideas"; aquí solo los ids estables.

export const IDEA_STATUSES = ["open", "planned", "in_progress", "done", "declined"] as const;
export type IdeaStatus = (typeof IDEA_STATUSES)[number];

// Estados que se muestran en el Roadmap, en orden de "esto viene → ya está".
export const ROADMAP_STATUSES: IdeaStatus[] = ["planned", "in_progress", "done"];

export const IDEA_CATEGORIES = ["calculo", "seguimiento", "familia", "ia", "otra"] as const;
export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];

export type Idea = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: IdeaStatus;
  vote_count: number;
  created_at: string;
};
