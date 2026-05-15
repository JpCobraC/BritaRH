/**
 * Schemas de validação do formulário de criação/edição de vaga.
 *
 * Usado tanto no client-side (React Hook Form + Zod resolver)
 * quanto nas server actions para garantir consistência.
 *
 * Regras de negócio documentadas em:
 *   openspec/changes/vacancy-management/specs/test-question-builder/spec.md
 *   openspec/changes/vacancy-management/specs/vacancy-creation/spec.md
 */

import { z } from "zod";

/* =========================================================
   SCHEMA DE QUESTÃO INDIVIDUAL
   ========================================================= */
export const questionSchema = z.object({
  text: z.string().min(1, "O enunciado da questão não pode ser vazio."),
  options: z
    .array(z.string().min(1, "A alternativa não pode ser vazia."))
    .length(4, "Cada questão deve ter exatamente 4 alternativas."),
  correct_index: z
    .number()
    .int()
    .min(0, "Índice da resposta correta inválido.")
    .max(3, "Índice da resposta correta inválido."),
});

export type Question = z.infer<typeof questionSchema>;

/* =========================================================
   SCHEMA DO ARRAY DE QUESTÕES
   Mínimo 5, máximo 20 — regra central do test-question-builder.
   ========================================================= */
export const questionsSchema = z
  .array(questionSchema)
  .min(5, "mínimo de 5 questões obrigatório.")
  .max(20, "máximo de 20 questões permitido.");

/* =========================================================
   SCHEMA COMPLETO DA VAGA
   ========================================================= */
export const jobSchema = z.object({
  title: z.string().min(1, "Título é obrigatório."),
  area: z.string().min(1, "Área é obrigatória."),
  contract_type: z.enum(["CLT", "PJ", "Temporário"], {
    errorMap: () => ({ message: "Tipo de contrato inválido." }),
  }),
  schedule: z.string().min(1, "Carga horária/turno é obrigatória."),
  workplace: z.string().min(1, "Local de trabalho é obrigatório."),
  requirements: z.string().min(1, "Requisitos são obrigatórios."),
  assignments: z.string().min(1, "Atribuições são obrigatórias."),
  questions: questionsSchema,
});

export type JobFormData = z.infer<typeof jobSchema>;
