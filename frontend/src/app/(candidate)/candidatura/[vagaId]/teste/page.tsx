"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import ProgressBar from "@/components/ui/ProgressBar";

const perguntas = [
  {
    id: 1,
    texto: "Qual equipamento NÃO é comumente usado em operações de britagem?",
    alternativas: [
      "Britador de mandíbula",
      "Britador cônico",
      "Torno mecânico",
      "Britador de impacto",
    ],
    correta: 2,
  },
  {
    id: 2,
    texto: "Em operações de mineração, o que significa EPI?",
    alternativas: [
      "Equipamento de Produção Industrial",
      "Equipamento de Proteção Individual",
      "Estação de Processamento Integrado",
      "Equipamento de Perfuração Industrial",
    ],
    correta: 1,
  },
  {
    id: 3,
    texto: "Qual a finalidade principal da peneira vibratória numa planta de britagem?",
    alternativas: [
      "Reduzir o tamanho das rochas",
      "Separar diferentes granulometrias do material",
      "Transportar material entre estágios",
      "Lavar o material antes do processamento",
    ],
    correta: 1,
  },
];

export default function TestePage() {
  const router = useRouter();
  const params = useParams();
  const vagaId = params.vagaId as string;

  const [currentQ, setCurrentQ] = useState(0);
  const [respostas, setRespostas] = useState<(number | null)[]>(Array(perguntas.length).fill(null));

  const pergunta = perguntas[currentQ];
  const progress = ((currentQ + 1) / perguntas.length) * 100;

  function selecionar(idx: number) {
    const novas = [...respostas];
    novas[currentQ] = idx;
    setRespostas(novas);
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-8">
          <div className="shrink-0">
            <p className="text-xs text-slate-500 font-medium">Questão</p>
            <h2 className="text-base font-bold text-slate-900">
              {currentQ + 1} de {perguntas.length}
            </h2>
          </div>
          <div className="flex-1">
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <StepIndicator currentStep={2} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">quiz</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Teste de Conhecimento</h1>
              <p className="text-sm text-slate-500">Selecione a alternativa correta</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <p className="text-base font-semibold text-slate-900 leading-relaxed">
              {pergunta.texto}
            </p>
          </div>

          <div className="space-y-3">
            {pergunta.alternativas.map((alt, idx) => {
              const selected = respostas[currentQ] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => selecionar(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <div
                    className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected ? "border-primary bg-primary" : "border-slate-300"
                    }`}
                  >
                    {selected && (
                      <span className="material-symbols-outlined text-white text-sm">check</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{alt}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => {
                if (currentQ > 0) setCurrentQ(currentQ - 1);
                else router.push(`/candidatura/${vagaId}/perfil`);
              }}
              className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Anterior
            </button>

            <button
              onClick={() => {
                if (currentQ < perguntas.length - 1) {
                  setCurrentQ(currentQ + 1);
                } else {
                  router.push(`/candidatura/${vagaId}/curriculo`);
                }
              }}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
            >
              {currentQ < perguntas.length - 1 ? "Próxima" : "Finalizar Teste"}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
