"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuestionBuilder } from "@/components/QuestionBuilder";

const inputCls =
  "w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-sm transition-all";
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

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
    if (questions.length < 5) {
      setError("Adicione pelo menos 5 questões ao questionário.");
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
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="size-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-500 text-lg">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Criar Nova Vaga</h1>
          <p className="text-slate-500 text-sm mt-0.5">Preencha os dados e o questionário para publicar</p>
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
              <label className={labelCls}>Título da Vaga *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Ex: Operador de Britagem" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Área *</label>
                <select name="area" value={form.area} onChange={handleChange} className={inputCls + " text-slate-600"}>
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
                <label className={labelCls}>Tipo de Contrato</label>
                <select name="contract_type" value={form.contract_type} onChange={handleChange} className={inputCls + " text-slate-600"}>
                  <option value="">Selecione...</option>
                  <option>CLT</option>
                  <option>PJ</option>
                  <option>Temporário</option>
                  <option>Estágio</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">quiz</span>
              Questionário
              <span className="text-xs font-normal text-slate-400 ml-1">
                {questions.length}/20 questões · mín. 5
              </span>
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              disabled={atMax}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Adicionar Questão
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">quiz</span>
              <p className="text-slate-500 text-sm font-medium">Nenhuma questão adicionada</p>
              <p className="text-slate-400 text-xs mt-1">Adicione pelo menos 5 questões para publicar a vaga</p>
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
                <div key={qIndex} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="size-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-black">
                        {qIndex + 1}
                      </span>
                      Questão {qIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="size-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none mb-4"
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
                              : "border-slate-300 text-slate-400 hover:border-primary/50"
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
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Clique no círculo para marcar a alternativa correta
                  </p>
                </div>
              ))}

              {atMax && (
                <p className="text-center text-sm text-amber-600 font-medium">
                  Limite máximo de 20 questões atingido.
                </p>
              )}

              <button
                type="button"
                onClick={addQuestion}
                disabled={atMax}
                className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 font-semibold rounded-xl hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Adicionar Questão
              </button>
            </div>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {/* Progresso do questionário */}
        {questions.length > 0 && questions.length < 5 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">warning</span>
            Adicione mais {5 - questions.length} questão(ões) para publicar a vaga.
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
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
