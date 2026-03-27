/**
 * Testes do schema de validação do formulário de vaga.
 *
 * Testa a lógica de validação pura (sem UI) que será usada
 * tanto no client-side quanto na server action.
 *
 * Estado TDD: RED — vai falhar até que lib/validations/job.ts exista.
 */

// @ts-expect-error — módulo ainda não existe (RED phase)
import { jobSchema, questionsSchema } from "@/lib/validations/job";

describe("jobSchema — campos obrigatórios", () => {
  const validPayload = {
    title: "Operador de Britagem",
    area: "Operações",
    contract_type: "CLT",
    schedule: "Segunda a Sexta, 07h–16h",
    workplace: "Planta Areia Branca – RN",
    requirements: "Mínimo 1 ano de experiência.",
    assignments: "Operar britador primário.",
    questions: Array.from({ length: 5 }, (_, i) => ({
      text: `Questão ${i + 1}?`,
      options: ["A", "B", "C", "D"],
      correct_index: 0,
    })),
  };

  it("aceita payload completamente válido", () => {
    expect(() => jobSchema.parse(validPayload)).not.toThrow();
  });

  it("rejeita payload sem título", () => {
    const { title, ...rest } = validPayload;
    expect(() => jobSchema.parse(rest)).toThrow();
  });

  it("rejeita payload sem área", () => {
    const { area, ...rest } = validPayload;
    expect(() => jobSchema.parse(rest)).toThrow();
  });

  it("rejeita payload sem contract_type", () => {
    const { contract_type, ...rest } = validPayload;
    expect(() => jobSchema.parse(rest)).toThrow();
  });

  it("rejeita payload sem schedule", () => {
    const { schedule, ...rest } = validPayload;
    expect(() => jobSchema.parse(rest)).toThrow();
  });

  it("rejeita payload sem workplace", () => {
    const { workplace, ...rest } = validPayload;
    expect(() => jobSchema.parse(rest)).toThrow();
  });

  it("rejeita payload sem requirements", () => {
    const { requirements, ...rest } = validPayload;
    expect(() => jobSchema.parse(rest)).toThrow();
  });

  it("rejeita payload sem assignments", () => {
    const { assignments, ...rest } = validPayload;
    expect(() => jobSchema.parse(rest)).toThrow();
  });
});

describe("questionsSchema — regras de quantidade", () => {
  const makeQuestions = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      text: `Questão ${i + 1}?`,
      options: ["A", "B", "C", "D"],
      correct_index: 0,
    }));

  it("aceita exatamente 5 questões (mínimo)", () => {
    expect(() => questionsSchema.parse(makeQuestions(5))).not.toThrow();
  });

  it("aceita exatamente 20 questões (máximo)", () => {
    expect(() => questionsSchema.parse(makeQuestions(20))).not.toThrow();
  });

  it("rejeita 4 questões (abaixo do mínimo)", () => {
    expect(() => questionsSchema.parse(makeQuestions(4))).toThrow(
      /mínimo.*5/i
    );
  });

  it("rejeita 21 questões (acima do máximo)", () => {
    expect(() => questionsSchema.parse(makeQuestions(21))).toThrow(
      /máximo.*20/i
    );
  });

  it("rejeita questão com menos de 4 alternativas", () => {
    const questions = makeQuestions(5);
    questions[0].options = ["A", "B"];
    expect(() => questionsSchema.parse(questions)).toThrow();
  });

  it("rejeita questão com correct_index fora do intervalo 0–3", () => {
    const questions = makeQuestions(5);
    questions[0].correct_index = 4;
    expect(() => questionsSchema.parse(questions)).toThrow();
  });

  it("rejeita questão com enunciado vazio", () => {
    const questions = makeQuestions(5);
    questions[0].text = "";
    expect(() => questionsSchema.parse(questions)).toThrow();
  });
});
