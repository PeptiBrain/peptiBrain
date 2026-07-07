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
  description: string;
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
    description:
      "Pentadecapéptido derivado de una proteína gástrica. Conocido por sus propiedades de reparación tisular y salud digestiva.",
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
    description:
      "Fragmento sintético de la timosina beta-4. Promueve la cicatrización, regeneración celular y movilidad.",
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
    description:
      "Agonista del receptor GLP-1. Reduce el apetito, retrasa el vaciamiento gástrico y mejora la sensibilidad a la insulina.",
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
    description:
      "Agonista dual GIP/GLP-1. Apoya el control de peso y mejora la sensibilidad a la insulina.",
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
    description:
      "Secretagogo selectivo de hormona de crecimiento, con un perfil de efectos secundarios más suave que otros análogos.",
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
    description:
      "Análogo de acción prolongada de la hormona liberadora de GH. Suele combinarse con Ipamorelina.",
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
    description:
      "Agonista triple GIP/GLP-1/glucagón, en investigación para control de peso.",
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
    description:
      "Fragmento de la hormona de crecimiento asociado al metabolismo de las grasas.",
  },
  {
    name: "Cagrilintide",
    route: "Subcutánea",
    commonDose: "0.5",
    doseUnit: "mg",
    vialAmount: "5",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "1x por semana",
    tags: ["Control de peso"],
    description:
      "Análogo de la amilina de acción prolongada. Suele combinarse con un GLP-1 para el control de peso.",
  },
  {
    name: "Adipotide (FTPP)",
    route: "Subcutánea",
    commonDose: "1",
    doseUnit: "mg",
    vialAmount: "10",
    vialUnit: "mg",
    bacWater: "2",
    frequency: "3x por semana",
    tags: ["Control de peso"],
    description:
      "Péptido pro-apoptótico dirigido a los vasos sanguíneos del tejido adiposo blanco. Reduce grasa abdominal.",
  },
  {
    name: "5-Amino-1MQ",
    route: "Oral",
    commonDose: "50",
    doseUnit: "mg",
    vialAmount: "-",
    vialUnit: "mg",
    bacWater: "0",
    frequency: "1x al día",
    tags: ["Metabolismo"],
    description:
      "Inhibidor de la enzima NNMT (nicotinamida N-metiltransferasa). Aumenta los niveles celulares de NAD+.",
  },
  {
    name: "MK-677 (Ibutamoren)",
    route: "Oral",
    commonDose: "25",
    doseUnit: "mg",
    vialAmount: "-",
    vialUnit: "mg",
    bacWater: "0",
    frequency: "1x al día",
    tags: ["Hormona de crecimiento"],
    description:
      "Secretagogo no peptídico de GH activo por vía oral. Imita la acción de la grelina sobre los receptores de GH.",
  },
];
