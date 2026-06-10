"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const candidatos = [
  {
    id: "1",
    nome: "João Carlos Pereira",
    email: "joao@email.com",
    cidade: "Belo Horizonte, MG",
    experiencia: "3 a 5 anos",
    pontuacao: 82,
    status: "Em análise",
    data: "12/03/2024",
  },
  {
    id: "2",
    nome: "Marcos Antônio Lima",
    email: "marcos@email.com",
    cidade: "Contagem, MG",
    experiencia: "1 a 3 anos",
    pontuacao: 74,
    status: "Em análise",
    data: "13/03/2024",
  },
  {
    id: "3",
    nome: "Fernanda Silva Souza",
    email: "fernanda@email.com",
    cidade: "Belo Horizonte, MG",
    experiencia: "Mais de 5 anos",
    pontuacao: 91,
    status: "Aprovado",
    data: "11/03/2024",
  },
  {
    id: "4",
    nome: "Carlos Eduardo Ramos",
    email: "carlos@email.com",
    cidade: "Sabará, MG",
    experiencia: "Menos de 1 ano",
    pontuacao: 48,
    status: "Reprovado",
    data: "14/03/2024",
  },
  {
    id: "5",
    nome: "Ana Paula Rocha",
    email: "ana@email.com",
    cidade: "Nova Lima, MG",
    experiencia: "1 a 3 anos",
    pontuacao: 67,
    status: "Contratado",
    data: "10/03/2024",
  },
];

const statusColors: Record<string, string> = {
  "Em análise": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Aprovado: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Reprovado: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  Contratado: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

function pontosColor(p: number) {
  if (p >= 80) return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/20";
  if (p >= 60) return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20";
  return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20";
}

export default function CandidatosPage() {
  const params = useParams();
  const [modal, setModal] = useState<typeof candidatos[0] | null>(null);
  const [statusFiltro, setStatusFiltro] = useState("Todos");

  const filtrados =
    statusFiltro === "Todos" ? candidatos : candidatos.filter((c) => c.status === statusFiltro);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="size-9 rounded-lg border border-slate-200 dark:border-[#253326] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#1a251b] transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Candidatos — Operador de Britagem</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Vaga #{params.vagaId}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["Todos", "Em análise", "Aprovado", "Reprovado", "Contratado"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFiltro(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              statusFiltro === s
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "bg-white dark:bg-[#1a251b] border border-slate-200 dark:border-[#253326] text-slate-600 dark:text-slate-300 hover:border-primary/30 dark:hover:border-green-500/30"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Candidatos Cards */}
      <div className="space-y-3">
        {filtrados.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
          >
            {/* Left Block - Avatar + info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="size-12 rounded-full bg-primary/10 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                <span className="text-primary dark:text-green-400 font-bold text-lg">
                  {c.nome.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">{c.nome}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{c.email} · {c.cidade}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">work_history</span>
                    {c.experiencia}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {c.data}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Block - Score, Status, Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between md:justify-end">
              {/* Score */}
              <div className={`text-center px-4 py-2 rounded-xl min-w-[70px] ${pontosColor(c.pontuacao)}`}>
                <p className="text-xl font-bold leading-none">{c.pontuacao}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider mt-1">pontos</p>
              </div>

              {/* Status */}
              <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${statusColors[c.status]}`}>
                {c.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="#"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#253326] rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#1a251b] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">description</span>
                  Currículo
                </a>
                <button
                  onClick={() => setModal(c)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 text-white bg-primary rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">how_to_reg</span>
                  Contratar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Confirmar Contratação</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Você está prestes a contratar este candidato
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-[#202c21] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">close</span>
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-[#152016]/40 border border-slate-100 dark:border-[#253326] rounded-xl p-4 flex items-center gap-3">
              <div className="size-12 rounded-full bg-primary/10 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                <span className="text-primary dark:text-green-400 font-bold text-lg">{modal.nome.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{modal.nome}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{modal.email}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{modal.experiencia} de experiência</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4">
              <p className="text-sm text-green-800 dark:text-green-400 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-base">info</span>
                O candidato será notificado por e-mail e a vaga será atualizada.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 px-4 py-3 border border-slate-200 dark:border-[#253326] text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a251b] transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setModal(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                Confirmar Contratação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
