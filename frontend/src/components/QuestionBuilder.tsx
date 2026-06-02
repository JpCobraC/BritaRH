"use client";

/**
 * QuestionBuilder — componente para adicionar/remover questões de múltipla escolha.
 *
 * Usado na tela de criação e edição de vagas pelo recrutador.
 * Regras de negócio (spec: test-question-builder/spec.md):
 *   - Mínimo de 5 questões para salvar a vaga
 *   - Máximo de 20 questões
 *   - Cada questão: enunciado + 4 alternativas + seleção da correta
 *
 * Props:
 *   initialQuestions — número de blocos pré-renderizados (para testes e edição)
 *   onSubmit         — callback chamado ao clicar em "Publicar Vaga" com dados válidos
 */

import React, { useState } from "react";

/* =========================================================
   TIPOS
   ========================================================= */
interface QuestionData {
  text: string;
  options: [string, string, string, string];
  correct_index: number;
}

interface QuestionBuilderProps {
  /** Pré-carrega N blocos de questão (útil para modo edição e testes). */
  initialQuestions?: number;
  onSubmit?: (questions: QuestionData[]) => void;
}

/* =========================================================
   HELPER — cria uma questão em branco
   ========================================================= */
const emptyQuestion = (): QuestionData => ({
  text: "",
  options: ["", "", "", ""],
  correct_index: 0,
});

const buildInitial = (n: number): QuestionData[] =>
  Array.from({ length: n }, emptyQuestion);

/* =========================================================
   COMPONENTE
   ========================================================= */
export function useQuestionBuilder(initialQuestions: number, onSubmit?: (questions: QuestionData[]) => void) {
  const [questions, setQuestions] = useState<QuestionData[]>(
    buildInitial(initialQuestions)
  );
  const [minError, setMinError] = useState(false);

  const atMax = questions.length >= 20;
  const MIN = 5;

  const addQuestion = () => {
    if (atMax) return;
    setQuestions((prev) => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (
    index: number,
    field: keyof QuestionData,
    value: unknown
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = [...q.options] as [string, string, string, string];
        options[optIndex] = value;
        return { ...q, options };
      })
    );
  };

  const handleSubmit = () => {
    if (questions.length < MIN) {
      setMinError(true);
      return;
    }
    setMinError(false);
    onSubmit?.(questions);
  };

  return {
    questions,
    minError,
    atMax,
    addQuestion,
    removeQuestion,
    updateField,
    updateOption,
    handleSubmit,
  };
}

export default function QuestionBuilder({
  initialQuestions = 0,
  onSubmit,
}: QuestionBuilderProps) {
  const {
    questions,
    minError,
    atMax,
    addQuestion,
    removeQuestion,
    updateField,
    updateOption,
    handleSubmit,
  } = useQuestionBuilder(initialQuestions, onSubmit);

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div>
      {/* Lista de blocos de questão */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} data-testid="question-block">
          <span>Questão {qIndex + 1}</span>

          {/* Enunciado */}
          <input
            data-testid="question-text"
            placeholder="Enunciado da questão"
            value={q.text}
            onChange={(e) => updateField(qIndex, "text", e.target.value)}
          />

          {/* Alternativas */}
          {(["A", "B", "C", "D"] as const).map((letter, optIndex) => (
            <div key={letter}>
              <input
                data-testid="option-input"
                placeholder={`Alternativa ${letter}`}
                value={q.options[optIndex]}
                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
              />
              <input
                type="radio"
                data-testid="option-correct-radio"
                name={`correct-${qIndex}`}
                checked={q.correct_index === optIndex}
                onChange={() => updateField(qIndex, "correct_index", optIndex)}
              />
            </div>
          ))}

          {/* Botão remover */}
          <button
            type="button"
            onClick={() => removeQuestion(qIndex)}
            aria-label="Remover questão"
          >
            Remover
          </button>
        </div>
      ))}

      {/* Mensagem de limite máximo */}
      {atMax && (
        <p>Limite de 20 questões atingido.</p>
      )}

      {/* Mensagem de mínimo */}
      {minError && (
        <p>mínimo de 5 questões obrigatório.</p>
      )}

      {/* Botão adicionar */}
      <button
        type="button"
        onClick={addQuestion}
        disabled={atMax}
        aria-label="Adicionar questão"
      >
        + Adicionar questão
      </button>

      {/* Botão de submit */}
      <button type="button" onClick={handleSubmit}>
        Publicar Vaga
      </button>
    </div>
  );
}
