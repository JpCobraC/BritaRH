"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useJobs } from "@/presentation/hooks/useJobs";
import { useMyApplications } from "@/presentation/hooks/useMyApplications";
import Link from "next/link";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { jobs, loading: loadingJobs } = useJobs();
  const { appliedJobIds, loading: loadingApps } = useMyApplications();

  // Redireciona para o login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);


  if (status === "loading" || status === "unauthenticated" || loadingJobs || loadingApps) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark transition-colors duration-200">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Cruza os IDs do BD com os dados completos das vagas
  const appliedJobs = jobs.filter((j) => appliedJobIds.includes(j.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-6">
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Meu Perfil</h1>

        <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-200 dark:border-[#253326] p-8 shadow-sm">
          <div className="flex items-center gap-6 border-b border-slate-100 dark:border-[#253326] pb-8 mb-8">
            <div className="w-24 h-24 bg-primary/10 dark:bg-green-500/20 text-primary dark:text-green-400 rounded-full flex items-center justify-center text-4xl font-bold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{session?.user?.name || "Usuário"}</h2>
              <p className="text-slate-500 dark:text-slate-400">{session?.user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Conta Ativa
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Nome Completo</label>
                <div className="p-3 bg-slate-50 dark:bg-[#152016] rounded-xl border border-slate-100 dark:border-[#253326] text-slate-700 dark:text-slate-300">
                  {session?.user?.name || "Não informado"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">E-mail</label>
                <div className="p-3 bg-slate-50 dark:bg-[#152016] rounded-xl border border-slate-100 dark:border-[#253326] text-slate-700 dark:text-slate-300">
                  {session?.user?.email || "Não informado"}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#253326]">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Minhas Candidaturas</h3>
              {appliedJobs.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-[#152016] border border-dashed border-slate-300 dark:border-[#253326] rounded-2xl">
                  <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500 mb-2">work_history</span>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">Você ainda não se candidatou a nenhuma vaga.</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Explore as vagas disponíveis e dê o próximo passo na sua carreira.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appliedJobs.map((vaga) => (
                    <div key={vaga.id} className="p-5 border border-slate-150 dark:border-[#253326] rounded-2xl bg-white dark:bg-[#152016] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/20 dark:hover:border-green-500/20 transition-all">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-base">{vaga.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{vaga.area} • {vaga.workplace || "Remoto"}</p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 text-xs font-bold rounded-full">
                          Em Análise
                        </span>
                        <Link 
                          href="/vagas" 
                          className="text-xs text-primary dark:text-green-400 font-bold hover:underline"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
