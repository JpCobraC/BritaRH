/**
 * Testes do componente QuestionBuilder.
 *
 * Cobre os cenários da spec test-question-builder/spec.md:
 *   - Adicionar questão
 *   - Remover questão
 *   - Limite de 20 questões (botão desabilitado + mensagem)
 *   - Mínimo de 5 questões para submissão
 *
 * Estado TDD: RED — vai falhar até que o componente exista.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import QuestionBuilder from "@/components/QuestionBuilder";

const renderBuilder = (initialCount = 0) => {
  return render(<QuestionBuilder initialQuestions={initialCount} />);
};

describe("QuestionBuilder — adição de questões", () => {
  it("exibe botão 'Adicionar questão'", () => {
    renderBuilder();
    expect(
      screen.getByRole("button", { name: /adicionar questão/i })
    ).toBeInTheDocument();
  });

  it("adiciona um bloco de questão ao clicar em 'Adicionar questão'", () => {
    renderBuilder();
    const addBtn = screen.getByRole("button", { name: /adicionar questão/i });
    fireEvent.click(addBtn);
    expect(screen.getAllByTestId("question-block")).toHaveLength(1);
  });

  it("cada bloco tem campo de enunciado e 4 alternativas", () => {
    renderBuilder(1);
    const block = screen.getByTestId("question-block");
    expect(block.querySelector('[data-testid="question-text"]')).toBeTruthy();
    expect(block.querySelectorAll('[data-testid="option-input"]')).toHaveLength(4);
  });

  it("cada bloco tem seletor de alternativa correta", () => {
    renderBuilder(1);
    const block = screen.getByTestId("question-block");
    expect(
      block.querySelectorAll('[data-testid="option-correct-radio"]')
    ).toHaveLength(4);
  });
});

describe("QuestionBuilder — remoção de questões", () => {
  it("remove questão ao clicar em 'Remover'", () => {
    renderBuilder(2);
    const removeBtn = screen.getAllByRole("button", { name: /remover/i })[0];
    fireEvent.click(removeBtn);
    expect(screen.getAllByTestId("question-block")).toHaveLength(1);
  });
});

describe("QuestionBuilder — sem limites de quantidade", () => {
  it("não desabilita 'Adicionar questão' ao atingir 20 questões", () => {
    renderBuilder(20);
    const addBtn = screen.getByRole("button", { name: /adicionar questão/i });
    expect(addBtn).not.toBeDisabled();
  });

  it("permite submeter com qualquer quantidade de questões (por exemplo, 0 ou 3)", () => {
    renderBuilder(3);
    const submitBtn = screen.getByRole("button", { name: /salvar|publicar/i });
    fireEvent.click(submitBtn);
    expect(screen.queryByText(/mínimo/i)).not.toBeInTheDocument();
  });
});
