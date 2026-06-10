"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import ProgressBar from "@/components/ui/ProgressBar";
import { maskPhone } from "@/utils/masks";
import { useApplicationWizard } from "@/presentation/contexts/ApplicationWizardContext";
import { useJobDetails } from "@/presentation/hooks/useJobDetails";

export default function PerfilPage() {
  const router = useRouter();
  const params = useParams();
  const vagaId = params.vagaId as string;

  const { job, loading: loadingJob } = useJobDetails(vagaId);
  const { profile, updateProfile } = useApplicationWizard();
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "phone") {
      updateProfile({ [name]: maskPhone(value) });
    } else {
      updateProfile({ [name]: value });
    }
  }

  const handleNext = () => {
    if (!profile.fullName.trim()) {
      setValidationError("Por favor, preencha seu nome completo.");
      return;
    }
    if (!profile.email.trim() || !profile.email.includes("@")) {
      setValidationError("Por favor, insira um e-mail válido.");
      return;
    }
    if (!profile.phone.trim()) {
      setValidationError("Por favor, insira seu telefone.");
      return;
    }
    if (!profile.cidade.trim()) {
      setValidationError("Por favor, insira sua cidade.");
      return;
    }
    if (!profile.experiencia) {
      setValidationError("Por favor, selecione seu nível de experiência.");
      return;
    }
    setValidationError(null);
    router.push(`/candidatura/${vagaId}/teste`);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* Sub-header */}
      <div className="bg-white dark:bg-[#1a251b] border-b border-slate-100 dark:border-[#253326] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Candidatura para</p>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {loadingJob ? "Carregando..." : (job?.title || "Vaga de Mineração")}
            </h2>
          </div>
          <ProgressBar value={33} label="Progresso" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={1} />
        </div>

        <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-primary/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary dark:text-green-400">person</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Informações Pessoais</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Preencha seus dados para continuar</p>
            </div>
          </div>

          {validationError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-lg">error</span>
              {validationError}
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome completo *</label>
                <input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail *</label>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefone *</label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="(31) 99999-9999"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cidade / Estado *</label>
                <input
                  name="cidade"
                  value={profile.cidade}
                  onChange={handleChange}
                  placeholder="Belo Horizonte, MG"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nível de experiência *</label>
              <select
                name="experiencia"
                value={profile.experiencia}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-sm transition-all text-slate-600 dark:text-slate-300"
              >
                <option value="" className="dark:bg-[#152016]">Selecione...</option>
                <option className="dark:bg-[#152016]">Sem experiência</option>
                <option className="dark:bg-[#152016]">Menos de 1 ano</option>
                <option className="dark:bg-[#152016]">1 a 3 anos</option>
                <option className="dark:bg-[#152016]">3 a 5 anos</option>
                <option className="dark:bg-[#152016]">Mais de 5 anos</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Disponibilidade</label>
                <select
                  name="disponibilidade"
                  value={profile.disponibilidade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-sm transition-all text-slate-600 dark:text-slate-300"
                >
                  <option value="" className="dark:bg-[#152016]">Selecione...</option>
                  <option className="dark:bg-[#152016]">Imediata</option>
                  <option className="dark:bg-[#152016]">2 semanas</option>
                  <option className="dark:bg-[#152016]">30 dias</option>
                  <option className="dark:bg-[#152016]">A combinar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pretensão salarial</label>
                <input
                  name="pretensao"
                  value={profile.pretensao}
                  onChange={handleChange}
                  placeholder="R$ 0.000"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t border-slate-100 dark:border-[#253326]">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              Próximo: Questionário
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
