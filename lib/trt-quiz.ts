export type TrtQuizBand = "bajo" | "medio" | "alto";

export const TRT_QUIZ_QUESTION_COUNT = 8;

// Puntaje simple: 1 punto por síntoma marcado como "sí", sobre 8 preguntas.
// Esto NO diagnostica nada — es una lista de síntomas comunes asociados en la
// literatura a testosterona baja, pensada solo para decidir si vale la pena
// pedir un análisis de sangre. La única forma real de saberlo es un análisis.
export function scoreTrtQuiz(answers: boolean[]): { score: number; band: TrtQuizBand } {
  const score = answers.filter(Boolean).length;
  const band: TrtQuizBand = score <= 2 ? "bajo" : score <= 5 ? "medio" : "alto";
  return { score, band };
}
