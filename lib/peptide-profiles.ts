export type PeptideProfile = {
  name: string;
  route: string;
  commonDose: string;
  doseUnit: string;
  vialAmount: string;
  vialUnit: string;
  bacWater: string;
  frequency: string;
  tags: string[];
};

// Valores típicos de referencia — el usuario los puede ajustar libremente.
// No es consejo médico: solo agiliza el llenado del formulario (ver Constitución del Producto).
export const PEPTIDE_PROFILES: PeptideProfile[] = [
  {
    name: "BPC-157",
    route: "Subcutánea",
    commonDose: "250",
    doseUnit: "mcg",
    vialAmount: "5",
    vialUnit: "mg",
    bacWater: "3",
    frequency: "1-2x al día",
    tags: ["Reparación tisular", "Salud digestiva"],
  },
  {
    name: "TB-500",
    route: "Subcutánea",
    commonDose: "2",
    doseUnit: "mg",
    vialAmount: "10",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "2x por semana",
    tags: ["Recuperación", "Movilidad"],
  },
  {
    name: "Semaglutida",
    route: "Subcutánea",
    commonDose: "0.25",
    doseUnit: "mg",
    vialAmount: "5",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "1x por semana",
    tags: ["Control de peso"],
  },
  {
    name: "Tirzepatida",
    route: "Subcutánea",
    commonDose: "2.5",
    doseUnit: "mg",
    vialAmount: "10",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "1x por semana",
    tags: ["Control de peso"],
  },
  {
    name: "Ipamorelina",
    route: "Subcutánea",
    commonDose: "200",
    doseUnit: "mcg",
    vialAmount: "5",
    vialUnit: "mg",
    bacWater: "2.5",
    frequency: "1-2x al día",
    tags: ["Hormona de crecimiento"],
  },
  {
    name: "CJC-1295",
    route: "Subcutánea",
    commonDose: "100",
    doseUnit: "mcg",
    vialAmount: "5",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "1x al día",
    tags: ["Hormona de crecimiento"],
  },
  {
    name: "Retatrutida",
    route: "Subcutánea",
    commonDose: "2",
    doseUnit: "mg",
    vialAmount: "10",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "1x por semana",
    tags: ["Control de peso"],
  },
  {
    name: "AOD-9604",
    route: "Subcutánea",
    commonDose: "300",
    doseUnit: "mcg",
    vialAmount: "5",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "1x al día",
    tags: ["Metabolismo"],
  },
];
