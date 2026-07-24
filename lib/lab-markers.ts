// Marcadores comunes en protocolos de TRT/GLP-1/péptidos — solo nombres y
// unidad típica de referencia, sin rangos "normales" (eso sería consejo
// médico). El usuario puede elegir "Otro" y escribir cualquier marcador.
export const LAB_MARKER_IDS = [
  "testosterona_total",
  "testosterona_libre",
  "estradiol",
  "hematocrito",
  "psa",
  "glucosa",
  "hba1c",
  "colesterol_total",
  "ldl",
  "hdl",
  "trigliceridos",
  "igf1",
  "tsh",
  "otro",
] as const;

export type LabMarkerId = (typeof LAB_MARKER_IDS)[number];

export const LAB_MARKER_DEFAULT_UNIT: Record<LabMarkerId, string> = {
  testosterona_total: "ng/dL",
  testosterona_libre: "pg/mL",
  estradiol: "pg/mL",
  hematocrito: "%",
  psa: "ng/mL",
  glucosa: "mg/dL",
  hba1c: "%",
  colesterol_total: "mg/dL",
  ldl: "mg/dL",
  hdl: "mg/dL",
  trigliceridos: "mg/dL",
  igf1: "ng/mL",
  tsh: "mIU/L",
  otro: "",
};
