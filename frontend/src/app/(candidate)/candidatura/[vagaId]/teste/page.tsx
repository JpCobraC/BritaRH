"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import ProgressBar from "@/components/ui/ProgressBar";
import { useApplicationWizard } from "@/presentation/contexts/ApplicationWizardContext";
import { useJobDetails } from "@/presentation/hooks/useJobDetails";

export default function TestePage() {
  const router = useRouter();
  const params = useParams();
  const vagaId = params.vagaId as string;

  const { job, loading, error } = useJobDetails(vagaId);
  const { answers, updateAnswers } = useApplicationWizard();
  
  const [currentQ, setCurrentQ] = useState(0);

  const questions = useMemo(() => {
    return job?.questions || [];
  }, [job]);

  const currentAnswers = useMemo(() => {
    const padded = [...answers];
    while (padded.length < questions.length) {
      padded.push(null);
    }
    return padded;
  }, [answers, questions.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background-light">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Carregando questionário...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background-light px-6 text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
        <h2 className="text-xl font-bold text-slate-800">Ops, algo deu errado!</h2>
        <p className="text-slate-600 max-w-md">{error}</p>
        <button 
          onClick={() => router.push(`/candidatura/${vagaId}/perfil`)}
          className="mt-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
        >
          Voltar ao Perfil
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-fadeIn">
          <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">task_alt</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Sem Questionário</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Esta vaga não exige um questionário específico. Você pode prosseguir diretamente para o envio do seu currículo.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/candidatura/${vagaId}/perfil`)}
              className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
            >
              Voltar ao Perfil
            </button>
            <button
              onClick={() => router.push(`/candidatura/${vagaId}/curriculo`)}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md shadow-primary/20"
            >
              Continuar para Currículo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pergunta = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  function selecionar(idx: number) {
    const novas = [...currentAnswers];
    novas[currentQ] = idx;
    
    const score = job ? job.calculateScore(novas) : 0;
    updateAnswers(novas, score);
  }

  // As opções podem ser enviadas como array de strings
  const alternativas = pergunta.options;

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-8">
          <div className="shrink-0">
            <p className="text-xs text-slate-500 font-medium">Questão</p>
            <h2 className="text-base font-bold text-slate-900">
              {currentQ + 1} de {questions.length}
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
              <h1 className="text-xl font-bold text-slate-900">Questionário</h1>
              <p className="text-sm text-slate-500">Selecione a alternativa correta</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <p className="text-base font-semibold text-slate-900 leading-relaxed">
              {pergunta.text}
            </p>
          </div>

          <div className="space-y-3">
            {alternativas.map((alt, idx) => {
              const selected = currentAnswers[currentQ] === idx;
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
              className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Anterior
            </button>

            <button
              onClick={() => {
                if (currentQ < questions.length - 1) {
                  setCurrentQ(currentQ + 1);
                } else {
                  router.push(`/candidatura/${vagaId}/curriculo`);
                }
              }}
              disabled={currentAnswers[currentQ] === null}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {currentQ < questions.length - 1 ? "Próxima" : "Finalizar Questionário"}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
