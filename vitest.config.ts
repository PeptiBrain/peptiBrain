import { defineConfig } from "vitest/config";
import path from "node:path";

// Pruebas de la LÓGICA pura (matemática de dosis, validación, fechas, estadísticas).
// No necesitan navegador, ni sesión iniciada, ni base de datos: por eso pueden
// correr en segundos en cada cambio, que es justo lo que faltaba — hasta ahora
// cada arreglo se verificaba a mano y nada avisaba si rompía otra cosa.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
