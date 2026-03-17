"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaVagaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    area: "",
    nivel: "",
    tipo: "",
    vagas: "1",
    local: "",
    salarioMin: "",
    salarioMax: "",
    descricao: "",
    requisitos: "",
    encerra: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="size-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-500 text-lg">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Criar Nova Vaga</h1>
          <p className="text-slate-500 text-sm mt-0.5">Preencha os dados para publicar a vaga</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary">info</span>
            Informações Básicas
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título da Vaga *</label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ex: Operador de Britagem"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Área *</label>
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all text-slate-600"
                >
                  <option value="">Selecione...</option>
                  <option>Operações</option>
                  <option>Manutenção</option>
                  <option>Engenharia</option>
                  <option>Geologia</option>
                  <option>Segurança</option>
                  <option>Administrativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nível *</label>
                <select
                  name="nivel"
                  value={form.nivel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all text-slate-600"
                >
                  <option value="">Selecione...</option>
                  <option>Operacional</option>
                  <option>Técnico</option>
                  <option>Júnior</option>
                  <option>Pleno</option>
                  <option>Sênior</option>
                  <option>Coordenação</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Contrato *</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all text-slate-600"
                >
                  <option value="">Selecione...</option>
                  <option>CLT</option>
                  <option>PJ</option>
                  <option>Temporário</option>
                  <option>Estágio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Número de Vagas</label>
                <input
                  type="number"
                  name="vagas"
                  min="1"
                  value={form.vagas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Encerramento</label>
                <input
                  type="date"
                  name="encerra"
                  value={form.encerra}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Localização e Salário */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary">location_on</span>
            Localização e Remuneração
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Local de Trabalho *</label>
              <input
                name="local"
                value={form.local}
                onChange={handleChange}
                placeholder="Ex: Belo Horizonte, MG"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Salário Mínimo (R$)</label>
                <input
                  name="salarioMin"
                  value={form.salarioMin}
                  onChange={handleChange}
                  placeholder="2.800"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Salário Máximo (R$)</label>
                <input
                  name="salarioMax"
                  value={form.salarioMax}
                  onChange={handleChange}
                  placeholder="3.500"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary">description</span>
            Descrição e Requisitos
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição da Vaga *</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={5}
                placeholder="Descreva as responsabilidades, atividades e benefícios da vaga..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Requisitos e Qualificações</label>
              <textarea
                name="requisitos"
                value={form.requisitos}
                onChange={handleChange}
                rows={4}
                placeholder="Liste os requisitos necessários (um por linha): Ex: CNH B, Experiência mínima de 2 anos..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
          >
            Cancelar
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-primary/30 text-primary font-semibold rounded-xl hover:bg-primary/5 transition-all text-sm">
              <span className="material-symbols-outlined text-base">save</span>
              Salvar Rascunho
            </button>
            <button
              onClick={() => router.push("/admin/vagas")}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm"
            >
              <span className="material-symbols-outlined text-base">publish</span>
              Publicar Vaga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
