"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuestionBuilder } from "@/components/QuestionBuilder";

const inputCls =
  "w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 bg-slate-50 dark:bg-[#152016] text-sm text-slate-900 dark:text-white transition-all";
const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

export default function NovaVagaPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiV1Url = rawUrl.replace(/\/api\/v1\/?$/, "") + "/api/v1";

  const [form, setForm] = useState({
    title: "",
    area: "",
    contract_type: "",
    schedule: "",
    workplace: "",
    description: "",
    requirements: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    questions,
    minError,
    atMax,
    addQuestion,
    removeQuestion,
    updateField,
    updateOption,
  } = useQuestionBuilder(0);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePublish() {
    // Valida campos obrigatórios
    if (!form.title || !form.area) {
      setError("Preencha o título e a área da vaga.");
      return;
    }
    const incomplete = questions.findIndex(
      (q) => !q.text.trim() || q.options.some((o) => !o.trim())
    );
    if (incomplete !== -1) {
      setError(`A questão ${incomplete + 1} está incompleta. Preencha o enunciado e todas as alternativas.`);
      return;
    }

    setError("");
    setSaving(true);
    try {
      const res = await fetch(`${apiV1Url}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          ...form,
          questions: questions.map((q) => ({
            text: q.text,
            options: q.options,
            correct_index: q.correct_index,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Erro ${res.status}`);
      }

      router.push("/admin/vagas");
    } catch (err: any) {
      setError(err.message || "Erro ao publicar vaga.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="size-9 rounded-lg border border-slate-200 dark:border-[#253326] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#1a251b] transition-colors"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Criar Nova Vaga</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Preencha os dados e o questionário para publicar</p>
        </div>
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
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Ex: Operador de Britagem" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Área *</label>
                <select name="area" value={form.area} onChange={handleChange} className={inputCls + " text-slate-600 dark:text-slate-300"}>
                  <option value="" className="dark:bg-[#152016]">Selecione...</option>
                  <option className="dark:bg-[#152016]">Operações</option>
                  <option className="dark:bg-[#152016]">Manutenção</option>
                  <option className="dark:bg-[#152016]">Engenharia</option>
                  <option className="dark:bg-[#152016]">Geologia</option>
                  <option className="dark:bg-[#152016]">Segurança</option>
                  <option className="dark:bg-[#152016]">Administrativo</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Tipo de Contrato</label>
                <select name="contract_type" value={form.contract_type} onChange={handleChange} className={inputCls + " text-slate-600 dark:text-slate-300"}>
                  <option value="" className="dark:bg-[#152016]">Selecione...</option>
                  <option className="dark:bg-[#152016]">CLT</option>
                  <option className="dark:bg-[#152016]">PJ</option>
                  <option className="dark:bg-[#152016]">Temporário</option>
                  <option className="dark:bg-[#152016]">Estágio</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Local de Trabalho</label>
                <input name="workplace" value={form.workplace} onChange={handleChange}
                  placeholder="Ex: Belo Horizonte, MG" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Jornada</label>
                <input name="schedule" value={form.schedule} onChange={handleChange}
                  placeholder="Ex: Segunda a Sexta, 7h–17h" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Descrição da Vaga</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={4} placeholder="Descreva responsabilidades e benefícios..."
                className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Requisitos e Qualificações</label>
              <textarea name="requirements" value={form.requirements} onChange={handleChange}
                rows={3} placeholder="Liste os requisitos necessários..."
                className={inputCls + " resize-none"} />
            </div>
          </div>
        </div>

        {/* Questionário */}
        <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-green-400">quiz</span>
              Questionário
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
                {questions.length} questão(ões)
              </span>
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              disabled={atMax}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary/10 dark:bg-green-500/10 text-primary dark:text-green-400 font-semibold rounded-xl hover:bg-primary/20 dark:hover:bg-green-500/20 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Adicionar Questão
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-slate-200 dark:border-[#253326] rounded-xl">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-2">quiz</span>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Nenhuma questão adicionada</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Adicione questões ao questionário se desejar testar os candidatos</p>
              <button
                type="button"
                onClick={addQuestion}
                className="mt-4 px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm"
              >
                + Adicionar primeira questão
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-slate-200 dark:border-[#253326] rounded-xl p-5 bg-slate-50/50 dark:bg-[#152016]/40">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="size-6 bg-primary/10 dark:bg-green-500/20 text-primary dark:text-green-400 rounded-full flex items-center justify-center text-xs font-black">
                        {qIndex + 1}
                      </span>
                      Questão {qIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="size-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                      title="Remover questão"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>

                  {/* Enunciado */}
                  <textarea
                    placeholder="Digite o enunciado da questão..."
                    value={q.text}
                    onChange={(e) => updateField(qIndex, "text", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-[#253326] rounded-xl bg-white dark:bg-[#1a251b] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 text-sm resize-none mb-4"
                  />

                  {/* Alternativas */}
                  <div className="space-y-2">
                    {(["A", "B", "C", "D"] as const).map((letter, optIndex) => (
                      <div key={letter} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateField(qIndex, "correct_index", optIndex)}
                          className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all font-bold text-xs ${
                            q.correct_index === optIndex
                              ? "border-primary bg-primary text-white"
                              : "border-slate-300 dark:border-[#253326] text-slate-400 dark:text-slate-500 hover:border-primary/50 dark:hover:border-green-500/50"
                          }`}
                          title="Marcar como correta"
                        >
                          {q.correct_index === optIndex
                            ? <span className="material-symbols-outlined text-sm">check</span>
                            : letter}
                        </button>
                        <input
                          placeholder={`Alternativa ${letter}`}
                          value={q.options[optIndex]}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-[#253326] rounded-xl bg-white dark:bg-[#1a251b] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-500/20 focus:border-primary dark:focus:border-green-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    Clique no círculo para marcar a alternativa correta
                  </p>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                disabled={atMax}
                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-[#253326] text-slate-500 dark:text-slate-400 font-semibold rounded-xl hover:border-primary/40 dark:hover:border-green-500/40 hover:text-primary dark:hover:text-green-400 hover:bg-primary/5 dark:hover:bg-green-500/5 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Adicionar Questão
              </button>
            </div>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-200 dark:border-[#253326] text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a251b] transition-all text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">publish</span>
                Publicar Vaga ({questions.length} questões)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
