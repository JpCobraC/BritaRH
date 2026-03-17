"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import ProgressBar from "@/components/ui/ProgressBar";

export default function CurriculoPage() {
  const router = useRouter();
  const params = useParams();
  const vagaId = params.vagaId as string;

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") setFile(selected);
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-8">
          <div className="shrink-0">
            <p className="text-xs text-slate-500 font-medium">Último passo</p>
            <h2 className="text-base font-bold text-slate-900">Envio de Currículo</h2>
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

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">upload_file</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Currículo e Mensagem</h1>
              <p className="text-sm text-slate-500">Envie seu currículo em PDF (máx. 5 MB)</p>
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-primary bg-primary/5"
                : file
                ? "border-primary/40 bg-primary/5"
                : "border-slate-200 hover:border-primary/30 hover:bg-slate-50"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFile}
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">picture_as_pdf</span>
                </div>
                <p className="font-semibold text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Remover
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 bg-slate-100 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl">cloud_upload</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">
                    Arraste seu PDF aqui ou <span className="text-primary">clique para selecionar</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-1">PDF, máximo 5 MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Mensagem */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Mensagem para o recrutador{" "}
              <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={4}
              placeholder="Apresente-se brevemente e explique por que você é o candidato ideal para esta vaga..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{mensagem.length}/500 caracteres</p>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => router.push(`/candidatura/${vagaId}/teste`)}
              className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Voltar ao Teste
            </button>

            <button
              onClick={() => router.push(`/candidatura/${vagaId}/confirmacao`)}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-base">send</span>
              Enviar Candidatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
