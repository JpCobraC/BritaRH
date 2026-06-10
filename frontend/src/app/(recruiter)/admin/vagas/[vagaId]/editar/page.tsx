"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditarVagaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "Operador de Britagem",
    area: "Operações",
    nivel: "Operacional",
    tipo: "CLT",
    vagas: "3",
    local: "Belo Horizonte, MG",
    salarioMin: "2.800",
    salarioMax: "3.500",
    descricao:
      "Responsável pela operação de equipamentos de britagem, controle de qualidade do material processado e manutenção preventiva de máquinas.",
    requisitos:
      "Ensino médio completo\nExperiência mínima de 1 ano em operações industriais\nCNH B\nDisponibilidade para trabalho em turnos",
    encerra: "2024-03-28",
    status: "Ativa",
  });

  const inputCls =
    "w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-sm text-slate-900 dark:text-white transition-all";
  const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="size-9 rounded-lg border border-slate-200 dark:border-[#253326] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#1a251b] transition-colors"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Editar Vaga</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{form.titulo}</p>
        </div>
        <span
          className={`ml-2 text-xs font-bold px-3 py-1 rounded-full ${
            form.status === "Ativa" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-[#152016]/40 dark:text-slate-400"
          }`}
        >
          {form.status}
        </span>
      </div>

      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-6">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary dark:text-green-400">info</span>
            Informações Básicas
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Título da Vaga *</label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Área</label>
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className={inputCls + " text-slate-600 dark:text-slate-300"}
                >
                  {["Operações", "Manutenção", "Engenharia", "Geologia", "Segurança", "Administrativo"].map((o) => (
                    <option key={o} className="dark:bg-[#152016]">{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Nível</label>
                <select
                  name="nivel"
                  value={form.nivel}
                  onChange={handleChange}
                  className={inputCls + " text-slate-600 dark:text-slate-300"}
                >
                  {["Operacional", "Técnico", "Júnior", "Pleno", "Sênior", "Coordenação"].map((o) => (
                    <option key={o} className="dark:bg-[#152016]">{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Tipo de Contrato</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className={inputCls + " text-slate-600 dark:text-slate-300"}
                >
                  {["CLT", "PJ", "Temporário", "Estágio"].map((o) => (
                    <option key={o} className="dark:bg-[#152016]">{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Nº de Vagas</label>
                <input
                  type="number"
                  name="vagas"
                  min="1"
                  value={form.vagas}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Encerramento</label>
                <input
                  type="date"
                  name="encerra"
                  value={form.encerra}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Localização e Salário */}
        <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-6">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary dark:text-green-400">location_on</span>
            Localização e Remuneração
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Local de Trabalho</label>
              <input
                name="local"
                value={form.local}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Salário Mínimo (R$)</label>
                <input
                  name="salarioMin"
                  value={form.salarioMin}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Salário Máximo (R$)</label>
                <input
                  name="salarioMax"
                  value={form.salarioMax}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-6">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary dark:text-green-400">description</span>
            Descrição e Requisitos
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Descrição da Vaga</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={5}
                className={inputCls + " resize-none"}
              />
            </div>
            <div>
              <label className={labelCls}>Requisitos e Qualificações</label>
              <textarea
                name="requisitos"
                value={form.requisitos}
                onChange={handleChange}
                rows={4}
                className={inputCls + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-8">
          <button className="flex items-center justify-center gap-2 px-5 py-3 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 transition-all text-sm w-full sm:w-auto">
            <span className="material-symbols-outlined text-base">delete</span>
            Excluir Vaga
          </button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-200 dark:border-[#253326] text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a251b] transition-all text-sm w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
