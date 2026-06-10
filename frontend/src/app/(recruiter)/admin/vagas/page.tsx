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

type Filter = "Todas" | "Ativas" | "Encerradas";

const statusColors = {
  open: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  closed: "bg-slate-100 text-slate-500 dark:bg-[#152016]/40 dark:text-slate-400",
};

export default function VagasAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiV1Url = rawUrl.replace(/\/api\/v1\/?$/, "") + "/api/v1";

  const [jobs, setJobs] = useState<JobRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("Todas");

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

  const filtered = jobs.filter((j) => {
    if (filter === "Ativas") return j.status === "open";
    if (filter === "Encerradas") return j.status === "closed";
    return true;
  });

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Vagas</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{jobs.length} vaga{jobs.length !== 1 ? "s" : ""} no total</p>
        </div>
        <Link
          href="/admin/vagas/nova"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm shrink-0"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Nova Vaga
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["Todas", "Ativas", "Encerradas"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f
                ? "bg-primary text-white shadow-sm shadow-primary/10"
                : "bg-white dark:bg-[#1a251b] border border-slate-200 dark:border-[#253326] text-slate-600 dark:text-slate-300 hover:border-primary/30 dark:hover:border-green-500/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-3 opacity-30">work_off</span>
          <p className="font-medium">Nenhuma vaga encontrada.</p>
          {filter !== "Todas" && (
            <button onClick={() => setFilter("Todas")} className="mt-3 text-primary dark:text-green-400 text-sm font-semibold hover:underline">
              Ver todas
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((vaga) => (
            <div key={vaga.id} className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-5 hover:shadow-md dark:hover:shadow-green-950/10 transition-shadow flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{vaga.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {vaga.area}{vaga.contract_type ? ` · ${vaga.contract_type}` : ""}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusColors[vaga.status]}`}>
                  {vaga.status === "open" ? "Ativa" : "Encerrada"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">people</span>
                  {vaga.applicant_count} candidato{vaga.applicant_count !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-[#253326]">
                <Link
                  href="/dashboard"
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-primary dark:text-green-400 border border-primary/30 dark:border-green-500/30 rounded-lg text-xs font-semibold hover:bg-primary/5 dark:hover:bg-green-500/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">people</span>
                  Candidatos
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
