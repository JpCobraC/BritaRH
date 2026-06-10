"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface JobRecruiter {
  id: string;
  title: string;
  area: string;
  workplace?: string;
  contract_type?: string;
  status: "open" | "closed";
  created_at: string;
  applicant_count: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiV1Url = rawUrl.replace(/\/api\/v1\/?$/, "") + "/api/v1";

  const [jobs, setJobs] = useState<JobRecruiter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${apiV1Url}/recruiter/jobs`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (res.ok) setJobs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [apiV1Url, session?.accessToken]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    else if (status === "authenticated") fetchJobs();
  }, [status, fetchJobs, router]);

  // Métricas derivadas dos dados reais
  const totalVagas = jobs.length;
  const vagasAtivas = jobs.filter((j) => j.status === "open").length;
  const totalCandidatos = jobs.reduce((s, j) => s + j.applicant_count, 0);
  const vagasRecentes = [...jobs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const metrics = [
    { icon: "work", label: "Total de Vagas", value: String(totalVagas), color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" },
    { icon: "work_history", label: "Vagas Ativas", value: String(vagasAtivas), color: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400" },
    { icon: "people", label: "Candidatos", value: String(totalCandidatos), color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400" },
    { icon: "inventory_2", label: "Vagas Encerradas", value: String(totalVagas - vagasAtivas), color: "bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400" },
  ];

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Bem-vindo de volta, {session?.user?.name?.split(" ")[0] || "Recrutador"} 👋
          </p>
        </div>
        <Link
          href="/admin/vagas/nova"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Nova Vaga
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-5 hover:shadow-md transition-shadow">
            <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${m.color.split(" ")[0]}`}>
              <span className={`material-symbols-outlined ${m.color.split(" ")[1]}`}>{m.icon}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{m.value}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Vagas Table */}
      <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#253326]">
          <h2 className="font-bold text-slate-900 dark:text-white">Vagas Recentes</h2>
          <Link href="/admin/vagas" className="text-primary dark:text-green-400 text-sm font-medium hover:underline flex items-center gap-1">
            Ver todas
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {vagasRecentes.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 opacity-30">work_off</span>
            <p className="font-medium">Nenhuma vaga criada ainda.</p>
            <Link href="/admin/vagas/nova" className="mt-4 inline-block text-primary dark:text-green-400 text-sm font-semibold hover:underline">
              Criar primeira vaga
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#152016] text-left border-b border-slate-100 dark:border-[#253326]">
                  <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Vaga</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Candidatos</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Criada em</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#253326]">
                {vagasRecentes.map((vaga) => (
                  <tr key={vaga.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1f2c20]/35 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">{vaga.title}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{vaga.area}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="material-symbols-outlined text-base text-slate-400">people</span>
                        {vaga.applicant_count}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        vaga.status === "open"
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800/40 dark:text-slate-400"
                      }`}>
                        {vaga.status === "open" ? "Ativa" : "Encerrada"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 text-primary dark:text-green-400 border border-primary/20 dark:border-green-500/20 rounded-xl text-xs font-bold hover:bg-primary/5 dark:hover:bg-green-500/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">people</span>
                        Analisar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
