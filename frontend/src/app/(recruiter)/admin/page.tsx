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
    { icon: "work", label: "Total de Vagas", value: String(totalVagas), color: "bg-blue-50 text-blue-600" },
    { icon: "work_history", label: "Vagas Ativas", value: String(vagasAtivas), color: "bg-green-50 text-green-600" },
    { icon: "people", label: "Candidatos", value: String(totalCandidatos), color: "bg-purple-50 text-purple-600" },
    { icon: "inventory_2", label: "Vagas Encerradas", value: String(totalVagas - vagasAtivas), color: "bg-slate-50 text-slate-500" },
  ];

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel de Controle</h1>
          <p className="text-slate-500 text-sm mt-1">
            Bem-vindo de volta, {session?.user?.name?.split(" ")[0] || "Recrutador"} 👋
          </p>
        </div>
        <Link
          href="/admin/vagas/nova"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Nova Vaga
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${m.color.split(" ")[0]}`}>
              <span className={`material-symbols-outlined ${m.color.split(" ")[1]}`}>{m.icon}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{m.value}</p>
            <p className="text-sm font-medium text-slate-600 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Vagas Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Vagas Recentes</h2>
          <Link href="/admin/vagas" className="text-primary text-sm font-medium hover:underline">
            Ver todas
          </Link>
        </div>

        {vagasRecentes.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 opacity-30">work_off</span>
            <p className="font-medium">Nenhuma vaga criada ainda.</p>
            <Link href="/admin/vagas/nova" className="mt-4 inline-block text-primary text-sm font-semibold hover:underline">
              Criar primeira vaga
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Vaga</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Candidatos</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Criada em</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vagasRecentes.map((vaga) => (
                  <tr key={vaga.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{vaga.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{vaga.area}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="material-symbols-outlined text-base text-slate-400">people</span>
                        {vaga.applicant_count}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        vaga.status === "open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {vaga.status === "open" ? "Ativa" : "Encerrada"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-1 px-3 py-1.5 text-primary border border-primary/30 rounded-lg text-xs font-semibold hover:bg-primary/5 transition-colors w-fit"
                      >
                        <span className="material-symbols-outlined text-sm">people</span>
                        Ver Candidatos
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
