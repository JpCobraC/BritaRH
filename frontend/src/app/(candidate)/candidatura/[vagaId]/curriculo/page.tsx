"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import ProgressBar from "@/components/ui/ProgressBar";
import { useApplicationWizard } from "@/presentation/contexts/ApplicationWizardContext";

export default function CurriculoPage() {
  const router = useRouter();
  const params = useParams();
  const vagaId = params.vagaId as string;

  const {
    resumeFile,
    message,
    updateResume,
    submitCandidacy,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useApplicationWizard();

  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (submitSuccess) {
      router.push(`/candidatura/${vagaId}/confirmacao`);
    }
  }, [submitSuccess, router, vagaId]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      updateResume(dropped, message);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") {
      updateResume(selected, message);
    }
  }

  const handleSend = async () => {
    await submitCandidacy();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* Sub-header */}
      <div className="bg-white dark:bg-[#1a251b] border-b border-slate-100 dark:border-[#253326] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-8">
          <div className="shrink-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Último passo</p>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Envio de Currículo</h2>
          </div>
          <div className="flex-1">
            <ProgressBar value={100} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <StepIndicator currentStep={3} />
        </div>

        <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-primary/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary dark:text-green-400">upload_file</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Currículo e Mensagem</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Envie seu currículo em PDF (máx. 5 MB)</p>
            </div>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-lg">error</span>
              {submitError}
            </div>
          )}

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-primary bg-primary/5 dark:bg-green-500/10"
                : resumeFile
                ? "border-primary/40 bg-primary/5 dark:border-green-500/30 dark:bg-green-500/10"
                : "border-slate-200 dark:border-[#253326] hover:border-primary/30 dark:hover:border-green-500/30 hover:bg-slate-50 dark:hover:bg-[#152016]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFile}
              disabled={isSubmitting}
            />

            {resumeFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 bg-primary/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary dark:text-green-400 text-3xl">picture_as_pdf</span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">{resumeFile.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); updateResume(null, message); }}
                  disabled={isSubmitting}
                  className="text-xs text-red-500 hover:text-red-750 flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Remover
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 bg-slate-100 dark:bg-[#152016] rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-3xl">cloud_upload</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Arraste seu PDF aqui ou <span className="text-primary dark:text-green-400">clique para selecionar</span>
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">PDF, máximo 5 MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Mensagem */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Mensagem para o recrutador{" "}
              <span className="text-slate-400 dark:text-slate-500 font-normal">(opcional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => updateResume(resumeFile, e.target.value)}
              disabled={isSubmitting}
              rows={4}
              maxLength={500}
              placeholder="Apresente-se brevemente e explique por que você é o candidato ideal para esta vaga..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-sm text-slate-900 dark:text-white transition-all resize-none"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">{message.length}/500 caracteres</p>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-[#253326]">
            <button
              onClick={() => router.push(`/candidatura/${vagaId}/teste`)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-[#253326] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#152016] transition-all text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Voltar ao Questionário
            </button>

            <button
              onClick={handleSend}
              disabled={isSubmitting || !resumeFile}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  Enviar Candidatura
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
