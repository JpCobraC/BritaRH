"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import ProgressBar from "@/components/ui/ProgressBar";

export default function PerfilPage() {
  const router = useRouter();
  const params = useParams();
  const vagaId = params.vagaId as string;

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    experiencia: "",
    disponibilidade: "",
    pretensao: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Candidatura para</p>
            <h2 className="text-base font-bold text-slate-900">Operador de Britagem</h2>
          </div>
          <ProgressBar value={33} label="Progresso" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={1} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Informações Pessoais</h1>
              <p className="text-sm text-slate-500">Preencha seus dados para continuar</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo *</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone *</label>
                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(31) 99999-9999"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cidade / Estado *</label>
                <input
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder="Belo Horizonte, MG"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nível de experiência *</label>
              <select
                name="experiencia"
                value={form.experiencia}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all text-slate-600"
              >
                <option value="">Selecione...</option>
                <option>Sem experiência</option>
                <option>Menos de 1 ano</option>
                <option>1 a 3 anos</option>
                <option>3 a 5 anos</option>
                <option>Mais de 5 anos</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Disponibilidade</label>
                <select
                  name="disponibilidade"
                  value={form.disponibilidade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all text-slate-600"
                >
                  <option value="">Selecione...</option>
                  <option>Imediata</option>
                  <option>2 semanas</option>
                  <option>30 dias</option>
                  <option>A combinar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pretensão salarial</label>
                <input
                  name="pretensao"
                  value={form.pretensao}
                  onChange={handleChange}
                  placeholder="R$ 0.000"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => router.push(`/candidatura/${vagaId}/teste`)}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              Próximo: Teste de Conhecimento
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
