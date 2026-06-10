"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface JobRecruiter {
  id: string;
  title: string;
  area: string;
  workplace?: string;
  status: "open" | "closed";
  created_at: string;
  applicant_count: number;
}

interface Application {
  id: string;
  candidate_email: string;
  profile_data: any;
  score: number;
  message?: string;
  resume_url: string;
  created_at: string;
}

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiBaseUrl = rawUrl.replace(/\/api\/v1\/?$/, "");
  const apiV1Url = `${apiBaseUrl}/api/v1`;
  
  const [jobs, setJobs] = useState<JobRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobRecruiter | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${apiV1Url}/recruiter/jobs`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [apiV1Url, session?.accessToken]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session?.user?.role !== "recruiter") {
      router.push("/vagas");
    } else {
      fetchJobs();
    }
  }, [session, status, router, fetchJobs]);

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    
    // Save previous state for potential rollback
    const previousJobs = [...jobs];
    const previousSelectedJob = selectedJob ? { ...selectedJob } : null;

    // Optimistic Update
    setJobs(prevJobs => prevJobs.map(j => j.id === jobId ? { ...j, status: newStatus as any } : j));
    if (selectedJob?.id === jobId) {
      setSelectedJob(prevSelected => prevSelected ? { ...prevSelected, status: newStatus as any } : null);
    }

    try {
      const res = await fetch(`${apiV1Url}/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status on server");
      }
    } catch (error) {
      console.error("Error updating job status, rolling back:", error);
      // Rollback to previous state on error
      setJobs(previousJobs);
      setSelectedJob(previousSelectedJob);
    }
  };

  const viewApplications = async (job: JobRecruiter) => {
    setSelectedJob(job);
    setLoadingApps(true);
    setApplications([]);
    setShowMobileDetail(true); // Exibe o painel de candidatos no mobile
    try {
      const res = await fetch(`${apiV1Url}/recruiter/jobs/${job.id}/applications`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Painel de Gestão</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Gerencie suas vagas e candidaturas em um só lugar.</p>
        </div>
      </header>

      {/* Grid Layout - Master Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Jobs List (Master) */}
        <div className={`lg:col-span-2 space-y-4 ${showMobileDetail ? "hidden lg:block" : "block"}`}>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Suas Vagas</h2>
          {jobs.length === 0 ? (
            <div className="bg-white dark:bg-[#1a251b] p-8 rounded-2xl border border-dashed border-slate-300 dark:border-[#253326] text-center text-slate-500">
              Nenhuma vaga criada ainda.
            </div>
          ) : (
            jobs.map(job => (
              <div 
                key={job.id} 
                className={`bg-white dark:bg-[#1a251b] rounded-2xl border transition-all p-6 ${
                  selectedJob?.id === job.id 
                    ? 'border-primary dark:border-green-500 shadow-md ring-1 ring-primary/20 dark:ring-green-500/20' 
                    : 'border-slate-100 dark:border-[#253326]'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`size-2 rounded-full ${job.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        job.status === 'open' ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                      }`}>
                        {job.status === 'open' ? 'Vaga Ativa' : 'Vaga Fechada'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{job.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{job.area} • {job.workplace || 'Remoto'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="bg-slate-50 dark:bg-[#152016] p-2 rounded-xl border border-slate-100 dark:border-[#253326] text-center min-w-[80px]">
                      <p className="text-xl font-black text-slate-900 dark:text-white">{job.applicant_count}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Candidatos</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-[#253326] flex items-center justify-between">
                  <button 
                    onClick={() => viewApplications(job)}
                    className="flex items-center gap-2 text-primary dark:text-green-400 font-bold hover:gap-3 transition-all text-sm px-4 py-2 rounded-lg bg-primary/5 dark:bg-green-500/10 hover:bg-primary/10 dark:hover:bg-green-500/20"
                  >
                    Ver Candidatos
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleJobStatus(job.id, job.status)}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border transition-all ${
                      job.status === 'open' 
                        ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20' 
                        : 'border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {job.status === 'open' ? 'do_not_disturb_on' : 'check_circle'}
                    </span>
                    {job.status === 'open' ? 'Encerrar Vaga' : 'Reabrir Vaga'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Applications View (Detail) */}
        <div className={`lg:col-span-1 ${showMobileDetail ? "block" : "hidden lg:block"}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Candidaturas</h2>
            {showMobileDetail && (
              <button
                onClick={() => setShowMobileDetail(false)}
                className="lg:hidden flex items-center gap-1 text-xs font-bold text-primary dark:text-green-400 px-3 py-1.5 bg-primary/5 dark:bg-green-500/10 rounded-lg hover:bg-primary/10 transition-all"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Ver Vagas
              </button>
            )}
          </div>
          
          <div className="bg-white dark:bg-[#1a251b] rounded-3xl border border-slate-100 dark:border-[#253326] shadow-sm min-h-[500px] flex flex-col overflow-hidden">
            {!selectedJob ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">contacts</span>
                <p className="font-medium">Selecione uma vaga para ver os candidatos</p>
              </div>
            ) : (
              <>
                <div className="p-6 bg-slate-50/50 dark:bg-[#152016]/40 border-b border-slate-100 dark:border-[#253326]">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{selectedJob.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">{applications.length} interessados até o momento</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[550px]">
                  {loadingApps ? (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm">Nenhum candidato ainda.</p>
                    </div>
                  ) : (
                    applications.map(app => (
                      <div key={app.id} className="p-4 rounded-2xl border border-slate-100 dark:border-[#253326] bg-white dark:bg-[#152016] shadow-xs">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-white leading-tight truncate">{app.profile_data.full_name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{app.candidate_email}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-black shrink-0 ${
                            app.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                            app.score >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                            'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          }`}>
                            {app.score}%
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 dark:border-[#253326]">
                          <a 
                            href={`${apiV1Url}/storage/download/${app.resume_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#202c21] dark:hover:bg-[#2c3d2e] text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">description</span>
                            Currículo
                          </a>
                          <a
                            href={`mailto:${app.candidate_email}?subject=${encodeURIComponent(`BritaRH – Vaga: ${selectedJob.title}`)}&body=${encodeURIComponent(`Olá, ${app.profile_data?.full_name || ''}!\n\nEntramos em contato a respeito da sua candidatura para a vaga de ${selectedJob.title} na BritaRH Mineração.\n\nAguardamos seu retorno.\n\nAtenciosamente,\nEquipe BritaRH`)}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/5 hover:bg-primary/10 dark:bg-green-500/10 dark:hover:bg-green-500/20 text-primary dark:text-green-400 rounded-xl text-[10px] font-bold transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">send</span>
                            Contatar
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
